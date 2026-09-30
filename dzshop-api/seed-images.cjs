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

const protectedCategories = [
  'Soins personnels',
  'Accessoires',
  'Art & Création',
  'Lecture'
]

const targetCategories = [
  'Vêtements',
  'Chaussures',
  'Sacs',
  'Montres',
  'Téléphones',
  'Audio',
  'Ordinateurs',
  'Gaming',
  'Sport',
  'Maquillage',
  'Maison',
  'Camping',
  'Décoration',
  'Bureau'
]

const targetProducts = [
  'Omega Speedmaster Moonwatch Professional',
  'Rolex Datejust 41',
  'Rolex GMT-Master II'
]

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
      reject(new Error('Too many redirects'))
      return
    }

    const client = url.startsWith('https') ? https : http

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
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

          const nextUrl = new URL(
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
      req.destroy(new Error('Timeout'))
    })
  })
}

function requestImage(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) {
      reject(new Error('Too many redirects'))
      return
    }

    const client = url.startsWith('https') ? https : http

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0 Safari/537.36',
          Accept:
            'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          Referer: 'https://www.bing.com/'
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

          const nextUrl = new URL(
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
              `Invalid file received: ${contentType || 'unknown content type'}`
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
      req.destroy(new Error('Timeout'))
    })
  })
}

function extractImageUrls(html) {
  const urls = []

  const patterns = [
    /"murl":"(.*?)"/g,
    /"turl":"(.*?)"/g,
    /murl&quot;:&quot;(.*?)&quot;/g,
    /https?:\\\/\\\/[^"'\\\s]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\\\s]*)?/gi,
    /https?:\/\/[^"'\\\s]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\\\s]*)?/gi
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

function buildQueries(
  productName,
  category,
  variantName = ''
) {
  const variant = variantName
    ? ` "${variantName}"`
    : ''

  const queries = [
    `"${productName}"${variant} official product`,
    `"${productName}"${variant} official`,
    `"${productName}"${variant} product image`,
    `"${productName}"${variant} product photo`,
    `"${productName}"${variant} high resolution`,
    `"${productName}"${variant} white background`
  ]

  if (category === 'Maquillage') {
    queries.push(
      `"${productName}" "${variantName}" makeup product`,
      `"${productName}" "${variantName}" official shade`
    )
  }

  if (category === 'Téléphones') {
    queries.push(
      `"${productName}" smartphone official`,
      `"${productName}" front back product`
    )
  }

  if (category === 'Ordinateurs') {
    queries.push(
      `"${productName}" laptop official`,
      `"${productName}" laptop product image`
    )
  }

  if (category === 'Montres') {
    queries.push(
      `"${productName}" watch official`,
      `"${productName}" watch product image`,
      `"${productName}" luxury watch`,
      `"${productName}" high resolution watch`,
      `"${productName}" product photo watch`
    )
  }

  if (category === 'Chaussures') {
    queries.push(
      `"${productName}" sneakers official`,
      `"${productName}" footwear product image`
    )
  }

  if (category === 'Sacs') {
    queries.push(
      `"${productName}" bag official`,
      `"${productName}" bag product image`
    )
  }

  return queries
}

async function searchImages(
  productName,
  category,
  variantName = ''
) {
  const queries = buildQueries(
    productName,
    category,
    variantName
  )

  const allUrls = []

  for (const searchQuery of queries) {
    const query =
      encodeURIComponent(searchQuery)

    const searchUrl =
      `https://www.bing.com/images/search?q=${query}&form=HDRSC2`

    let response

    try {
      response = await request(searchUrl)
    } catch (error) {
      continue
    }

    if (response.statusCode !== 200) {
      continue
    }

    const html =
      response.body.toString('utf8')

    const urls =
      extractImageUrls(html)

    for (const url of urls) {
      if (!allUrls.includes(url)) {
        allUrls.push(url)
      }
    }

    if (allUrls.length >= 60) {
      break
    }
  }

  if (!allUrls.length) {
    throw new Error(
      'No image found in search results'
    )
  }

  return allUrls
}

function extensionFromContentType(contentType) {
  if (
    contentType.includes('jpeg') ||
    contentType.includes('jpg')
  ) {
    return 'jpg'
  }

  if (contentType.includes('png')) {
    return 'png'
  }

  if (contentType.includes('webp')) {
    return 'webp'
  }

  if (contentType.includes('avif')) {
    return 'avif'
  }

  return 'jpg'
}

function extensionFromUrl(url) {
  const cleanUrl = url
    .split('?')[0]
    .split('#')[0]
    .toLowerCase()

  if (cleanUrl.endsWith('.png')) {
    return 'png'
  }

  if (cleanUrl.endsWith('.webp')) {
    return 'webp'
  }

  if (cleanUrl.endsWith('.avif')) {
    return 'avif'
  }

  if (
    cleanUrl.endsWith('.jpeg') ||
    cleanUrl.endsWith('.jpg')
  ) {
    return 'jpg'
  }

  return null
}

async function downloadImageToFile(
  imageUrl,
  filePath
) {
  const result =
    await requestImage(imageUrl)

  if (result.buffer.length < 5000) {
    throw new Error(
      `Image too small or invalid (${result.buffer.length} bytes)`
    )
  }

  const extension =
    extensionFromContentType(
      result.contentType
    )

  const temporaryPath =
    `${filePath}.tmp`

  fs.writeFileSync(
    temporaryPath,
    result.buffer
  )

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  fs.renameSync(
    temporaryPath,
    filePath
  )

  return {
    extension,
    size: result.buffer.length
  }
}

async function downloadSingleImage({
  productName,
  category,
  variantName = '',
  filePrefix
}) {
  const urls =
    await searchImages(
      productName,
      category,
      variantName
    )

  let lastError =
    'No valid image URL'

  for (
    let i = 0;
    i < Math.min(urls.length, 60);
    i++
  ) {
    const imageUrl = urls[i]

    try {
      const detectedExtension =
        extensionFromUrl(imageUrl)

      const extensions =
        detectedExtension
          ? [
              detectedExtension,
              'jpg',
              'png',
              'webp'
            ]
          : [
              'jpg',
              'png',
              'webp'
            ]

      for (const extension of extensions) {
        const fileName =
          `${filePrefix}.${extension}`

        const filePath =
          path.join(
            imagesFolder,
            fileName
          )

        try {
          const result =
            await downloadImageToFile(
              imageUrl,
              filePath
            )

          return {
            success: true,
            fileName,
            filePath,
            imageUrl,
            size: result.size
          }
        } catch (error) {
          lastError =
            `${error.message} | URL: ${imageUrl}`

          if (
            fs.existsSync(
              `${filePath}.tmp`
            )
          ) {
            fs.unlinkSync(
              `${filePath}.tmp`
            )
          }
        }
      }
    } catch (error) {
      lastError =
        `${error.message} | URL: ${imageUrl}`
    }
  }

  return {
    success: false,
    error: lastError
  }
}

async function processMakeupProduct(product) {
  const baseSlug =
    slugify(product.nom)

  console.log(
    `Product: ${product.nom}`
  )

  console.log(
    `Category: ${product.categorie}`
  )

  console.log(
    `Variants: ${product.couleurs.length}`
  )

  let firstSuccessfulImage = ''

  for (
    let i = 0;
    i < product.couleurs.length;
    i++
  ) {
    const couleur =
      product.couleurs[i]

    console.log(
      `  [${i + 1}/${product.couleurs.length}] ${couleur.nom}`
    )

    const variantSlug =
      slugify(couleur.nom)

    const filePrefix =
      `${baseSlug}-${variantSlug}`

    const result =
      await downloadSingleImage({
        productName:
          product.nom,
        category:
          product.categorie,
        variantName:
          couleur.nom,
        filePrefix
      })

    if (result.success) {
      couleur.image =
        `/images/products/${result.fileName}`

      if (!firstSuccessfulImage) {
        firstSuccessfulImage =
          couleur.image
      }

      console.log(
        `  ✓ ${couleur.nom}`
      )

      console.log(
        `    File: ${result.fileName}`
      )

      console.log(
        `    Size: ${result.size} bytes`
      )
    } else {
      couleur.image = ''

      console.log(
        `  ✗ ${couleur.nom}`
      )

      console.log(
        `    Reason: ${result.error}`
      )
    }

    await delay(700)
  }

  product.image =
    firstSuccessfulImage || ''

  await product.save()

  if (firstSuccessfulImage) {
    console.log(
      `✓ Main image: ${firstSuccessfulImage}`
    )
  } else {
    console.log(
      '✗ Main image: no successful variant image'
    )
  }
}

async function processRegularProduct(product) {
  const baseSlug =
    slugify(product.nom)

  console.log(
    `Product: ${product.nom}`
  )

  console.log(
    `Category: ${product.categorie}`
  )

  const result =
    await downloadSingleImage({
      productName:
        product.nom,
      category:
        product.categorie,
      filePrefix:
        baseSlug
    })

  if (result.success) {
    product.image =
      `/images/products/${result.fileName}`

    await product.save()

    console.log(
      `✓ ${product.nom}`
    )

    console.log(
      `  File: ${result.fileName}`
    )

    console.log(
      `  Path: ${product.image}`
    )

    console.log(
      `  Size: ${result.size} bytes`
    )

    return true
  }

  console.log(
    `✗ ${product.nom}`
  )

  console.log(
    `  Reason: ${result.error}`
  )

  return false
}

async function processProduct(product) {
  if (
    product.couleurs &&
    product.couleurs.length > 0 &&
    product.categorie === 'Maquillage'
  ) {
    await processMakeupProduct(
      product
    )

    return
  }

  await processRegularProduct(
    product
  )
}

async function validateProtectedCategories() {
  for (
    const category
    of protectedCategories
  ) {
    const count =
      await Product.countDocuments({
        categorie: category
      })

    if (count !== 20) {
      throw new Error(
        `Protected category "${category}" contains ${count} products. Expected 20. Image seeding aborted.`
      )
    }
  }
}

async function validateTargetCategories() {
  for (
    const category
    of targetCategories
  ) {
    const count =
      await Product.countDocuments({
        categorie: category
      })

    const expected =
      category === 'Vêtements'
        ? 40
        : 20

    if (count !== expected) {
      throw new Error(
        `Target category "${category}" contains ${count} products. Expected ${expected}.`
      )
    }
  }
}

async function validateTargetProducts() {
  for (
    const productName
    of targetProducts
  ) {
    const count =
      await Product.countDocuments({
        nom: productName
      })

    if (count !== 1) {
      throw new Error(
        `Target product "${productName}" contains ${count} records. Expected exactly 1. Image seeding aborted.`
      )
    }
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
      'MongoDB connected'
    )

    console.log('')

    console.log(
      'Validating protected categories...'
    )

    await validateProtectedCategories()

    console.log(
      '✓ Protected categories validated'
    )

    console.log('')

    console.log(
      'Validating target categories...'
    )

    await validateTargetCategories()

    console.log(
      '✓ Target categories validated'
    )

    console.log('')

    console.log(
      'Validating target products...'
    )

    await validateTargetProducts()

    console.log(
      '✓ 3 target products validated'
    )

    console.log('')

    console.log(
      'Protected categories will NOT be processed:'
    )

    for (
      const category
      of protectedCategories
    ) {
      console.log(
        `  ✓ ${category}`
      )
    }

    console.log('')

    const products =
      await Product.find({
        nom: {
          $in: targetProducts
        }
      }).sort({
        nom: 1
      })

    console.log(
      `${products.length} products targeted`
    )

    console.log(
      'Expected: 3 products'
    )

    console.log('')

    if (
      products.length !== 3
    ) {
      throw new Error(
        `Expected 3 target products, found ${products.length}.`
      )
    }

    let productSuccess = 0

    let productFailed = 0

    let variantSuccess = 0

    let variantFailed = 0

    const failedProducts = []

    const failedVariants = []

    for (
      let i = 0;
      i < products.length;
      i++
    ) {
      const product =
        products[i]

      console.log(
        '========================================'
      )

      console.log(
        `[${i + 1}/${products.length}]`
      )

      try {
        const variantCount =
          product.categorie === 'Maquillage' &&
          product.couleurs
            ? product.couleurs.length
            : 0

        await processProduct(
          product
        )

        const refreshed =
          await Product.findById(
            product._id
          )

        if (
          refreshed &&
          refreshed.image
        ) {
          productSuccess++
        } else {
          productFailed++

          failedProducts.push({
            name:
              product.nom,
            category:
              product.categorie,
            reason:
              'No main image saved'
          })
        }

        if (
          variantCount > 0
        ) {
          const savedVariants =
            refreshed &&
            refreshed.couleurs
              ? refreshed.couleurs
              : []

          for (
            const couleur
            of savedVariants
          ) {
            if (
              couleur.image
            ) {
              variantSuccess++
            } else {
              variantFailed++

              failedVariants.push({
                product:
                  product.nom,
                variant:
                  couleur.nom,
                reason:
                  'No image saved'
              })
            }
          }
        }
      } catch (error) {
        productFailed++

        failedProducts.push({
          name:
            product.nom,
          category:
            product.categorie,
          reason:
            error.message
        })

        console.log(
          `✗ ${product.nom}`
        )

        console.log(
          `  Reason: ${error.message}`
        )
      }

      console.log('')

      await delay(1200)
    }

    console.log(
      '========================================'
    )

    console.log(
      'FINAL RESULT'
    )

    console.log(
      '========================================'
    )

    console.log(
      `✓ Products with main image: ${productSuccess}`
    )

    console.log(
      `✗ Products without main image: ${productFailed}`
    )

    console.log(
      `✓ Makeup variant images: ${variantSuccess}`
    )

    console.log(
      `✗ Failed makeup variants: ${variantFailed}`
    )

    console.log(
      `Total targeted products: ${products.length}`
    )

    console.log('')

    if (
      failedProducts.length > 0
    ) {
      console.log(
        'FAILED PRODUCTS'
      )

      console.log(
        '========================================'
      )

      for (
        const failed
        of failedProducts
      ) {
        console.log(
          `✗ ${failed.name}`
        )

        console.log(
          `  Category: ${failed.category}`
        )

        console.log(
          `  Reason: ${failed.reason}`
        )

        console.log('')
      }
    }

    if (
      failedVariants.length > 0
    ) {
      console.log(
        'FAILED MAKEUP VARIANTS'
      )

      console.log(
        '========================================'
      )

      for (
        const failed
        of failedVariants
      ) {
        console.log(
          `✗ ${failed.product} — ${failed.variant}`
        )

        console.log(
          `  Reason: ${failed.reason}`
        )

        console.log('')
      }
    }

    console.log(
      '========================================'
    )

    console.log(
      'Protected categories were not processed.'
    )

    console.log(
      'No image operation was performed on:'
    )

    for (
      const category
      of protectedCategories
    ) {
      console.log(
        `✓ ${category}`
      )
    }

    console.log(
      '========================================'
    )
  } catch (error) {
    console.error(
      'Image seeding error:',
      error.message
    )

    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedImages()