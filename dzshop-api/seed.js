import mongoose from 'mongoose'
import 'dotenv/config'
import Product from './models/Product.js'

const categories = {
  'Vêtements': ['T-shirt Blanc','T-shirt Noir','Polo Bleu Marine','Chemise Blanche','Chemise Noire','Sweat Gris','Sweat Noir','Veste Denim','Veste Noire','Pull Beige'],
  'Chaussures': ['Sneakers Blanc','Sneakers Noir','Sneakers Gris','Running Bleu','Running Noir','Chaussures Casual Beige','Chaussures Classiques Marron','Baskets Montantes Noir','Chaussures Sport Blanc','Mocassins Noir'],
  'Sacs': ['Sac à Dos Noir','Sac à Dos Gris','Sac à Dos Bleu','Sac à Dos Sport','Sac à Dos Ordinateur','Sac Bandoulière Noir','Sac Bandoulière Marron','Sac de Voyage Noir','Sac de Sport','Sacoche Élégante'],
  'Montres': ['Montre Classique Noir','Montre Classique Marron','Montre Acier Argent','Montre Acier Noir','Montre Minimaliste','Montre Sport','Montre Casual','Montre Chronographe','Montre Élégante','Montre Premium'],
  'Téléphones': ['Samsung Galaxy A15','Samsung Galaxy A25','Samsung Galaxy A35','Samsung Galaxy S24','iPhone 13','iPhone 14','iPhone 15','Xiaomi Redmi Note 13','Xiaomi Redmi Note 13 Pro','Google Pixel 8'],
  'Audio': ['Écouteurs Bluetooth Blanc','Écouteurs Bluetooth Noir','Écouteurs TWS Pro','Écouteurs TWS Lite','Écouteurs Sport','Casque Bluetooth Noir','Casque Bluetooth Blanc','Casque Gaming','Casque Studio','Casque ANC'],
  'Ordinateurs': ['Laptop Lenovo IdeaPad','Laptop HP Pavilion','Laptop Dell Inspiron','Laptop Asus VivoBook','Laptop Acer Aspire','MacBook Air','MacBook Pro','PC Portable Gaming','Mini PC','Chromebook'],
  'Gaming': ['Manette Sans Fil','Clavier Gaming','Souris Gaming','Tapis Gaming XXL','Micro Gaming','Webcam Gaming','Support Casque Gaming','Manette PC USB','Volant Gaming','Chaise Gaming'],
  'Soins personnels': ['Tondeuse Barbe','Tondeuse Cheveux','Rasoir Électrique','Sèche-Cheveux','Brosse Électrique','Miroir LED','Kit Manucure','Brosse à Dents Électrique','Masseur Portable','Kit de Soin Visage'],
  'Accessoires': ['Portefeuille Noir','Portefeuille Marron','Ceinture Noire','Ceinture Marron','Lunettes de Soleil','Casquette Noire','Casquette Blanche','Porte-cartes','Parapluie Compact','Porte-clés'],
  'Sport': ['Ballon de Football','Ballon de Basketball','Gants de Fitness','Corde à Sauter','Tapis de Yoga','Bouteille Sport','Sac de Sport','Élastiques de Musculation','Haltères','Genouillères Sport'],
  'Maquillage': ['Fond de Teint','Mascara Noir','Rouge à Lèvres Rouge','Rouge à Lèvres Nude','Palette de Fards','Eyeliner Noir','Blush Rose','Poudre Compacte','Correcteur','Highlighter']
}

const prix = {
  'Vêtements': [2500,2500,4500,4000,4500,5500,6000,7500,7000,5000],
  'Chaussures': [7500,8000,7000,9000,9500,6500,12000,10500,8500,9000],
  'Sacs': [4500,4500,5000,5500,7500,4000,4500,8500,6500,7000],
  'Montres': [6000,6500,12000,14000,7500,8500,7000,18000,15000,25000],
  'Téléphones': [35000,48000,58000,115000,65000,85000,115000,42000,55000,90000],
  'Audio': [2500,2500,4500,3000,5000,7500,7500,11000,14000,18000],
  'Ordinateurs': [65000,85000,90000,80000,70000,150000,230000,180000,65000,55000],
  'Gaming': [6500,9000,5000,4500,8500,7500,3500,2500,35000,75000],
  'Soins personnels': [5500,5000,6500,6500,4500,5000,3000,5500,4500,7000],
  'Accessoires': [2500,2500,2000,2000,3500,2000,2000,1800,2500,1000],
  'Sport': [3500,4000,2500,1500,3500,2000,5500,3000,6500,2500],
  'Maquillage': [2500,1800,2000,2000,4500,1800,2000,2500,2200,3000]
}

const couleurs = [
  { nom: 'Noir', image: '' },
  { nom: 'Blanc', image: '' },
  { nom: 'Gris', image: '' }
]

function nettoyerRecherche(nom) {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

async function rechercherImage(nom, categorie) {
  const recherche = `${nettoyerRecherche(nom)} ${categorie} product`

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(recherche)}&orientation=square&size=large&per_page=10`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      }
    }
  )

  if (!response.ok) {
    throw new Error(`Erreur Pexels: ${response.status}`)
  }

  const data = await response.json()

  if (!data.photos.length) {
    return ''
  }

  return data.photos[0].src.large
}

async function attendre(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connecté')

    await Product.deleteMany({})

    const produits = []

    for (const [categorie, noms] of Object.entries(categories)) {
      for (let index = 0; index < noms.length; index++) {
        const nom = noms[index]

        console.log(`Recherche image: ${nom}`)

        const image = await rechercherImage(nom, categorie)

        produits.push({
          nom,
          description: `${nom} de qualité, idéal pour un usage quotidien.`,
          prix: prix[categorie][index],
          categorie,
          stock: 10 + index,
          image,
          couleurs
        })

        await attendre(300)
      }
    }

    await Product.insertMany(produits)

    console.log(`${produits.length} produits ajoutés`)
    console.log(`${Object.keys(categories).length} catégories créées`)
    console.log('Images ajoutées')

    await mongoose.disconnect()

    console.log('Seed terminé')
  } catch (error) {
    console.error('Erreur:', error)
    process.exit(1)
  }
}

seed()