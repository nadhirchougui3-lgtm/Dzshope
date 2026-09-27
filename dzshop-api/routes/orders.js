import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async function (req, res) {
  try {
    const {
      nom,
      telephone,
      wilaya,
      commune,
      adresse,
      livraison,
      produits
    } = req.body

    if (!Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ message: 'Le panier est vide' })
    }
    if (!telephone || !wilaya || !adresse) {
      return res.status(400).json({ message: 'Téléphone, wilaya et adresse obligatoires' })
    }

    // Le navigateur envoie SEULEMENT { productId, quantity, taille }.
    // Les PRIX, on va les chercher NOUS-MÊMES dans la base : on ne fait jamais
    // confiance à ce qui vient du réseau (le prix pourrait être modifié dans F12).
    const ids = produits.map(function (p) { return String(p.productId) })
    if (!ids.every(mongoose.isValidObjectId)) {
      return res.status(400).json({ message: 'Produit invalide' })
    }

    const produitsEnBase = await Product.find({ _id: { $in: ids } })

    let total = 0
    const lignes = []

    for (const ligne of produits) {
      const produit = produitsEnBase.find(function (p) {
        return String(p._id) === String(ligne.productId)
      })
      const quantity = Number(ligne.quantity)

      if (!produit) {
        return res.status(400).json({ message: 'Produit introuvable' })
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: 'Quantité invalide pour ' + produit.nom })
      }
      if (quantity > produit.stock) {
        return res.status(400).json({ message: 'Stock insuffisant pour ' + produit.nom })
      }

      total += produit.prix * quantity
      lignes.push({
        productId: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        quantity: quantity,
        image: produit.image,
        taille: ligne.taille || ''
      })
    }

    const order = await Order.create({
      user: req.user._id,
      nom,
      telephone,
      wilaya,
      commune,
      adresse,
      livraison,
      produits: lignes,
      total
    })

    // On retire les articles vendus du stock
    for (const ligne of lignes) {
      await Product.updateOne({ _id: ligne.productId }, { $inc: { stock: -ligne.quantity } })
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      order
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
})

// MES COMMANDES  →  GET /api/orders/my
router.get('/my', protect, async function (req, res) {
  try {
    const commandes = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(commandes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router