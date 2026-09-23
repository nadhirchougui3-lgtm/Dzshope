import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true
    },
    telephone: {
      type: String,
      required: true
    },
    wilaya: {
      type: String,
      required: true
    },
    commune: {
      type: String,
      required: true
    },
    adresse: {
      type: String,
      required: true
    },
    livraison: {
      type: String,
      enum: ['domicile', 'bureau'],
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
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        image: {
          type: String
        }
      }
    ],
    total: {
      type: Number,
      required: true
    },
    statut: {
      type: String,
      default: 'en attente'
    }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order ;