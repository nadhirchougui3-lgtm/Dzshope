require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const ProductModule = require('./models/Product.js')

const Product = ProductModule.default || ProductModule

const productName = 'Kiehl’s Creme de Corps 500ml'

const imageUrl =
  'https://a.cdnsbn.com/images/products/xl/04449828603.jpg'

const imagesFolder = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'products'
)

async function updateImage() {
  try {
    fs.mkdirSync(imagesFolder, {
      recursive: true
    })

    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')
    console.log('')

    const product = await Product.findOne({
      nom: productName,
      categorie: 'Soins personnels'
    })

    if (!product) {
      throw new Error(
        `Produit introuvable : ${productName}`
      )
    }

    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw new Error(
        `Image HTTP ${response.status}`
      )
    }

    const contentType =
      response.headers.get('content-type') || ''

    if (!contentType.startsWith('image/')) {
      throw new Error(
        `Fichier reçu invalide : ${contentType}`
      )
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    )

    const fileName =
      'kiehls-creme-de-corps-500ml.jpg'

    const filePath = path.join(
      imagesFolder,
      fileName
    )

    fs.writeFileSync(
      filePath,
      buffer
    )

    product.image =
      `/images/products/${fileName}`

    await product.save()

    console.log(
      `✓ ${productName}`
    )

    console.log(
      `  ${product.image}`
    )

    console.log('')
    console.log(
      '✓ Image remplacée avec succès'
    )
  } catch (error) {
    console.error(
      'Erreur :',
      error.message
    )
  } finally {
    await mongoose.disconnect()
  }
}

updateImage()