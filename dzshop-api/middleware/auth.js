import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

// Vérifie l'identité de l'utilisateur
export async function protect(req, res, next) {
  const entete = req.headers.authorization || ''
  const token = entete.startsWith('Bearer ')
    ? entete.slice(7).trim()
    : null

  if (!token) {
    return res.status(401).json({
      message: 'Connexion requise'
    })
  }

  let contenu

  try {
    contenu = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    })
  } catch {
    return res.status(401).json({
      message: 'Token invalide ou expiré'
    })
  }

  if (
    !contenu ||
    typeof contenu !== 'object' ||
    typeof contenu.id !== 'string' ||
    !mongoose.isValidObjectId(contenu.id)
  ) {
    return res.status(401).json({
      message: 'Token invalide ou expiré'
    })
  }

  try {
    // Vérifie l'utilisateur et son rôle actuel en base de données.
    const user = await User.findById(contenu.id)

    if (!user) {
      return res.status(401).json({
        message: 'Compte introuvable'
      })
    }

    // Bloque les comptes explicitement désactivés.
    if (user.actif === false) {
      return res.status(403).json({
        message: 'Ce compte a été bloqué'
      })
    }

    req.user = user
    return next()
  } catch (erreur) {
    return next(erreur)
  }
}

// Vérifie les autorisations administrateur
export function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Connexion requise'
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: "Accès réservé à l'admin"
    })
  }

  return next()
}