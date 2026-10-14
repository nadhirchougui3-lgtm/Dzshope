import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

function validerChampsProduit(body, creation = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { erreur: 'Données du produit invalides' }
  }

  const donnees = {}

  if (body.nom !== undefined || creation) {
    if (typeof body.nom !== 'string' || !body.nom.trim()) {
      return { erreur: 'Le nom du produit est obligatoire' }
    }

    donnees.nom = body.nom.trim()
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      return { erreur: 'Description invalide' }
    }

    donnees.description = body.description
  }

  if (body.prix !== undefined || creation) {
    if (
      body.prix === '' ||
      body.prix === null ||
      body.prix === undefined ||
      !['number', 'string'].includes(typeof body.prix) ||
      (typeof body.prix === 'string' && !body.prix.trim())
    ) {
      return { erreur: 'Prix invalide' }
    }

    const prix = Number(body.prix)

    if (!Number.isFinite(prix) || prix < 0) {
      return { erreur: 'Le prix doit être un nombre positif ou nul' }
    }

    donnees.prix = prix
  }

  if (body.categorie !== undefined) {
    if (typeof body.categorie !== 'string' || !body.categorie.trim()) {
      return { erreur: 'Catégorie invalide' }
    }

    donnees.categorie = body.categorie.trim()
  }

  if (body.stock !== undefined) {
    if (
      body.stock === '' ||
      body.stock === null ||
      !['number', 'string'].includes(typeof body.stock)
    ) {
      return { erreur: 'Stock invalide' }
    }

    const stock = Number(body.stock)

    if (!Number.isSafeInteger(stock) || stock < 0) {
      return { erreur: 'Le stock doit être un entier positif ou nul' }
    }

    donnees.stock = stock
  }

  if (body.image !== undefined) {
    if (typeof body.image !== 'string') {
      return { erreur: 'Image invalide' }
    }

    donnees.image = body.image.trim()
  }

  if (body.couleurs !== undefined) {
    if (!Array.isArray(body.couleurs)) {
      return { erreur: 'Liste des couleurs invalide' }
    }

    const couleurs = []

    for (const couleur of body.couleurs) {
      if (
        !couleur ||
        typeof couleur !== 'object' ||
        Array.isArray(couleur) ||
        typeof couleur.nom !== 'string' ||
        !couleur.nom.trim() ||
        (couleur.image !== undefined &&
          typeof couleur.image !== 'string')
      ) {
        return { erreur: 'Données de couleur invalides' }
      }

      couleurs.push({
        nom: couleur.nom.trim(),
        image: typeof couleur.image === 'string'
          ? couleur.image.trim()
          : ''
      })
    }

    donnees.couleurs = couleurs
  }

  if (body.tailles !== undefined) {
    if (
      !Array.isArray(body.tailles) ||
      !body.tailles.every(
        taille => typeof taille === 'string' && taille.trim() !== ''
      )
    ) {
      return { erreur: 'Liste des tailles invalide' }
    }

    donnees.tailles = body.tailles.map(taille => taille.trim())
  }

  if (!creation && Object.keys(donnees).length === 0) {
    return { erreur: 'Aucune donnée valide à modifier' }
  }

  return { donnees }
}

function traiterErreur(res, err, operation) {
  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      message: 'Données du produit invalides'
    })
  }

  console.error(operation, err.message)

  return res.status(500).json({
    message: 'Une erreur interne est survenue'
  })
}

router.get('/', async function (req, res) {
  try {
    const produits = await Product.find().sort({ createdAt: 1 })
    return res.json(produits)
  } catch (err) {
    return traiterErreur(res, err, 'Erreur lecture produits :')
  }
})

router.get('/:id', async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Produit introuvable' })
  }

  try {
    const produit = await Product.findById(req.params.id)

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    return res.json(produit)
  } catch (err) {
    return traiterErreur(res, err, 'Erreur lecture produit :')
  }
})

router.post('/', protect, isAdmin, async function (req, res) {
  const resultat = validerChampsProduit(req.body, true)

  if (resultat.erreur) {
    return res.status(400).json({ message: resultat.erreur })
  }

  try {
    const nouveau = await Product.create(resultat.donnees)
    return res.status(201).json(nouveau)
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Données du produit invalides'
      })
    }

    return traiterErreur(res, err, 'Erreur création produit :')
  }
})

router.put('/:id', protect, isAdmin, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Produit introuvable' })
  }

  const resultat = validerChampsProduit(req.body)

  if (resultat.erreur) {
    return res.status(400).json({ message: resultat.erreur })
  }

  try {
    const produit = await Product.findByIdAndUpdate(
      req.params.id,
      resultat.donnees,
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    return res.json(produit)
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: 'Données du produit invalides'
      })
    }

    return traiterErreur(res, err, 'Erreur modification produit :')
  }
})

router.delete('/:id', protect, isAdmin, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Produit introuvable' })
  }

  try {
    const produit = await Product.findByIdAndDelete(req.params.id)

    if (!produit) {
      return res.status(404).json({ message: 'Produit introuvable' })
    }

    return res.json({ message: 'Produit supprimé' })
  } catch (err) {
    return traiterErreur(res, err, 'Erreur suppression produit :')
  }
})

export default router
