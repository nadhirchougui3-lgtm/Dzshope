import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    nom: {
      type: String,
      required: true,
      trim: true
    },

    telephone: {
      type: String,
      required: true,
      trim: true
    },

    wilaya: {
      type: String,
      required: true,
      trim: true
    },

    commune: {
      type: String,
      required: true,
      trim: true
    },

    adresse: {
      type: String,
      required: true,
      trim: true
    },

    livraison: {
      type: String,
      enum: ['domicile', 'bureau'],
      required: true
    },

    paiement: {
      type: String,
      enum: ['cash_on_delivery'],
      default: 'cash_on_delivery',
      required: true
    },

    produits: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },

        nom: {
          type: String,
          required: true
        },

        prix: {
          type: Number,
          required: true,
          min: 0
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        image: {
          type: String,
          default: ''
        },

        taille: {
          type: String,
          default: ''
        },

        couleur: {
          type: String,
          default: ''
        }
      }
    ],

    total: {
      type: Number,
      required: true,
      min: 0
    },

    statut: {
      type: String,
      enum: [
        'en attente',
        'confirmee',
        'expediee',
        'livree',
        'annulee'
      ],
      default: 'en attente',
      index: true
    }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order ;