import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'

const products = [
  {
    nom: 'Augustinus Bader The Body Cream 100ml',
    description: 'Crème corporelle luxueuse Augustinus Bader pour une hydratation intense et une peau plus douce.',
    prix: 42000
  },
  {
    nom: 'La Mer The Body Crème 200ml',
    description: 'Crème corporelle premium La Mer pour nourrir et hydrater la peau.',
    prix: 65000
  },
  {
    nom: 'Jo Malone London Lime Basil & Mandarin Body Crème 175ml',
    description: 'Crème corporelle parfumée Jo Malone London aux notes Lime Basil & Mandarin.',
    prix: 32000
  },
  {
    nom: 'Aesop Geranium Leaf Body Cleanser 500ml',
    description: 'Nettoyant corps Aesop aux feuilles de géranium pour une peau propre et rafraîchie.',
    prix: 12500
  },
  {
    nom: 'Le Labo Hinoki Shower Gel 500ml',
    description: 'Gel douche parfumé Le Labo Hinoki pour nettoyer délicatement la peau.',
    prix: 18000
  },
  {
    nom: 'Kiehl’s Creme de Corps 500ml',
    description: 'Lotion corporelle nourrissante Kiehl’s pour hydrater et adoucir la peau.',
    prix: 14500
  },
  {
    nom: 'Sol de Janeiro Brazilian Bum Bum Cream 240ml',
    description: 'Crème corporelle emblématique Sol de Janeiro à la texture riche et parfumée.',
    prix: 11500
  },
  {
    nom: 'OUAI Body Crème 212ml',
    description: 'Crème corporelle luxueuse OUAI pour hydrater et parfumer délicatement la peau.',
    prix: 13500
  },
  {
    nom: 'Byredo Bal d’Afrique Body Lotion 225ml',
    description: 'Lotion corporelle parfumée Byredo Bal d’Afrique à la texture légère et hydratante.',
    prix: 25000
  },
  {
    nom: 'Diptyque Do Son Perfumed Body Lotion 200ml',
    description: 'Lotion corporelle parfumée Diptyque Do Son pour hydrater et parfumer la peau.',
    prix: 22000
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')

    const produitsExistants = await Product.find({
      categorie: 'Soins personnels'
    }).sort({ _id: 1 })

    console.log(
      `${produitsExistants.length} produits Soins personnels trouvés`
    )

    if (produitsExistants.length !== 10) {
      throw new Error(
        `Nombre inattendu : ${produitsExistants.length}. Le seed attend exactement 10 produits Soins personnels.`
      )
    }

    for (let i = 0; i < produitsExistants.length; i++) {
      const produit = produitsExistants[i]
      const nouveau = products[i]

      produit.nom = nouveau.nom
      produit.description = nouveau.description
      produit.prix = nouveau.prix
      produit.categorie = 'Soins personnels'

      await produit.save()

      console.log(`✓ ${produit.nom}`)
    }

    console.log('')
    console.log('10 produits Soins personnels mis à jour')
    console.log('Aucun autre produit modifié')
    console.log('Seed terminé')
  } catch (error) {
    console.error('Erreur seed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()