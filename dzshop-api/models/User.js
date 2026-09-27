import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Ton formulaire d'inscription demande un nom, un téléphone et un mot de passe
// (pas d'email) : on se connecte donc avec le NUMÉRO DE TÉLÉPHONE.
const userSchema = new mongoose.Schema(
  {
    nom: { type: String, required: [true, 'Le nom est obligatoire'], trim: true },

    telephone: {
      type: String,
      required: [true, 'Le téléphone est obligatoire'],
      unique: true,
      trim: true,
    },

    // select: false = la requête NE renvoie PAS le mot de passe, sauf si on le demande exprès
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit faire au moins 6 caractères'],
      select: false,
    },

    // "client" par défaut. On ne devient admin que dans la base (séance suivante)
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
  },
  { timestamps: true }
)

// AVANT chaque sauvegarde : on remplace le mot de passe par son "hash"
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare le mot de passe tapé avec l'empreinte enregistrée
userSchema.methods.verifierMotDePasse = function (motDePasse) {
  return bcrypt.compare(motDePasse, this.password)
}

// Ce qu'on a le droit de renvoyer au navigateur : JAMAIS le mot de passe
userSchema.methods.versPublic = function () {
  return { id: this._id, nom: this.nom, telephone: this.telephone, role: this.role }
}

export default mongoose.model('User', userSchema)