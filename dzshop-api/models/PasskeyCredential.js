
import mongoose from 'mongoose'

const passkeyCredentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    credentialId: {
      type: String,
      required: true,
      unique: true,
    },

    publicKey: {
      type: String,
      required: true,
      select: false,
    },

    counter: {
      type: Number,
      required: true,
      default: 0,
    },

    transports: {
      type: [String],
      default: [],
    },

    deviceType: {
      type: String,
      default: 'unknown',
    },

    backedUp: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.model(
  'PasskeyCredential',
  passkeyCredentialSchema
)
