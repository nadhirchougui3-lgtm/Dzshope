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

const products = [
  {
    name: 'Nike Air Jordan 1 Retro High OG',
    page: 'https://www.nike.com/t/air-jordan-1-retro-high-og-mens-shoes'
  },
  {
    name: 'Adidas Ultraboost 5',
    page: 'https://www.adidas.com/us/ultraboost_5'
  },
  {
    name: 'New Balance 990v6 Made in USA',
    page: 'https://www.newbalance.com/pd/made-in-usa-990v6/U990V6-45189.html'
  },
  {
    name: 'ASICS GEL-KAYANO 32',
    page: 'https://www.asics.com/fr/en-fr/product/gel-kayano-32/p/1011C052-001.html'
  },
  {
    name: 'Salomon XT-6 GORE-TEX',
    page: 'https://www.salomon.com/fr-fr/product/xt-6-gore-tex-lg9333/L49215600'
  },
  {
    name: 'On Cloudmonster 2',
    page: 'https://www.on.com/en-us/products/cloudmonster-2'
  },
  {
    name: 'HOKA Bondi 9',
    page: 'https://www.hoka.com/en/us/mens-everyday-running-shoes/bondi-9/1162011.html'
  },
  {
    name: 'Puma MB.04',
    page: 'https://us.puma.com/us/en/pd/mb.04-basketball-shoes/309876.html'
  },
  {
    name: 'Adidas Samba OG',
    page: 'https://www.adidas.com/us/samba-og-shoes/JI4218.html'
  },
  {
    name: 'New Balance 2002R',
    page: 'https://www.newbalance.com/pd/2002r/U2002RCA-D-15.html'
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
          const html = Buffer.concat(chunks).toString('utf8')

          const matches = [
            ...html.matchAll(
              /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi
            )
          ]

          if (!matches.length) {
            reject(
              new Error('Image introuvable sur la page')
            )
            return
          }

          const imageUrl = matches[0][1]
            .replace(/&amp;/g, '&')

          downloadImage(imageUrl, filePath)
            .then(resolve)
            .catch(reject)
        })
      }
    )

    request.on('error', reject)
  })
}

function downloadImage(url, filePath) {
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
          downloadImage(response.headers.location, filePath)
            .then(resolve)
            .catch(reject)
          return
        }

        if (response.statusCode !== 200) {
          response.resume()
          reject(
            new Error(`Image HTTP ${response.statusCode}`)
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

    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      const fileName =
        product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') + '.jpg'

      const filePath = path.join(
        folder,
        fileName
      )

      console.log(`Téléchargement: ${product.name}`)

      try {
        await download(
          product.page,
          filePath
        )

        const imagePath =
          `/images/products/${fileName}`

        await Product.updateOne(
          { _id: chaussures[i]._id },
          {
            $set: {
              image: imagePath,
              couleurs: [
                {
                  nom: 'Couleur principale',
                  image: imagePath
                }
              ]
            }
          }
        )

        console.log(`✓ ${product.name}`)
      } catch (error) {
        console.log(
          `✕ ${product.name}: ${error.message}`
        )
      }
    }

    console.log('')
    console.log('Terminé')
  } catch (error) {
    console.error('Erreur:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

run()