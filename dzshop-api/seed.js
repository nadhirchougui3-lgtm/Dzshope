import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')

    const produits = await Product.find({})

    for (const produit of produits) {
      produit.image = ''

      if (Array.isArray(produit.couleurs)) {
        produit.couleurs.forEach(couleur => {
          couleur.image = ''
        })
      }

      await produit.save()
    }

    console.log(`${produits.length} produits traités`)
    console.log('Images supprimées uniquement')
    console.log('Couleurs conservées')
    console.log('Produits conservés')
  } catch (error) {
    console.error('Erreur:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()