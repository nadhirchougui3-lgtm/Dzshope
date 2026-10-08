import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(protect, isAdmin)

router.get('/', async function (req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    const resultat = await Promise.all(
      users.map(async function (user) {
        const commandes = await Order.find({ user: user._id })

        const totalDepense = commandes
          .filter(function (c) {
            return c.statut === 'livree'
          })
          .reduce(function (somme, c) {
            return somme + c.total
          }, 0)

        return {
          _id: user._id,
          nom: user.nom,
          telephone: user.telephone,
          email: user.email,
          role: user.role,
          actif: user.actif,
          nbCommandes: commandes.length,
          totalDepense: totalDepense,
          createdAt: user.createdAt,
        }
      })
    )

    res.json(resultat)
  } catch (erreur) {
    res.status(500).json({ message: erreur.message })
  }
})

router.patch('/:id/statut', async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({
        message: 'Tu ne peux pas modifier ton propre compte',
      })
    }

    const actif = req.body.actif === true

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { actif: actif },
      { returnDocument: 'after' }
    )

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    res.json(user.versPublic())
  } catch (erreur) {
    res.status(500).json({ message: erreur.message })
  }
})

router.patch('/:id/role', async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    if (!['client', 'admin'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Rôle invalide' })
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({
        message: 'Tu ne peux pas modifier ton propre compte',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { returnDocument: 'after' }
    )

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    res.json(user.versPublic())
  } catch (erreur) {
    res.status(500).json({ message: erreur.message })
  }
})

router.delete('/:id', async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({
        message: 'Tu ne peux pas supprimer ton propre compte',
      })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' })
    }

    if (user.role === 'admin') {
      return res.status(403).json({
        message:
          "La suppression d'un administrateur est interdite depuis cette page",
      })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: 'Utilisateur supprimé' })
  } catch (erreur) {
    res.status(500).json({ message: erreur.message })
  }
})

export default router
