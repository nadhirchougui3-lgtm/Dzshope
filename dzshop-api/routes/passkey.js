
import express from 'express'
import rateLimit from 'express-rate-limit'
import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'

import User from '../models/User.js'
import PasskeyCredential from '../models/PasskeyCredential.js'
import WebAuthnChallenge from '../models/WebAuthnChallenge.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Please try again later.',
  },
})

router.use(limiter)

function getOrigins() {
  const raw =
    process.env.WEBAUTHN_ORIGIN ||
    process.env.FRONTEND_URL ||
    'http://localhost:5173'

  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

function getRpId() {
  if (process.env.WEBAUTHN_RP_ID) {
    return process.env.WEBAUTHN_RP_ID
  }

  const origins = getOrigins()

  if (!origins.length) {
    throw new Error('WEBAUTHN_ORIGIN is not configured.')
  }

  return new URL(origins[0]).hostname
}

function createToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function saveChallenge({ challenge, userId = null, type }) {
  const challengeId = randomBytes(24).toString('base64url')

  await WebAuthnChallenge.create({
    challengeId,
    challenge,
    userId,
    type,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  })

  return challengeId
}

// List passkeys belonging to the signed-in user.
router.get('/me', protect, async (req, res) => {
  try {
    const passkeys = await PasskeyCredential.find({
      userId: req.user._id,
    })
      .select('_id transports deviceType backedUp createdAt')
      .sort({ createdAt: -1 })
      .lean()

    return res.json({ passkeys })
  } catch (error) {
    console.error('Passkey list error:', error.message)

    return res.status(500).json({
      message: 'Unable to load your passkeys.',
    })
  }
})

// Generate registration options for the signed-in user.
router.post('/registration/options', protect, async (req, res) => {
  try {
    const existing = await PasskeyCredential.find({
      userId: req.user._id,
    }).select('credentialId transports')

    const options = await generateRegistrationOptions({
      rpName: 'DZShop',
      rpID: getRpId(),
      userID: new Uint8Array(
        Buffer.from(String(req.user._id))
      ),
      userName:
        req.user.telephone ||
        req.user.email ||
        String(req.user._id),
      attestationType: 'none',
      excludeCredentials: existing.map((item) => ({
        id: item.credentialId,
        transports: item.transports,
      })),
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
    })

    const challengeId = await saveChallenge({
      challenge: options.challenge,
      userId: req.user._id,
      type: 'registration',
    })

    return res.json({ options, challengeId })
  } catch (error) {
    console.error('Passkey registration options error:', error.message)

    return res.status(500).json({
      message: 'Unable to start passkey setup.',
    })
  }
})

// Verify registration and store the public credential.
router.post('/registration/verify', protect, async (req, res) => {
  try {
    const { response, challengeId } = req.body || {}

    if (
      !response ||
      typeof response.id !== 'string' ||
      typeof challengeId !== 'string'
    ) {
      return res.status(400).json({
        message: 'Passkey registration data is incomplete.',
      })
    }

    const savedChallenge = await WebAuthnChallenge.findOneAndDelete({
      challengeId,
      userId: req.user._id,
      type: 'registration',
      expiresAt: { $gt: new Date() },
    }).select('+challenge')

    if (!savedChallenge) {
      return res.status(400).json({
        message: 'This request has expired. Please try again.',
      })
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: savedChallenge.challenge,
      expectedOrigin: getOrigins(),
      expectedRPID: getRpId(),
      requireUserVerification: true,
    })

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({
        message: 'Passkey verification failed.',
      })
    }

    const { registrationInfo } = verification
    const credential = registrationInfo.credential

    const existingCredential = await PasskeyCredential.findOne({
      credentialId: credential.id,
    })

    if (existingCredential) {
      return res.status(409).json({
        message: 'This passkey is already registered.',
      })
    }

    await PasskeyCredential.create({
      userId: req.user._id,
      credentialId: credential.id,
      publicKey: Buffer.from(credential.publicKey).toString('base64url'),
      counter: credential.counter,
      transports:
        credential.transports ||
        response.response?.transports ||
        [],
      deviceType: registrationInfo.credentialDeviceType,
      backedUp: registrationInfo.credentialBackedUp,
    })

    return res.json({
      verified: true,
      message: 'Passkey set up successfully.',
    })
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: 'This passkey is already registered.',
      })
    }

    console.error('Passkey registration verification error:', error.message)

    return res.status(400).json({
      message: 'Unable to verify this passkey. Please try again.',
    })
  }
})

// Generate options for passwordless passkey sign-in.
router.post('/authentication/options', async (req, res) => {
  try {
    const options = await generateAuthenticationOptions({
      rpID: getRpId(),
      userVerification: 'required',
    })

    const challengeId = await saveChallenge({
      challenge: options.challenge,
      type: 'authentication',
    })

    return res.json({ options, challengeId })
  } catch (error) {
    console.error('Passkey authentication options error:', error.message)

    return res.status(500).json({
      message: 'Unable to start passkey sign-in.',
    })
  }
})

// Verify the passkey and issue the same JWT used by regular sign-in.
router.post('/authentication/verify', async (req, res) => {
  try {
    const { response, challengeId } = req.body || {}

    if (
      !response ||
      typeof response.id !== 'string' ||
      typeof challengeId !== 'string'
    ) {
      return res.status(400).json({
        message: 'Sign-in data is incomplete.',
      })
    }

    const savedChallenge = await WebAuthnChallenge.findOneAndDelete({
      challengeId,
      type: 'authentication',
      expiresAt: { $gt: new Date() },
    }).select('+challenge')

    if (!savedChallenge) {
      return res.status(400).json({
        message: 'This request has expired. Please try again.',
      })
    }

    const passkey = await PasskeyCredential.findOne({
      credentialId: response.id,
    }).select('+publicKey')

    if (!passkey) {
      return res.status(401).json({
        message: 'Unable to sign in with this passkey.',
      })
    }

    const user = await User.findById(passkey.userId)

    if (!user || user.actif === false) {
      return res.status(401).json({
        message: 'Unable to sign in with this passkey.',
      })
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: savedChallenge.challenge,
      expectedOrigin: getOrigins(),
      expectedRPID: getRpId(),
      credential: {
        id: passkey.credentialId,
        publicKey: new Uint8Array(
          Buffer.from(passkey.publicKey, 'base64url')
        ),
        counter: passkey.counter,
        transports: passkey.transports,
      },
      requireUserVerification: true,
    })

    if (!verification.verified) {
      return res.status(401).json({
        message: 'Passkey verification failed.',
      })
    }

    passkey.counter = verification.authenticationInfo.newCounter
    await passkey.save()

    return res.json({
      token: createToken(user),
      user: user.versPublic(),
    })
  } catch (error) {
    console.error('Passkey authentication verification error:', error.message)

    return res.status(401).json({
      message: 'Passkey sign-in failed. Please try again.',
    })
  }
})

// Delete only a passkey owned by the signed-in user.
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await PasskeyCredential.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!deleted) {
      return res.status(404).json({
        message: 'Passkey not found.',
      })
    }

    return res.json({
      message: 'Passkey deleted successfully.',
    })
  } catch (error) {
    console.error('Passkey deletion error:', error.message)

    return res.status(400).json({
      message: 'Unable to delete this passkey.',
    })
  }
})

export default router
