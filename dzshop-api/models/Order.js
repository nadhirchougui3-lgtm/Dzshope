import mongoose from 'mongoose'

const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    prix: {
      type: Number,
      required: true,
      min: 0,
      max: 100000000,
      validate: {
        validator: Number.isFinite,
        message: 'Product price must be a finite number.',
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Quantity must be a whole number.',
      },
    },

    image: {
      type: String,
      default: '',
      maxlength: 2048,
    },

    taille: {
      type: String,
      default: '',
      maxlength: 50,
    },

    couleur: {
      type: String,
      default: '',
      maxlength: 100,
    },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    telephone: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 30,
    },

    wilaya: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    commune: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    adresse: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 300,
    },

    livraison: {
      type: String,
      enum: ['domicile', 'bureau'],
      required: true,
    },

    paiement: {
      type: String,
      enum: ['cash_on_delivery'],
      default: 'cash_on_delivery',
      required: true,
    },

    produits: {
      type: [orderProductSchema],
      required: true,
      validate: [
        {
          validator: (items) =>
            Array.isArray(items) && items.length >= 1 && items.length <= 50,
          message: 'An order must contain between 1 and 50 products.',
        },
        {
          validator: (items) => {
            const ids = items.map((item) => String(item.productId))
            return new Set(ids).size === ids.length
          },
          message: 'An order cannot contain duplicate product entries.',
        },
      ],
    },

    total: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000000,
      validate: {
        validator: Number.isFinite,
        message: 'Order total must be a finite number.',
      },
    },

    statut: {
      type: String,
      enum: [
        'en attente',
        'confirmee',
        'expediee',
        'livree',
        'annulee',
      ],
      default: 'en attente',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

orderSchema.index({ user: 1, createdAt: -1 })

const Order = mongoose.model('Order', orderSchema)

export default Order
