import express from 'express'
import mongoose from 'mongoose'

import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = express.Router()

const VALID_STATUSES = [
  'en attente',
  'confirmee',
  'expediee',
  'livree',
  'annulee',
]

const MAX_PRODUCTS_PER_ORDER = 50
const MAX_QUANTITY_PER_PRODUCT = 99
const MAX_ORDER_TOTAL = 1_000_000_000

function clientError(message) {
  const error = new Error(message)
  error.status = 400
  return error
}

function handleError(res, error, operation) {
  if (error.status === 400) {
    return res.status(400).json({ message: error.message })
  }

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      message: 'Invalid order data.',
    })
  }

  console.error(operation, error.message)

  return res.status(500).json({
    message: 'An internal server error occurred.',
  })
}

function isNonEmptyString(value, minLength, maxLength) {
  return (
    typeof value === 'string' &&
    value.trim().length >= minLength &&
    value.trim().length <= maxLength
  )
}

function isValidOption(value, maxLength) {
  return (
    value === undefined ||
    (typeof value === 'string' && value.trim().length <= maxLength)
  )
}

router.post('/', protect, async function (req, res) {
  try {
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: 'Invalid order data.',
      })
    }

    const {
      nom,
      telephone,
      wilaya,
      commune,
      adresse,
      livraison,
      paiement,
      produits,
    } = req.body

    if (
      !isNonEmptyString(nom, 2, 80) ||
      !isNonEmptyString(telephone, 5, 30) ||
      !isNonEmptyString(wilaya, 2, 100) ||
      !isNonEmptyString(commune, 2, 100) ||
      !isNonEmptyString(adresse, 3, 300)
    ) {
      return res.status(400).json({
        message: 'Invalid or incomplete delivery information.',
      })
    }

    if (!['domicile', 'bureau'].includes(livraison)) {
      return res.status(400).json({
        message: 'Invalid delivery method.',
      })
    }

    if (
      paiement !== undefined &&
      paiement !== 'cash_on_delivery'
    ) {
      return res.status(400).json({
        message: 'Invalid payment method.',
      })
    }

    if (
      !Array.isArray(produits) ||
      produits.length < 1 ||
      produits.length > MAX_PRODUCTS_PER_ORDER
    ) {
      return res.status(400).json({
        message: `An order must contain between 1 and ${MAX_PRODUCTS_PER_ORDER} products.`,
      })
    }

    const validatedLines = []

    for (const line of produits) {
      if (
        !line ||
        typeof line !== 'object' ||
        Array.isArray(line) ||
        typeof line.productId !== 'string' ||
        !mongoose.isValidObjectId(line.productId)
      ) {
        return res.status(400).json({
          message: 'Invalid product.',
        })
      }

      if (
        !['number', 'string'].includes(typeof line.quantity) ||
        String(line.quantity).trim() === ''
      ) {
        return res.status(400).json({
          message: 'Invalid product quantity.',
        })
      }

      const quantity = Number(line.quantity)

      if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY_PER_PRODUCT
      ) {
        return res.status(400).json({
          message: 'Product quantity must be between 1 and 99.',
        })
      }

      if (
        !isValidOption(line.taille, 50) ||
        !isValidOption(line.couleur, 100)
      ) {
        return res.status(400).json({
          message: 'Invalid product options.',
        })
      }

      validatedLines.push({
        productId: line.productId,
        quantity,
        taille: typeof line.taille === 'string'
          ? line.taille.trim()
          : '',
        couleur: typeof line.couleur === 'string'
          ? line.couleur.trim()
          : '',
      })
    }

    const productIds = validatedLines.map(line => line.productId)
    const uniqueProductIds = [...new Set(productIds)]

    if (uniqueProductIds.length !== productIds.length) {
      return res.status(400).json({
        message: 'Duplicate products are not allowed in an order.',
      })
    }

    const databaseProducts = await Product.find({
      _id: { $in: uniqueProductIds },
    })

    if (databaseProducts.length !== uniqueProductIds.length) {
      return res.status(400).json({
        message: 'One or more products could not be found.',
      })
    }

    const orderLines = []
    let total = 0

    for (const line of validatedLines) {
      const product = databaseProducts.find(
        item => String(item._id) === line.productId
      )

      if (!product) {
        return res.status(400).json({
          message: 'Product not found.',
        })
      }

      if (
        !Number.isSafeInteger(product.stock) ||
        product.stock < 0 ||
        line.quantity > product.stock
      ) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.nom}.`,
        })
      }

      if (
        line.taille &&
        Array.isArray(product.tailles) &&
        product.tailles.length > 0 &&
        !product.tailles.includes(line.taille)
      ) {
        return res.status(400).json({
          message: `Invalid size for ${product.nom}.`,
        })
      }

      if (
        line.couleur &&
        Array.isArray(product.couleurs) &&
        product.couleurs.length > 0 &&
        !product.couleurs.some(
          color => color.nom === line.couleur
        )
      ) {
        return res.status(400).json({
          message: `Invalid color for ${product.nom}.`,
        })
      }

      if (
        typeof product.prix !== 'number' ||
        !Number.isFinite(product.prix) ||
        product.prix < 0
      ) {
        console.error('Invalid product price:', String(product._id))

        return res.status(500).json({
          message: 'Unable to process this order.',
        })
      }

      const subtotal = product.prix * line.quantity

      if (
        !Number.isFinite(subtotal) ||
        !Number.isFinite(total + subtotal) ||
        total + subtotal > MAX_ORDER_TOTAL
      ) {
        return res.status(400).json({
          message: 'Order total exceeds the permitted limit.',
        })
      }

      total += subtotal

      orderLines.push({
        productId: product._id,
        nom: product.nom,
        prix: product.prix,
        quantity: line.quantity,
        image: product.image,
        taille: line.taille,
        couleur: line.couleur,
      })
    }

    const modifiedStock = []

    try {
      for (const line of orderLines) {
        const result = await Product.updateOne(
          {
            _id: line.productId,
            stock: { $gte: line.quantity },
          },
          {
            $inc: { stock: -line.quantity },
          }
        )

        if (result.modifiedCount !== 1) {
          throw clientError(`Insufficient stock for ${line.nom}.`)
        }

        modifiedStock.push(line)
      }

      const order = await Order.create({
        user: req.user._id,
        nom: nom.trim(),
        telephone: telephone.trim(),
        wilaya: wilaya.trim(),
        commune: commune.trim(),
        adresse: adresse.trim(),
        livraison,
        paiement: paiement || 'cash_on_delivery',
        produits: orderLines,
        total,
      })

      return res.status(201).json({
        message: 'Order created successfully.',
        order,
      })
    } catch (error) {
      for (const line of modifiedStock) {
        try {
          const restoration = await Product.updateOne(
            { _id: line.productId },
            { $inc: { stock: line.quantity } }
          )

          if (restoration.modifiedCount !== 1) {
            console.error(
              'Stock restoration was not confirmed:',
              String(line.productId)
            )
          }
        } catch (restorationError) {
          console.error(
            'Stock restoration failed:',
            String(line.productId),
            restorationError.message
          )
        }
      }

      throw error
    }
  } catch (error) {
    return handleError(res, error, 'Order creation failed:')
  }
})

// Return only orders belonging to the authenticated user.
router.get('/my', protect, async function (req, res) {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 })

    return res.json(orders)
  } catch (error) {
    return handleError(res, error, 'Order retrieval failed:')
  }
})

// Return one order only if it belongs to the authenticated user.
router.get('/:id', protect, async function (req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid order ID.',
    })
  }

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      })
    }

    return res.json(order)
  } catch (error) {
    return handleError(res, error, 'Order retrieval failed:')
  }
})

// Administrators can view all orders.
router.get('/', protect, isAdmin, async function (req, res) {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    })

    return res.json(orders)
  } catch (error) {
    return handleError(res, error, 'Admin order retrieval failed:')
  }
})

// Only administrators can update order statuses.
router.patch('/:id/statut', protect, isAdmin, async function (req, res) {
  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    !VALID_STATUSES.includes(req.body.statut)
  ) {
    return res.status(400).json({
      message: 'Invalid order status.',
    })
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid order ID.',
    })
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { statut: req.body.statut },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )

    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      })
    }

    return res.json(order)
  } catch (error) {
    return handleError(res, error, 'Order status update failed:')
  }
})

export default router
