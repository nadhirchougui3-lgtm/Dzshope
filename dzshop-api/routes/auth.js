
import express from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { OAuth2Client } from 'google-auth-library'

import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const googleClient = new OAuth2Client()

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again later.' },
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
})

const googleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many Google sign-in attempts. Please try again later.' },
})

function createToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d',
    }
  )
}

function normalizeTelephone(value) {
  if (typeof value !== 'string') return null

  const telephone = value.trim()

  if (telephone.length < 5 || telephone.length > 30) {
    return null
  }

  return telephone
}

function isValidName(value) {
  return (
    typeof value === 'string' &&
    value.trim().length >= 2 &&
    value.trim().length <= 80
  )
}

function isValidPassword(value) {
  return (
    typeof value === 'string' &&
    value.length >= 8 &&
    value.length <= 128
  )
}

function isDuplicateKeyError(error) {
  return error?.code === 11000
}

// Register a new local account.
router.post('/register', registerLimiter, async function (req, res) {
  try {
    const body = req.body || {}
    const { nom, password } = body
    const telephone = normalizeTelephone(body.telephone)

    if (!isValidName(nom) || !telephone || !isValidPassword(password)) {
      return res.status(400).json({
        message:
          'Provide a valid name, telephone number, and password between 8 and 128 characters.',
      })
    }

    const existingUser = await User.findOne({ telephone }).select('_id')

    if (existingUser) {
      return res.status(409).json({
        message: 'This telephone number is already registered.',
      })
    }

    const user = await User.create({
      nom: nom.trim(),
      telephone,
      password,
      provider: 'local',
    })

    return res.status(201).json({
      token: createToken(user),
      user: user.versPublic(),
    })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message: 'This telephone number or email is already registered.',
      })
    }

    console.error('Registration failed:', error.message)

    return res.status(500).json({
      message: 'Unable to create your account. Please try again.',
    })
  }
})

// Sign in with a telephone number and password.
router.post('/login', loginLimiter, async function (req, res) {
  try {
    const body = req.body || {}
    const telephone = normalizeTelephone(body.telephone)
    const password = body.password

    if (
      !telephone ||
      typeof password !== 'string' ||
      password.length === 0 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message: 'Invalid telephone number or password.',
      })
    }

    const user = await User.findOne({ telephone }).select('+password')

    if (!user || !user.password) {
      return res.status(401).json({
        message: 'Invalid telephone number or password.',
      })
    }

    const passwordMatches = await user.verifierMotDePasse(password)

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid telephone number or password.',
      })
    }

    if (user.actif === false) {
      return res.status(403).json({
        message: 'This account has been disabled.',
      })
    }

    return res.json({
      token: createToken(user),
      user: user.versPublic(),
    })
  } catch (error) {
    console.error('Login failed:', error.message)

    return res.status(500).json({
      message: 'Unable to sign in. Please try again.',
    })
  }
})

// Verify a Google ID token and sign in the associated account.
router.post('/google', googleLimiter, async function (req, res) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({
        message: 'Google sign-in is not configured.',
      })
    }

    const credential = req.body?.credential

    if (
      typeof credential !== 'string' ||
      credential.length === 0 ||
      credential.length > 10000
    ) {
      return res.status(400).json({
        message: 'Invalid Google credential.',
      })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const googleInfo = ticket.getPayload()

    if (
      !googleInfo ||
      typeof googleInfo.sub !== 'string' ||
      !googleInfo.sub ||
      typeof googleInfo.email !== 'string' ||
      !googleInfo.email_verified
    ) {
      return res.status(401).json({
        message: 'Google account verification failed.',
      })
    }

    const email = googleInfo.email.toLowerCase().trim()

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        nom:
          typeof googleInfo.name === 'string' && googleInfo.name.trim()
            ? googleInfo.name.trim().slice(0, 80)
            : email.split('@')[0].slice(0, 80),
        email,
        provider: 'google',
        googleId: googleInfo.sub,
      })
    } else if (user.googleId && user.googleId !== googleInfo.sub) {
      return res.status(409).json({
        message: 'This email is associated with a different Google account.',
      })
    } else if (!user.googleId) {
      return res.status(409).json({
        message:
          'This email already belongs to an account. Sign in using its existing method before linking Google.',
      })
    }

    if (user.actif === false) {
      return res.status(403).json({
        message: 'This account has been disabled.',
      })
    }

    return res.json({
      token: createToken(user),
      user: user.versPublic(),
    })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message: 'An account with this email already exists.',
      })
    }

    console.error('Google authentication failed:', error.message)

    return res.status(401).json({
      message: 'Google authentication failed.',
    })
  }
})

// Return the currently authenticated user's public profile.
router.get('/me', protect, function (req, res) {
  return res.json({
    user: req.user.versPublic(),
  })
})

export default router
