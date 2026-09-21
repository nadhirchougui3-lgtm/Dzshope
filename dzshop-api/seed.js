// Utilisation :  npm run seed
// Remplit MongoDB avec tes produits (efface d'abord les anciens produits !).

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const produits = [
  {
    "nom": "Smartphone",
    "description": "Smartphone moderne avec écran haute résolution et grande autonomie.",
    "prix": 45000,
    "categorie": "Téléphones",
    "stock": 15,
    "image": ""
  },
  {
    "nom": "Casque Bluetooth",
    "description": "Casque sans fil confortable avec une excellente qualité sonore.",
    "prix": 6500,
    "categorie": "Audio",
    "stock": 24,
    "image": ""
  },
  {
    "nom": "Souris sans fil",
    "description": "Souris ergonomique sans fil.",
    "prix": 2200,
    "categorie": "Accessoires",
    "stock": 30,
    "image": ""
  },
  {
    "nom": "Clavier mécanique",
    "description": "Clavier mécanique rétroéclairé.",
    "prix": 7800,
    "categorie": "Accessoires",
    "stock": 8,
    "image": ""
  }
]

try {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connecté')

  await Product.deleteMany({})
  const ajoutes = await Product.insertMany(produits)

  console.log(ajoutes.length + ' produits importés avec succès')
} catch (err) {
  console.log('Erreur : ' + err.message)
} finally {
  await mongoose.disconnect()
}