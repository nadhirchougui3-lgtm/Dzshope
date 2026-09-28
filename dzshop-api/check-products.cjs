require('dotenv').config()

const mongoose = require('mongoose')
const ProductModule = require('./models/Product.js')

const Product = ProductModule.default || ProductModule

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    const produitsChaussures = [
      {
        nom: 'Nike Air Jordan 1 Retro High OG',
        description: 'Sneakers iconiques Nike Air Jordan 1 Retro High OG avec design premium et finition élégante.',
        prix: 38000
      },
      {
        nom: 'Adidas Ultraboost 5',
        description: 'Chaussures Adidas Ultraboost 5 premium conçues pour offrir confort, amorti et performance.',
        prix: 32000
      },
      {
        nom: 'New Balance 990v6 Made in USA',
        description: 'New Balance 990v6 Made in USA avec construction premium, confort exceptionnel et style intemporel.',
        prix: 45000
      },
      {
        nom: 'ASICS GEL-KAYANO 32',
        description: 'ASICS GEL-KAYANO 32 avec amorti avancé et maintien confortable pour les longues journées.',
        prix: 30000
      },
      {
        nom: 'Salomon XT-6 GORE-TEX',
        description: 'Salomon XT-6 GORE-TEX avec construction résistante et protection adaptée aux conditions difficiles.',
        prix: 38000
      },
      {
        nom: 'On Cloudmonster 2',
        description: 'On Cloudmonster 2 avec amorti CloudTec avancé, confort premium et silhouette moderne.',
        prix: 35000
      },
      {
        nom: 'HOKA Bondi 9',
        description: 'HOKA Bondi 9 avec semelle très amortissante, confort premium et design moderne.',
        prix: 32000
      },
      {
        nom: 'Puma MB.04',
        description: 'Puma MB.04 avec design basketball premium, excellente adhérence et maintien dynamique.',
        prix: 28000
      },
      {
        nom: 'Adidas Samba OG',
        description: 'Adidas Samba OG avec silhouette iconique, finition élégante et style rétro intemporel.',
        prix: 24000
      },
      {
        nom: 'New Balance 2002R',
        description: 'New Balance 2002R avec design premium, confort quotidien et silhouette moderne emblématique.',
        prix: 30000
      }
    ]

    const taillesChaussures = [
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45'
    ]

    const chaussures = await Product.find({
      categorie: 'Chaussures'
    }).sort({ _id: 1 })

    if (chaussures.length !== 10) {
      throw new Error(`Nombre de produits Chaussures trouvé: ${chaussures.length}. Attendu: 10.`)
    }

    for (let i = 0; i < chaussures.length; i++) {
      await Product.updateOne(
        { _id: chaussures[i]._id },
        {
          $set: {
            nom: produitsChaussures[i].nom,
            description: produitsChaussures[i].description,
            prix: produitsChaussures[i].prix,
            categorie: 'Chaussures',
            tailles: taillesChaussures
          }
        }
      )
    }

    console.log('10 produits Chaussures mis à jour avec succès')
    console.log('Cosmetics et les autres catégories non modifiés')
  } catch (error) {
    console.error('Erreur :', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

run()