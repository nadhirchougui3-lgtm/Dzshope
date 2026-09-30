import express from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const googleClient = new OAuth2Client()

function creerToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// INSCRIPTION  →  POST /api/auth/register
router.post('/register', async function (req, res) {
  try {
    // On prend les 3 champs autorisés UN PAR UN. Jamais User.create(req.body) :
    // sinon un visiteur pourrait envoyer "role": "admin" et devenir admin en 2 secondes !
    const { nom, telephone, password } = req.body

    if (!nom || !telephone || !password) {
      return res.status(400).json({ message: 'Nom, téléphone et mot de passe obligatoires' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' })
    }

    const existe = await User.findOne({ telephone: String(telephone).trim() })
    if (existe) {
      return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé' })
    }

    const user = await User.create({ nom, telephone: String(telephone).trim(), password: String(password) })

    res.status(201).json({ token: creerToken(user), user: user.versPublic() })
  } catch (erreur) {
    res.status(400).json({ message: erreur.message })
  }
})

// CONNEXION  →  POST /api/auth/login
router.post('/login', async function (req, res) {
  try {
    const { telephone, password } = req.body

    const user = await User.findOne({ telephone: String(telephone || '').trim() }).select('+password')

    // Compte créé avec Google : pas de mot de passe, on l'explique
    if (user && !user.password) {
      return res.status(400).json({ message: 'Ce compte utilise la connexion Google. Clique sur « Continuer avec Google ».' })
    }

    // Même message si le téléphone n'existe pas OU si le mot de passe est faux
    if (!user || !(await user.verifierMotDePasse(String(password || '')))) {
      return res.status(401).json({ message: 'Téléphone ou mot de passe incorrect' })
    }

    res.json({ token: creerToken(user), user: user.versPublic() })
  } catch (erreur) {
    res.status(500).json({ message: erreur.message })
  }
})

// CONNEXION AVEC GOOGLE  →  POST /api/auth/google
// Le site reçoit un "credential" (un jeton signé par Google) et nous l'envoie.
// Google seul peut dire s'il est authentique : on le fait VÉRIFIER, jamais cru sur parole.
router.post('/google', async function (req, res) {
  try {
    const { credential } = req.body

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: "La connexion Google n'est pas configurée" })
    }
    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({ message: 'Jeton Google manquant' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const infos = ticket.getPayload()

    if (!infos || !infos.email || !infos.email_verified) {
      return res.status(401).json({ message: 'Compte Google non valide' })
    }

    const email = infos.email.toLowerCase().trim()
    let user = await User.findOne({ email: email })

    if (!user) {
      // Google ne donne pas de numéro de téléphone : le compte est créé sans (provider "google")
      user = await User.create({
        nom: infos.name || email.split('@')[0],
        email: email,
        provider: 'google',
        googleId: infos.sub,
      })
    } else if (!user.googleId) {
      // Le compte existait déjà avec cet email : on associe Google, sans créer de doublon
      user.googleId = infos.sub
      await user.save()
    }

    res.json({ token: creerToken(user), user: user.versPublic() })
  } catch (erreur) {
    console.error('Erreur Google Auth :', erreur.message)
    res.status(401).json({ message: 'Authentification Google impossible' })
  }
})

// QUI SUIS-JE ?  →  GET /api/auth/me
router.get('/me', protect, function (req, res) {
  res.json({ user: req.user.versPublic() })
})

export default router ;