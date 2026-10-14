
import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, isAdmin)

function traiterErreur(res, erreur, operation) {
  console.error(operation, erreur.message)

  return res.status(500).json({
    message: 'Une erreur interne est survenue'
  })
}

router.get('/', async function (req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    const resultat = await Promise.all(
      users.map(async function (user) {
        const commandes = await Order.find({ user: user._id })

        const totalDepense = commandes
          .filter(function (commande) {
            return commande.statut === 'livree'
          })
          .reduce(function (somme, commande) {
            return somme + commande.total
          }, 0)

        return {
          _id: user._id,
          nom: user.nom,
          telephone: user.telephone,
          email: user.email,
          role: user.role,
          actif: user.actif,
          nbCommandes: commandes.length,
          totalDepense,
          createdAt: user.createdAt
        }
      })
    )

    return res.json(resultat)
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur lecture utilisateurs :')
  }
})

router.patch('/:id/statut', async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Utilisateur introuvable'
    })
  }

  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    typeof req.body.actif !== 'boolean'
  ) {
    return res.status(400).json({
      message: 'Statut du compte invalide'
    })
  }

  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({
      message: 'Tu ne peux pas modifier ton propre compte'
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { actif: req.body.actif },
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable'
      })
    }

    return res.json(user.versPublic())
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur modification statut utilisateur :')
  }
})

router.patch('/:id/role', async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Utilisateur introuvable'
    })
  }

  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    !['client', 'admin'].includes(req.body.role)
  ) {
    return res.status(400).json({
      message: 'Rôle invalide'
    })
  }

  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({
      message: 'Tu ne peux pas modifier ton propre compte'
    })
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable'
      })
    }

    return res.json(user.versPublic())
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur modification rôle utilisateur :')
  }
})

router.delete('/:id', async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Utilisateur introuvable'
    })
  }

  if (String(req.params.id) === String(req.user._id)) {
    return res.status(400).json({
      message: 'Tu ne peux pas supprimer ton propre compte'
    })
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable'
      })
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        message: "La suppression d'un administrateur est interdite depuis cette page"
      })
    }

    await User.findByIdAndDelete(req.params.id)

    return res.json({
      message: 'Utilisateur supprimé'
    })
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur suppression utilisateur :')
  }
})

export default router
