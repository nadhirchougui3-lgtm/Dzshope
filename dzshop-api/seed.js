import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'

const products = [
  {
    nom: 'Huda Beauty Easy Bake Loose Baking & Setting Powder',
    description: 'Poudre libre professionnelle Huda Beauty pour fixer le maquillage et obtenir un fini lisse et longue tenue.',
    prix: 9500,
    image: '/images/products/makeup/huda-beauty-easy-bake.jpg'
  },
  {
    nom: 'Huda Beauty #FauxFilter Luminous Matte Foundation',
    description: 'Fond de teint haute couvrance Huda Beauty offrant un fini mat lumineux et une tenue longue durée.',
    prix: 12500,
    image: '/images/products/makeup/huda-beauty-fauxfilter-foundation.jpg'
  },
  {
    nom: 'Charlotte Tilbury Airbrush Flawless Foundation',
    description: 'Fond de teint iconique Charlotte Tilbury avec une couvrance modulable et un fini impeccable.',
    prix: 14500,
    image: '/images/products/makeup/charlotte-tilbury-airbrush-flawless-foundation.jpg'
  },
  {
    nom: 'Charlotte Tilbury Pillow Talk Lipstick',
    description: 'Rouge à lèvres iconique Charlotte Tilbury dans la teinte Pillow Talk, avec une finition élégante et confortable.',
    prix: 10500,
    image: '/images/products/makeup/charlotte-tilbury-pillow-talk.jpg'
  },
  {
    nom: 'MAC Studio Fix Fluid SPF 15 Foundation',
    description: 'Fond de teint professionnel MAC offrant une couvrance modulable, un fini naturel et une longue tenue.',
    prix: 9500,
    image: '/images/products/makeup/mac-studio-fix-fluid.jpg'
  },
  {
    nom: 'MAC M·A·Cximal Silky Matte Lipstick',
    description: 'Rouge à lèvres professionnel MAC avec une texture crémeuse et un fini mat longue tenue.',
    prix: 7500,
    image: '/images/products/makeup/mac-maximal-silky-matte.jpg'
  },
  {
    nom: 'Rare Beauty Soft Pinch Liquid Blush',
    description: 'Blush liquide Rare Beauty hautement pigmenté avec une texture légère et facile à estomper.',
    prix: 8500,
    image: '/images/products/makeup/rare-beauty-soft-pinch.jpg'
  },
  {
    nom: 'NARS Light Reflecting Foundation',
    description: 'Fond de teint NARS à la couvrance modulable avec un fini naturel lumineux et sophistiqué.',
    prix: 13500,
    image: '/images/products/makeup/nars-light-reflecting-foundation.jpg'
  },
  {
    nom: 'Dior Addict Lip Glow',
    description: 'Baume à lèvres iconique Dior qui sublime naturellement la couleur des lèvres avec une finition brillante.',
    prix: 11000,
    image: '/images/products/makeup/dior-addict-lip-glow.jpg'
  },
  {
    nom: 'YSL Rouge Pur Couture The Slim',
    description: 'Rouge à lèvres YSL luxueux avec une texture confortable et une couleur intense au fini sophistiqué.',
    prix: 12500,
    image: '/images/products/makeup/ysl-rouge-pur-couture-the-slim.jpg'
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')

    const produitsExistants = await Product.find({
      categorie: 'Maquillage'
    }).sort({ _id: 1 })

    console.log(
      `${produitsExistants.length} produits Maquillage trouvés`
    )

    if (produitsExistants.length !== 10) {
      throw new Error(
        `Nombre inattendu : ${produitsExistants.length}. Le seed attend exactement 10 produits Maquillage.`
      )
    }

    for (let i = 0; i < produitsExistants.length; i++) {
      const produit = produitsExistants[i]
      const nouveau = products[i]

      produit.nom = nouveau.nom
      produit.description = nouveau.description
      produit.prix = nouveau.prix
      produit.image = nouveau.image
      produit.categorie = 'Maquillage'

      await produit.save()

      console.log(`✓ ${produit.nom}`)
    }

    console.log('')
    console.log('10 produits Maquillage mis à jour')
    console.log('Aucun autre produit modifié')
    console.log('Seed terminé')
  } catch (error) {
    console.error('Erreur seed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()