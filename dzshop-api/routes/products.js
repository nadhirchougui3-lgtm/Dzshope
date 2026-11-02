
import express from 'express'
import mongoose from 'mongoose'

import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const MAX_NAME_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 5000
const MAX_CATEGORY_LENGTH = 100
const MAX_IMAGE_LENGTH = 2048
const MAX_COLOR_LENGTH = 50
const MAX_SIZE_LENGTH = 50
const MAX_COLORS = 100
const MAX_SIZES = 100
const MAX_STOCK = 1_000_000
const MAX_PRICE = 1_000_000_000

function validateProductFields(body, creation = false) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return { error: 'Invalid product data.' }
  }

  const data = {}

  if (body.nom !== undefined || creation) {
    if (
      typeof body.nom !== 'string' ||
      body.nom.trim().length < 1 ||
      body.nom.trim().length > MAX_NAME_LENGTH
    ) {
      return {
        error: `Product name must contain between 1 and ${MAX_NAME_LENGTH} characters.`,
      }
    }

    data.nom = body.nom.trim()
  }

  if (body.description !== undefined) {
    if (
      typeof body.description !== 'string' ||
      body.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      return {
        error: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`,
      }
    }

    data.description = body.description
  }

  if (body.prix !== undefined || creation) {
    if (
      body.prix === '' ||
      body.prix === null ||
      body.prix === undefined ||
      !['number', 'string'].includes(typeof body.prix) ||
      (typeof body.prix === 'string' && !body.prix.trim())
    ) {
      return { error: 'Invalid product price.' }
    }

    const price = Number(body.prix)

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      price > MAX_PRICE
    ) {
      return {
        error: `Product price must be between 0 and ${MAX_PRICE}.`,
      }
    }

    data.prix = price
  }

  if (body.categorie !== undefined) {
    if (
      typeof body.categorie !== 'string' ||
      body.categorie.trim().length < 1 ||
      body.categorie.trim().length > MAX_CATEGORY_LENGTH
    ) {
      return { error: 'Invalid product category.' }
    }

    data.categorie = body.categorie.trim()
  }

  if (body.stock !== undefined) {
    if (
      body.stock === '' ||
      body.stock === null ||
      !['number', 'string'].includes(typeof body.stock) ||
      (typeof body.stock === 'string' && !body.stock.trim())
    ) {
      return { error: 'Invalid product stock.' }
    }

    const stock = Number(body.stock)

    if (
      !Number.isSafeInteger(stock) ||
      stock < 0 ||
      stock > MAX_STOCK
    ) {
      return {
        error: `Product stock must be an integer between 0 and ${MAX_STOCK}.`,
      }
    }

    data.stock = stock
  }

  if (body.image !== undefined) {
    if (
      typeof body.image !== 'string' ||
      body.image.trim().length > MAX_IMAGE_LENGTH
    ) {
      return { error: 'Invalid product image.' }
    }

    data.image = body.image.trim()
  }

  if (body.couleurs !== undefined) {
    if (
      !Array.isArray(body.couleurs) ||
      body.couleurs.length > MAX_COLORS
    ) {
      return {
        error: `Product colors must be an array containing at most ${MAX_COLORS} items.`,
      }
    }

    const colors = []
    const colorNames = new Set()

    for (const color of body.couleurs) {
      if (
        !color ||
        typeof color !== 'object' ||
        Array.isArray(color) ||
        typeof color.nom !== 'string' ||
        color.nom.trim().length < 1 ||
        color.nom.trim().length > MAX_COLOR_LENGTH ||
        (
          color.image !== undefined &&
          (
            typeof color.image !== 'string' ||
            color.image.trim().length > MAX_IMAGE_LENGTH
          )
        )
      ) {
        return { error: 'Invalid product color data.' }
      }

      const colorName = color.nom.trim()

      if (colorNames.has(colorName.toLowerCase())) {
        return { error: 'Duplicate product colors are not allowed.' }
      }

      colorNames.add(colorName.toLowerCase())

      colors.push({
        nom: colorName,
        image: typeof color.image === 'string'
          ? color.image.trim()
          : '',
      })
    }

    data.couleurs = colors
  }

  if (body.tailles !== undefined) {
    if (
      !Array.isArray(body.tailles) ||
      body.tailles.length > MAX_SIZES ||
      !body.tailles.every(
        size =>
          typeof size === 'string' &&
          size.trim().length >= 1 &&
          size.trim().length <= MAX_SIZE_LENGTH
      )
    ) {
      return {
        error: `Product sizes must be valid strings with at most ${MAX_SIZE_LENGTH} characters each.`,
      }
    }

    const sizes = body.tailles.map(size => size.trim())
    const normalizedSizes = sizes.map(size => size.toLowerCase())

    if (new Set(normalizedSizes).size !== normalizedSizes.length) {
      return { error: 'Duplicate product sizes are not allowed.' }
    }

    data.tailles = sizes
  }

  if (!creation && Object.keys(data).length === 0) {
    return { error: 'No valid product fields were provided for update.' }
  }

  return { data }
}

function handleError(res, error, operation) {
  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      message: 'Invalid product data.',
    })
  }

  console.error(operation, error.message)

  return res.status(500).json({
    message: 'An internal server error occurred.',
  })
}

router.get('/', async function (req, res) {
  try {
    const products = await Product.find().sort({ createdAt: 1 })

    return res.json(products)
  } catch (error) {
    return handleError(res, error, 'Product retrieval failed:')
  }
})

router.get('/:id', async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Product not found.',
    })
  }

  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      })
    }

    return res.json(product)
  } catch (error) {
    return handleError(res, error, 'Product retrieval failed:')
  }
})

router.post('/', protect, isAdmin, async function (req, res) {
  const result = validateProductFields(req.body, true)

  if (result.error) {
    return res.status(400).json({
      message: result.error,
    })
  }

  try {
    const product = await Product.create(result.data)

    return res.status(201).json(product)
  } catch (error) {
    return handleError(res, error, 'Product creation failed:')
  }
})

router.put('/:id', protect, isAdmin, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Product not found.',
    })
  }

  const result = validateProductFields(req.body)

  if (result.error) {
    return res.status(400).json({
      message: result.error,
    })
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: result.data },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      })
    }

    return res.json(product)
  } catch (error) {
    return handleError(res, error, 'Product update failed:')
  }
})

router.delete('/:id', protect, isAdmin, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      message: 'Product not found.',
    })
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      })
    }

    return res.json({
      message: 'Product deleted successfully.',
    })
  } catch (error) {
    return handleError(res, error, 'Product deletion failed:')
  }
})

export default router
