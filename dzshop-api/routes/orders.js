import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const STATUTS_VALIDES = [
  'en attente',
  'confirmee',
  'expediee',
  'livree',
  'annulee'
]

function erreurClient(message) {
  const erreur = new Error(message)
  erreur.status = 400
  return erreur
}

function traiterErreur(res, erreur, operation) {
  if (erreur.status === 400) {
    return res.status(400).json({ message: erreur.message })
  }

  if (
    erreur instanceof mongoose.Error.ValidationError ||
    erreur instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      message: 'Données de commande invalides'
    })
  }

  console.error(operation, erreur.message)

  return res.status(500).json({
    message: 'Une erreur interne est survenue'
  })
}

router.post('/', protect, async function (req, res) {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: 'Données de commande invalides'
      })
    }

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

    const champsLivraison = [
      nom,
      telephone,
      wilaya,
      commune,
      adresse
    ]

    if (
      !champsLivraison.every(
        valeur => typeof valeur === 'string' && valeur.trim() !== ''
      )
    ) {
      return res.status(400).json({
        message: 'Toutes les informations de livraison sont obligatoires'
      })
    }

    if (!['domicile', 'bureau'].includes(livraison)) {
      return res.status(400).json({
        message: 'Mode de livraison invalide'
      })
    }

    if (
      paiement !== undefined &&
      paiement !== 'cash_on_delivery'
    ) {
      return res.status(400).json({
        message: 'Méthode de paiement invalide'
      })
    }

    if (!Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({
        message: 'Le panier est vide'
      })
    }

    const lignesValides = []

    for (const ligne of produits) {
      if (
        !ligne ||
        typeof ligne !== 'object' ||
        Array.isArray(ligne) ||
        typeof ligne.productId !== 'string' ||
        !mongoose.isValidObjectId(ligne.productId)
      ) {
        return res.status(400).json({
          message: 'Produit invalide'
        })
      }

      if (
        !['number', 'string'].includes(typeof ligne.quantity) ||
        String(ligne.quantity).trim() === ''
      ) {
        return res.status(400).json({
          message: 'Quantité invalide'
        })
      }

      const quantity = Number(ligne.quantity)

      if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({
          message: 'Quantité invalide'
        })
      }

      if (
        (ligne.taille !== undefined &&
          typeof ligne.taille !== 'string') ||
        (ligne.couleur !== undefined &&
          typeof ligne.couleur !== 'string')
      ) {
        return res.status(400).json({
          message: 'Options du produit invalides'
        })
      }

      lignesValides.push({
        productId: ligne.productId,
        quantity,
        taille: typeof ligne.taille === 'string'
          ? ligne.taille.trim()
          : '',
        couleur: typeof ligne.couleur === 'string'
          ? ligne.couleur.trim()
          : ''
      })
    }

    const ids = lignesValides.map(ligne => ligne.productId)
    const idsUniques = [...new Set(ids)]

    if (idsUniques.length !== ids.length) {
      return res.status(400).json({
        message: 'Produit répété dans le panier'
      })
    }

    const produitsEnBase = await Product.find({
      _id: { $in: idsUniques }
    })

    if (produitsEnBase.length !== idsUniques.length) {
      return res.status(400).json({
        message: 'Un ou plusieurs produits sont introuvables'
      })
    }

    let total = 0
    const lignes = []

    for (const ligne of lignesValides) {
      const produit = produitsEnBase.find(
        item => String(item._id) === ligne.productId
      )

      if (!produit) {
        return res.status(400).json({
          message: 'Produit introuvable'
        })
      }

      if (
        !Number.isSafeInteger(produit.stock) ||
        produit.stock < 0 ||
        ligne.quantity > produit.stock
      ) {
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
        !produit.couleurs.some(
          couleur => couleur.nom === ligne.couleur
        )
      ) {
        return res.status(400).json({
          message: 'Couleur invalide pour ' + produit.nom
        })
      }

      const sousTotal = produit.prix * ligne.quantity

      if (!Number.isFinite(sousTotal) || !Number.isFinite(total + sousTotal)) {
        return res.status(400).json({
          message: 'Montant de commande invalide'
        })
      }

      total += sousTotal

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
            stock: { $gte: ligne.quantity }
          },
          {
            $inc: { stock: -ligne.quantity }
          }
        )

        if (modification.modifiedCount !== 1) {
          throw erreurClient('Stock insuffisant pour ' + ligne.nom)
        }

        stockModifie.push(ligne)
      }

      const order = await Order.create({
        user: req.user._id,
        nom: nom.trim(),
        telephone: telephone.trim(),
        wilaya: wilaya.trim(),
        commune: commune.trim(),
        adresse: adresse.trim(),
        livraison,
        paiement: paiement || 'cash_on_delivery',
        produits: lignes,
        total
      })

      return res.status(201).json({
        message: 'Commande créée avec succès',
        order
      })
    } catch (erreur) {
      for (const ligne of stockModifie) {
        try {
          const restauration = await Product.updateOne(
            { _id: ligne.productId },
            { $inc: { stock: ligne.quantity } }
          )

          if (restauration.modifiedCount !== 1) {
            console.error(
              'Restauration du stock non confirmée pour le produit :',
              String(ligne.productId)
            )
          }
        } catch (erreurRestauration) {
          console.error(
            'Échec de restauration du stock :',
            String(ligne.productId),
            erreurRestauration.message
          )
        }
      }

      throw erreur
    }
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur création commande :')
  }
})

router.get('/my', protect, async function (req, res) {
  try {
    const commandes = await Order.find({
      user: req.user._id
    }).sort({ createdAt: -1 })

    return res.json(commandes)
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur lecture commandes :')
  }
})

router.get('/:id', protect, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Commande invalide'
    })
  }

  try {
    const commande = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!commande) {
      return res.status(404).json({
        message: 'Commande introuvable'
      })
    }

    return res.json(commande)
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur lecture commande :')
  }
})

router.get('/', protect, isAdmin, async function (req, res) {
  try {
    const commandes = await Order.find().sort({
      createdAt: -1
    })

    return res.json(commandes)
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur lecture commandes admin :')
  }
})

router.patch('/:id/statut', protect, isAdmin, async function (req, res) {
  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    !STATUTS_VALIDES.includes(req.body.statut)
  ) {
    return res.status(400).json({
      message: 'Statut invalide'
    })
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Commande introuvable'
    })
  }

  try {
    const commande = await Order.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!commande) {
      return res.status(404).json({
        message: 'Commande introuvable'
      })
    }

    return res.json(commande)
  } catch (erreur) {
    return traiterErreur(res, erreur, 'Erreur modification statut commande :')
  }
})

export default router
