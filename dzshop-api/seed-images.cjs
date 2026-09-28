require('dotenv').config()

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const ProductModule = require('./models/Product.js')

const Product = ProductModule.default || ProductModule

const imagesFolder = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'products'
)

const delay = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function request(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error('Trop de redirections'))
      return
    }

    const client = url.startsWith('https')
      ? https
      : http

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        },
        timeout: 20000
      },
      response => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume()

          const nextUrl =
            new URL(
              response.headers.location,
              url
            ).href

          request(nextUrl, redirects + 1)
            .then(resolve)
            .catch(reject)

          return
        }

        const chunks = []

        response.on('data', chunk => {
          chunks.push(chunk)
        })

        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks)
          })
        })
      }
    )

    req.on('error', reject)

    req.on('timeout', () => {
      req.destroy(
        new Error('Timeout')
      )
    })
  })
}

function requestImage(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error('Trop de redirections'))
      return
    }

    const client = url.startsWith('https')
      ? https
      : http

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0 Safari/537.36',
          Accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        },
        timeout: 25000
      },
      response => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          response.resume()

          const nextUrl =
            new URL(
              response.headers.location,
              url
            ).href

          requestImage(nextUrl, redirects + 1)
            .then(resolve)
            .catch(reject)

          return
        }

        if (
          response.statusCode < 200 ||
          response.statusCode >= 300
        ) {
          response.resume()

          reject(
            new Error(
              `HTTP ${response.statusCode}`
            )
          )

          return
        }

        const contentType =
          response.headers['content-type'] || ''

        if (!contentType.startsWith('image/')) {
          response.resume()

          reject(
            new Error(
              `Fichier reçu invalide : ${contentType}`
            )
          )

          return
        }

        const chunks = []

        response.on('data', chunk => {
          chunks.push(chunk)
        })

        response.on('end', () => {
          resolve({
            buffer: Buffer.concat(chunks),
            contentType
          })
        })
      }
    )

    req.on('error', reject)

    req.on('timeout', () => {
      req.destroy(
        new Error('Timeout')
      )
    })
  })
}

function extractImageUrls(html) {
  const urls = []

  const patterns = [
    /"murl":"(.*?)"/g,
    /"turl":"(.*?)"/g,
    /murl&quot;:&quot;(.*?)&quot;/g,
    /https?:\/\/[^"'\\ ]+\.(?:jpg|jpeg|png|webp)/gi
  ]

  for (const pattern of patterns) {
    let match

    while ((match = pattern.exec(html))) {
      let url = match[1] || match[0]

      url = url
        .replace(/\\u002f/g, '/')
        .replace(/\\\//g, '/')
        .replace(/\\u0026/g, '&')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')

      if (
        url.startsWith('http://') ||
        url.startsWith('https://')
      ) {
        if (!urls.includes(url)) {
          urls.push(url)
        }
      }
    }
  }

  return urls
}

async function searchImages(productName) {
  const query = encodeURIComponent(
    `${productName} official product`
  )

  const searchUrl =
    `https://www.bing.com/images/search?q=${query}&form=HDRSC2`

  const response =
    await request(searchUrl)

  if (response.statusCode !== 200) {
    throw new Error(
      `Recherche HTTP ${response.statusCode}`
    )
  }

  const html =
    response.body.toString('utf8')

  const urls =
    extractImageUrls(html)

  if (!urls.length) {
    throw new Error(
      'Aucune image trouvée'
    )
  }

  return urls
}

function extensionFromContentType(
  contentType
) {
  if (
    contentType.includes('jpeg') ||
    contentType.includes('jpg')
  ) {
    return 'jpg'
  }

  if (
    contentType.includes('png')
  ) {
    return 'png'
  }

  if (
    contentType.includes('webp')
  ) {
    return 'webp'
  }

  if (
    contentType.includes('avif')
  ) {
    return 'avif'
  }

  return 'jpg'
}

async function downloadProductImage(
  product
) {
  const urls =
    await searchImages(product.nom)

  let lastError =
    'Aucune URL valide'

  for (const imageUrl of urls.slice(0, 12)) {
    try {
      const result =
        await requestImage(imageUrl)

      if (
        result.buffer.length < 5000
      ) {
        throw new Error(
          'Image trop petite ou invalide'
        )
      }

      const extension =
        extensionFromContentType(
          result.contentType
        )

      const fileName =
        `${slugify(product.nom)}.${extension}`

      const filePath =
        path.join(
          imagesFolder,
          fileName
        )

      fs.writeFileSync(
        filePath,
        result.buffer
      )

      product.image =
        `/images/products/${fileName}`

      await product.save()

      return {
        success: true,
        fileName,
        imageUrl
      }
    } catch (error) {
      lastError =
        error.message
    }
  }

  return {
    success: false,
    error: lastError
  }
}

async function seedImages() {
  try {
    fs.mkdirSync(
      imagesFolder,
      {
        recursive: true
      }
    )

    await mongoose.connect(
      process.env.MONGODB_URI
    )

    console.log(
      'MongoDB connecté'
    )

    console.log('')

    const products =
      await Product.find({})
        .sort({
          categorie: 1,
          nom: 1
        })

    console.log(
      `${products.length} produits trouvés`
    )

    console.log('')

    let success = 0
    let failed = 0

    for (
      let i = 0;
      i < products.length;
      i++
    ) {
      const product =
        products[i]

      console.log(
        `[${i + 1}/${products.length}] ${product.nom}`
      )

      try {
        const result =
          await downloadProductImage(
            product
          )

        if (result.success) {
          success++

          console.log(
            `✓ ${product.nom}`
          )

          console.log(
            `  ${result.fileName}`
          )

          console.log(
            `  ${product.image}`
          )
        } else {
          failed++

          console.log(
            `✗ ${product.nom}`
          )

          console.log(
            `  ${result.error}`
          )
        }
      } catch (error) {
        failed++

        console.log(
          `✗ ${product.nom}`
        )

        console.log(
          `  ${error.message}`
        )
      }

      console.log('')

      await delay(1200)
    }

    console.log(
      '=============================='
    )

    console.log(
      `✓ Images téléchargées : ${success}`
    )

    console.log(
      `✗ Images échouées : ${failed}`
    )

    console.log(
      `Total : ${products.length}`
    )

    console.log(
      '=============================='
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

seedImages()