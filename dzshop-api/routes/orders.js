import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async function (req, res) {
  const {
    nom,
    telephone,
    wilaya,
    commune,
    adresse,
    livraison,
    paiement,
    produits
  } = req.body

  if (!nom || !telephone || !wilaya || !commune || !adresse) {
    return res.status(400).json({
      message: 'Toutes les informations de livraison sont obligatoires'
    })
  }

  if (!['domicile', 'bureau'].includes(livraison)) {
    return res.status(400).json({
      message: 'Mode de livraison invalide'
    })
  }

  if (paiement && paiement !== 'cash_on_delivery') {
    return res.status(400).json({
      message: 'Méthode de paiement invalide'
    })
  }

  if (!Array.isArray(produits) || produits.length === 0) {
    return res.status(400).json({
      message: 'Le panier est vide'
    })
  }

  try {
    const lignesValides = []

    for (const ligne of produits) {
      if (!ligne || !mongoose.isValidObjectId(ligne.productId)) {
        return res.status(400).json({
          message: 'Produit invalide'
        })
      }

      const quantity = Number(ligne.quantity)

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({
          message: 'Quantité invalide'
        })
      }

      lignesValides.push({
        productId: String(ligne.productId),
        quantity,
        taille: typeof ligne.taille === 'string' ? ligne.taille.trim() : '',
        couleur: typeof ligne.couleur === 'string' ? ligne.couleur.trim() : ''
      })
    }

    const ids = lignesValides.map(function (ligne) {
      return ligne.productId
    })

    const idsUniques = [...new Set(ids)]

    if (idsUniques.length !== ids.length) {
      return res.status(400).json({
        message: 'Produit répété dans le panier'
      })
    }

    const produitsEnBase = await Product.find({
      _id: {
        $in: idsUniques
      }
    })

    if (produitsEnBase.length !== idsUniques.length) {
      return res.status(400).json({
        message: 'Un ou plusieurs produits sont introuvables'
      })
    }

    let total = 0
    const lignes = []

    for (const ligne of lignesValides) {
      const produit = produitsEnBase.find(function (item) {
        return String(item._id) === ligne.productId
      })

      if (!produit) {
        return res.status(400).json({
          message: 'Produit introuvable'
        })
      }

      if (ligne.quantity > produit.stock) {
        return res.status(400).json({
          message: 'Stock insuffisant pour ' + produit.nom
        })
      }

      if (
        ligne.taille &&
        Array.isArray(produit.tailles) &&
        produit.tailles.length > 0 &&
        !produit.tailles.includes(ligne.taille)
      ) {
        return res.status(400).json({
          message: 'Taille invalide pour ' + produit.nom
        })
      }

      if (
        ligne.couleur &&
        Array.isArray(produit.couleurs) &&
        produit.couleurs.length > 0 &&
        !produit.couleurs.some(function (couleur) {
          return couleur.nom === ligne.couleur
        })
      ) {
        return res.status(400).json({
          message: 'Couleur invalide pour ' + produit.nom
        })
      }

      total += produit.prix * ligne.quantity

      lignes.push({
        productId: produit._id,
        nom: produit.nom,
        prix: produit.prix,
        quantity: ligne.quantity,
        image: produit.image,
        taille: ligne.taille,
        couleur: ligne.couleur
      })
    }

    const stockModifie = []

    try {
      for (const ligne of lignes) {
        const modification = await Product.updateOne(
          {
            _id: ligne.productId,
            stock: {
              $gte: ligne.quantity
            }
          },
          {
            $inc: {
              stock: -ligne.quantity
            }
          }
        )

        if (modification.modifiedCount !== 1) {
          throw new Error('Stock insuffisant pour ' + ligne.nom)
        }

        stockModifie.push(ligne)
      }

      const order = await Order.create({
        user: req.user._id,
        nom,
        telephone,
        wilaya,
        commune,
        adresse,
        livraison,
        paiement: paiement || 'cash_on_delivery',
        produits: lignes,
        total
      })

      return res.status(201).json({
        message: 'Commande créée avec succès',
        order
      })
    } catch (error) {
      for (const ligne of stockModifie) {
        await Product.updateOne(
          {
            _id: ligne.productId
          },
          {
            $inc: {
              stock: ligne.quantity
            }
          }
        )
      }

      throw error
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
})

router.get('/my', protect, async function (req, res) {
  try {
    const commandes = await Order.find({
      user: req.user._id
    }).sort({
      createdAt: -1
    })

    res.json(commandes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

router.get('/:id', protect, async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Commande invalide'
      })
    }

    const commande = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!commande) {
      return res.status(404).json({
        message: 'Commande introuvable'
      })
    }

    res.json(commande)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

router.get('/', protect, isAdmin, async function (req, res) {
  try {
    const commandes = await Order.find().sort({
      createdAt: -1
    })

    res.json(commandes)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

const STATUTS_VALIDES = [
  'en attente',
  'confirmee',
  'expediee',
  'livree',
  'annulee'
]

router.patch('/:id/statut', protect, isAdmin, async function (req, res) {
  try {
    const { statut } = req.body

    if (!STATUTS_VALIDES.includes(statut)) {
      return res.status(400).json({
        message: 'Statut invalide'
      })
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        message: 'Commande introuvable'
      })
    }

    const commande = await Order.findByIdAndUpdate(
      req.params.id,
      {
        statut: statut
      },
      {
        returnDocument: 'after'
      }
    )

    if (!commande) {
      return res.status(404).json({
        message: 'Commande introuvable'
      })
    }

    res.json(commande)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

export default router ;