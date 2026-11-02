
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const JWT_ALGORITHM = 'HS256'

function unauthorized(res, message = 'Connexion requise') {
  return res.status(401).json({ message })
}

// Verify the user's identity and current account status.
export async function protect(req, res, next) {
  const authorization = req.headers.authorization || ''

  if (!authorization.startsWith('Bearer ')) {
    return unauthorized(res)
  }

  const token = authorization.slice(7).trim()

  if (!token || token.length > 8192) {
    return unauthorized(res, 'Token invalide ou expiré')
  }

  let payload

  try {
    const secret = process.env.JWT_SECRET

    if (!secret || secret.length < 32) {
      console.error('JWT_SECRET is missing or too short.')
      return res.status(500).json({
        message: 'Authentication service is not configured correctly.',
      })
    }

    payload = jwt.verify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    })
  } catch {
    return unauthorized(res, 'Token invalide ou expiré')
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.id !== 'string' ||
    !mongoose.isValidObjectId(payload.id)
  ) {
    return unauthorized(res, 'Token invalide ou expiré')
  }

  try {
    const user = await User.findById(payload.id)

    if (!user) {
      return unauthorized(res, 'Token invalide ou expiré')
    }

    if (user.actif === false) {
      return res.status(403).json({
        message: 'This account has been disabled.',
      })
    }

    req.user = user

    return next()
  } catch (error) {
    return next(error)
  }
}

// Authorize administrators using the current database role.
export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Connexion requise',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Administrator access is required.',
    })
  }

  return next()
}
