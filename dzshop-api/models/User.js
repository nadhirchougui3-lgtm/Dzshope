import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128
const BCRYPT_ROUNDS = 12

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    telephone: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
      unique: true,
      sparse: true,
      trim: true,
      minlength: [5, 'Telephone number is too short'],
      maxlength: [30, 'Telephone number is too long'],
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email address is too long'],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
      minlength: [
        MIN_PASSWORD_LENGTH,
        `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`,
      ],
      maxlength: [
        MAX_PASSWORD_LENGTH,
        `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`,
      ],
      select: false,
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
      required: true,
    },

    googleId: {
      type: String,
      default: null,
      maxlength: 255,
    },

    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
      required: true,
    },

    actif: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash passwords before saving changes to them.
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return
  }

  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS)
})

// Compare a supplied password with the stored hash.
userSchema.methods.verifierMotDePasse = function (motDePasse) {
  if (
    typeof motDePasse !== 'string' ||
    !this.password ||
    motDePasse.length === 0 ||
    motDePasse.length > MAX_PASSWORD_LENGTH
  ) {
    return false
  }

  return bcrypt.compare(motDePasse, this.password)
}

// Return only fields that are safe to expose to the client.
userSchema.methods.versPublic = function () {
  return {
    id: this._id,
    nom: this.nom,
    telephone: this.telephone,
    email: this.email,
    role: this.role,
    actif: this.actif,
  }
}

export default mongoose.model('User', userSchema)
