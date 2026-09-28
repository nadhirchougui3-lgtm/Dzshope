require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const https = require('https')
const ProductModule = require('./models/Product.js')

const Product = ProductModule.default || ProductModule

const folder = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'products'
)

const produits = [
  {
    nom: 'Nike Air Jordan 1 Retro High OG',
    prix: 38000,
    couleurs: [
      {
        nom: 'Noir / Blanc',
        url: 'https://feature.com/cdn/shop/files/Air-Jordan-1-Retro-High-OG---Black-White-DZ5485-010-03-03-24-Feature-KN.jpg?v=1709938017'
      }
    ]
  },
  {
    nom: 'Nike Air Force 1',
    prix: 28000,
    couleurs: [
      {
        nom: 'Blanc / Noir',
        url: 'https://www.ftshp.nl/nl/herenschoenen/312289-nike-air-force-1-07-white-black-white.html'
      }
    ]
  },
  {
    nom: 'Nike Dunk Low',
    prix: 26000,
    couleurs: [
      {
        nom: 'Panda',
        url: 'https://thedousedshop.com/cdn/shop/files/5e6a1e57-1c7d-435a-82bd-5666a13560fe_114aaa37-2550-4181-9712-b25faa9884ef.jpg?v=1769025891&width=3000'
      }
    ]
  },
  {
    nom: 'Adidas Samba OG',
    prix: 24000,
    couleurs: [
      {
        nom: 'Blanc / Noir',
        url: 'https://crossoverconceptstore.com/cdn/shop/products/ADIDAS_SAMBA_WHT_1.jpg?v=1582537687'
      }
    ]
  },
  {
    nom: 'Adidas Campus 00s',
    prix: 22000,
    couleurs: [
      {
        nom: 'Noir / Blanc',
        url: 'https://images-cdn.ubuy.tn/645e70dadb00464a3f4dc87a-adidas-campus-00s-shoes-originals.jpg'
      }
    ]
  },
  {
    nom: 'New Balance 530',
    prix: 26000,
    couleurs: [
      {
        nom: 'Blanc / Argent',
        url: 'https://www.newbalance.com.my/gender-neutral/shoes/MR530-42234.html'
      }
    ]
  },
  {
    nom: 'New Balance 9060',
    prix: 32000,
    couleurs: [
      {
        nom: 'Noir / Gris',
        url: 'https://i5.walmartimages.com/seo/New-Balance-Men-s-9060-Black-Castlerock-Grey-Casual-Shoe-From-StockX_cfd27a3f-65eb-4338-ade6-c142816bca1e.64fbf5d3357641a224865304f12dc901.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768'
      }
    ]
  },
  {
    nom: 'Nike Air Max 1',
    prix: 30000,
    couleurs: [
      {
        nom: 'Blanc / Gris',
        url: 'https://thesolesupplier.co.uk/release-dates/nike/air-max-1/nike-air-max-1-white-grey-ah8145-110/'
      }
    ]
  },
  {
    nom: 'Nike Air Max 95',
    prix: 33000,
    couleurs: [
      {
        nom: 'Noir / Gris',
        url: 'https://www.sneakers4u.nl/img/images/2023/08/21/nike-air-max-95-essential-black-smoke-grey-ct1805-001.jpeg'
      }
    ]
  },
  {
    nom: 'Christian Louboutin Louis',
    prix: 85000,
    couleurs: [
      {
        nom: 'Noir / Rouge',
        url: 'https://www.neimanmarcus.com/p/christian-louboutin-mens-louis-junior-spikes-leather-low-top-sneakers-prod269210049'
      }
    ]
  }
]

function download(url, filePath) {
  return new Promise(function (resolve, reject) {
    const request = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      },
      function (response) {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume()
          download(response.headers.location, filePath)
            .then(resolve)
            .catch(reject)
          return
        }

        if (response.statusCode !== 200) {
          response.resume()
          reject(
            new Error(`HTTP ${response.statusCode}`)
          )
          return
        }

        const chunks = []

        response.on('data', function (chunk) {
          chunks.push(chunk)
        })

        response.on('end', function () {
          fs.writeFileSync(
            filePath,
            Buffer.concat(chunks)
          )

          resolve()
        })
      }
    )

    request.on('error', reject)
  })
}

async function run() {
  try {
    fs.mkdirSync(folder, {
      recursive: true
    })

    await mongoose.connect(process.env.MONGODB_URI)

    const chaussures = await Product.find({
      categorie: 'Chaussures'
    }).sort({ _id: 1 })

    if (chaussures.length !== 10) {
      throw new Error(
        `Nombre de chaussures trouvé: ${chaussures.length}`
      )
    }

    for (let i = 0; i < produits.length; i++) {
      const produit = produits[i]
      const document = chaussures[i]

      const couleurs = []

      for (let j = 0; j < produit.couleurs.length; j++) {
        const couleur = produit.couleurs[j]

        const fileName =
          `${i + 1}-${j + 1}-${produit.nom
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')}.jpg`

        const filePath = path.join(
          folder,
          fileName
        )

        console.log(
          `Téléchargement: ${produit.nom} - ${couleur.nom}`
        )

        await download(
          couleur.url,
          filePath
        )

        couleurs.push({
          nom: couleur.nom,
          image: `/images/products/${fileName}`
        })
      }

      await Product.updateOne(
        { _id: document._id },
        {
          $set: {
            nom: produit.nom,
            prix: produit.prix,
            categorie: 'Chaussures',
            tailles: [
              '37',
              '38',
              '39',
              '40',
              '41',
              '42',
              '43',
              '44',
              '45'
            ],
            image: couleurs[0].image,
            couleurs
          }
        }
      )

      console.log(`✓ ${produit.nom}`)
    }

    console.log('')
    console.log('✓ Chaussures mises à jour')
    console.log('✓ Cosmetics non touchés')
    console.log('✓ Autres catégories non touchées')
  } catch (error) {
    console.error('Erreur:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

run()