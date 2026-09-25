require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Product = require('./models/Product')

const imageMap = {
  'CeraVe Hydrating Cleanser 236ml': 'cerave-hydrating-cleanser.jpg',
  'CeraVe Moisturizing Cream 340g': 'cerave-moisturizing-cream.jpg',
  'NIVEA MEN Sensitive Face Wash 100ml': 'nivea-men-sensitive-face-wash.jpg',
  'Dove Deeply Nourishing Body Wash 550ml': 'dove-deeply-nourishing-body-wash.jpg',
  'The Ordinary Niacinamide 10% + Zinc 1% 30ml': 'the-ordinary-niacinamide-zinc.jpg',
  'Neutrogena Hydro Boost Aqua-Gel 50ml': 'neutrogena-hydro-boost-aqua-gel.jpg',
  "L'Oréal Paris Elvive Dream Long Shampoo 250ml": 'loreal-elvive-dream-long.jpg',
  'NIVEA Soft Moisturizing Cream 200ml': 'nivea-soft-moisturizing-cream.jpg',
  'Dove Original Deodorant 150ml': 'dove-original-deodorant.jpg',
  'Neutrogena Norwegian Formula Hand Cream 56g': 'neutrogena-hand-cream.jpg'
}

const imagesFolder = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'products'
)

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected')

    const products = await Product.find({
      categorie: 'Soins personnels'
    })

    console.log(`${products.length} products found`)

    for (const product of products) {
      const imageName = imageMap[product.nom]

      if (!imageName) {
        console.log(`✗ Product not mapped: ${product.nom}`)
        continue
      }

      const imagePath = path.join(imagesFolder, imageName)

      if (!fs.existsSync(imagePath)) {
        console.log(`✗ Image not found: ${imageName}`)
        continue
      }

      product.image = `/images/products/${imageName}`

      await product.save()

      console.log(`✓ ${product.nom}`)
    }

    console.log('')
    console.log('✓ Images linked successfully')
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

updateImages()