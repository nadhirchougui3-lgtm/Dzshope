import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Ton formulaire d'inscription demande un nom, un téléphone et un mot de passe :
// on se connecte avec le NUMÉRO DE TÉLÉPHONE pour un compte "local". Un compte
// créé avec Google, lui, n'a ni téléphone ni mot de passe au départ (Google ne
// donne que le nom et l'email) : ces deux champs ne sont obligatoires QUE pour
// les comptes "local".
const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: [true, 'Le nom est obligatoire'], trim: true },

    telephone: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
      unique: true,
      sparse: true, // permet plusieurs comptes SANS téléphone (les comptes Google)
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // permet plusieurs comptes SANS email (les comptes locaux qui n'en ont pas donné)
      lowercase: true,
      trim: true,
    },

    // select: false = la requête NE renvoie PAS le mot de passe, sauf si on le demande exprès
    password: {
      type: String,
      required: function () {
        return this.provider === 'local'
      },
      minlength: [6, 'Le mot de passe doit faire au moins 6 caractères'],
      select: false,
    },

    // Comment ce compte a été créé : "local" (téléphone + mot de passe) ou "google"
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, default: null },

    // "client" par défaut. On ne devient admin que dans la base (guide « espace admin »)
    role: { type: String, enum: ['client', 'admin'], default: 'client' },

    // Un compte bloqué (actif: false) ne peut plus se connecter
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// AVANT chaque sauvegarde : on remplace le mot de passe par son "hash"
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare le mot de passe tapé avec l'empreinte enregistrée
userSchema.methods.verifierMotDePasse = function (motDePasse) {
  // Compte Google : pas de mot de passe en base, donc jamais valide (et pas de plantage)
  if (!this.password) return false
  return bcrypt.compare(motDePasse, this.password)
}

// Ce qu'on a le droit de renvoyer au navigateur : JAMAIS le mot de passe
userSchema.methods.versPublic = function () {
  return {
    id: this._id,
    nom: this.nom,
    telephone: this.telephone,
    email: this.email,
    role: this.role,
    actif: this.actif
  }
}

export default mongoose.model('User', userSchema)
