import express from 'express'
import Order from '../models/Order.js'

const router = express.Router()

router.post('/', async function (req, res) {
  try {
    const {
      nom,
      telephone,
      wilaya,
      commune,
      adresse,
      livraison,
      produits,
      total
    } = req.body

    const order = await Order.create({
      nom,
      telephone,
      wilaya,
      commune,
      adresse,
      livraison,
      produits,
      total
    })

    res.status(201).json({
      message: 'Commande créée avec succès',
      order
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la commande'
    })
  }
})

export default router ;