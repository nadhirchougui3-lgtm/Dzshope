// Utilisation (depuis le dossier dzshop-api) :  node makeAdmin.js 0555xxxxxxxx
// Le compte doit déjà exister : inscris-toi d'abord sur le site. Personne ne peut se
// choisir « admin » depuis le site (c'est voulu) : on le fait ici, dans la base.

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

const telephone = (process.argv[2] || '').trim()

if (!telephone) {
  console.log('Utilisation : node makeAdmin.js 0555xxxxxxxx')
  process.exit(1)
}

try {
  await mongoose.connect(process.env.MONGODB_URI)

  const user = await User.findOneAndUpdate({ telephone: telephone }, { role: 'admin' }, { returnDocument: 'after' })

  if (!user) {
    console.log('Aucun compte avec le téléphone ' + telephone + '. Inscris-toi d\'abord sur le site.')
  } else {
    console.log(user.nom + ' (' + user.telephone + ') est maintenant admin.')
  }
} catch (erreur) {
  console.log('Erreur : ' + erreur.message)
} finally {
  await mongoose.disconnect()
}