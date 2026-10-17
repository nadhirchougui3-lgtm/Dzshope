
import mongoose from 'mongoose'

const webAuthnChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true,
  },

  challenge: {
    type: String,
    required: true,
    select: false,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },

  type: {
    type: String,
    enum: ['registration', 'authentication'],
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
})

export default mongoose.model(
  'WebAuthnChallenge',
  webAuthnChallengeSchema
)
