
import mongoose from 'mongoose'

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

const colorSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: MAX_COLOR_LENGTH,
    },

    image: {
      type: String,
      default: '',
      maxlength: MAX_IMAGE_LENGTH,
    },
  },
  { _id: false }
)

const schema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: MAX_NAME_LENGTH,
    },

    description: {
      type: String,
      default: '',
      maxlength: MAX_DESCRIPTION_LENGTH,
    },

    prix: {
      type: Number,
      required: true,
      min: 0,
      max: MAX_PRICE,
      validate: {
        validator: Number.isFinite,
        message: 'Product price must be a finite number.',
      },
    },

    categorie: {
      type: String,
      default: 'Divers',
      trim: true,
      maxlength: MAX_CATEGORY_LENGTH,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
      max: MAX_STOCK,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Product stock must be a whole number.',
      },
    },

    image: {
      type: String,
      default: '',
      maxlength: MAX_IMAGE_LENGTH,
    },

    couleurs: {
      type: [colorSchema],
      default: [],
      validate: [
        {
          validator: colors => colors.length <= MAX_COLORS,
          message: `A product cannot have more than ${MAX_COLORS} colors.`,
        },
      ],
    },

    tailles: {
      type: [String],
      default: [],
      validate: [
        {
          validator: sizes =>
            sizes.length <= MAX_SIZES &&
            sizes.every(
              size =>
                typeof size === 'string' &&
                size.trim().length >= 1 &&
                size.trim().length <= MAX_SIZE_LENGTH
            ),
          message: 'Product sizes are invalid.',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

schema.index({ createdAt: 1 })

export default mongoose.model('Product', schema)
