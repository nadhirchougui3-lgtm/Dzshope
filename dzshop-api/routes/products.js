import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

function champsAutorises(body) {
  return {
    nom: body.nom,
    description: body.description,
    prix: body.prix,
    categorie: body.categorie,
    stock: body.stock,
    image: body.image,
    couleurs: body.couleurs,
    tailles: body.tailles
  }
}

router.get('/', async function (req, res) {
  try {
    const produits = await Product.find().sort({ createdAt: 1 })
    res.json(produits)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    const produit = await Product.findById(req.params.id)

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    res.json(produit)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, isAdmin, async function (req, res) {
  try {
    const nouveau = await Product.create(champsAutorises(req.body))
    res.status(201).json(nouveau)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', protect, isAdmin, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    const produit = await Product.findByIdAndUpdate(
      req.params.id,
      champsAutorises(req.body),
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    res.json(produit)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', protect, isAdmin, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    const produit = await Product.findByIdAndDelete(req.params.id)

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    res.json({ message: 'Produit supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
