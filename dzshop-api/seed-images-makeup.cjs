require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const ProductModule = require('./models/Product.js')

const Product = ProductModule.default || ProductModule

const products = [
  {
    name: 'Huda Beauty Easy Bake Loose Baking & Setting Powder',
    url: 'https://a.cdnsbn.com/images/products/xl/36219681402-1.jpg',
    file: 'huda-beauty-easy-bake.jpg'
  },
  {
    name: 'Huda Beauty #FauxFilter Luminous Matte Foundation',
    url: 'https://ba.fimgs.net/system/pics/thumbs/18039/product/po.18039.jpg',
    file: 'huda-beauty-fauxfilter-foundation.jpg'
  },
  {
    name: 'Charlotte Tilbury Airbrush Flawless Foundation',
    url: 'https://www.medoget.com/cdn/shop/files/download_86050b6f-7443-4ac3-93d1-f415150dc72a.png?v=1715173031&width=1030',
    file: 'charlotte-tilbury-airbrush-flawless-foundation.jpg'
  },
  {
    name: 'Charlotte Tilbury Pillow Talk Lipstick',
    url: 'https://www.thundersboutiquehn.com/cdn/shop/products/image_af3d09b4-217a-4b8f-89fa-d3a12229b62f.jpg?v=1654821631&width=1445',
    file: 'charlotte-tilbury-pillow-talk.jpg'
  },
  {
    name: 'MAC Studio Fix Fluid SPF 15 Foundation',
    url: 'https://media.ulta.com/i/ulta/2621412?fmt=auto&h=1080&w=1080',
    file: 'mac-studio-fix-fluid.jpg'
  },
  {
    name: 'MAC M·A·Cximal Silky Matte Lipstick',
    url: 'https://www.thundersboutiquehn.com/cdn/shop/products/image_af3d09b4-217a-4b8f-89fa-d3a12229b62f.jpg?v=1654821631&width=1445',
    file: 'mac-maximal-silky-matte.jpg'
  },
  {
    name: 'Rare Beauty Soft Pinch Liquid Blush',
    url: 'https://cdn.shopify.com/s/files/1/0314/1373/7703/files/ECOMM-MINI-SOFT-PINCH-LIQUID-BLUSH-HOPE-PRODUCT.jpg?v=1711503683',
    file: 'rare-beauty-soft-pinch.jpg'
  },
  {
    name: 'NARS Light Reflecting Foundation',
    url: 'https://img.kingpowerclick.com/cdn-cgi/image/format=auto/kingpower-com/image/upload/w_640/v1774587199/prod/957902-L1.jpg',
    file: 'nars-light-reflecting-foundation.jpg'
  },
  {
    name: 'Dior Addict Lip Glow',
    url: 'https://media.ulta.com/i/ulta/2618249?fmt=auto&h=1080&w=1080',
    file: 'dior-addict-lip-glow.jpg'
  },
  {
    name: 'YSL Rouge Pur Couture The Slim',
    url: 'https://media.ulta.com/i/ulta/2534883?fmt=auto&h=1080&w=1080',
    file: 'ysl-rouge-pur-couture-the-slim.jpg'
  }
]

const imagesFolder = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'products'
)

async function updateImages() {
  try {
    fs.mkdirSync(imagesFolder, {
      recursive: true
    })

    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')
    console.log('')

    for (const item of products) {
      const product = await Product.findOne({
        nom: item.name,
        categorie: 'Maquillage'
      })

      if (!product) {
        console.log(`✕ Produit introuvable : ${item.name}`)
        continue
      }

      const response = await fetch(item.url)

      if (!response.ok) {
        console.log(`✕ Image HTTP ${response.status} : ${item.name}`)
        continue
      }

      const contentType =
        response.headers.get('content-type') || ''

      if (!contentType.startsWith('image/')) {
        console.log(`✕ Fichier invalide : ${item.name}`)
        continue
      }

      const buffer = Buffer.from(
        await response.arrayBuffer()
      )

      const filePath = path.join(
        imagesFolder,
        item.file
      )

      fs.writeFileSync(
        filePath,
        buffer
      )

      product.image =
        `/images/products/${item.file}`

      await product.save()

      console.log(`✓ ${item.name}`)
      console.log(`  ${product.image}`)
    }

    console.log('')
    console.log('✓ Images Maquillage terminées')
  } catch (error) {
    console.error(
      'Erreur :',
      error.message
    )
  } finally {
    await mongoose.disconnect()
  }
}

updateImages() 