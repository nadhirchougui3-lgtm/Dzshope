import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

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

const taillesVetements = ['XS','S','M','L','XL','XXL','XXXL']
const taillesChaussures = ['36','37','38','39','40','41','42','43','44','45']

const aliases = {
  'Vêtements': ['mens-shirts','tops','mens-shoes'],
  'Chaussures': ['mens-shoes','womens-shoes'],
  'Sacs': ['mens-shirts','womens-bags'],
  'Montres': ['mens-watches','womens-watches'],
  'Téléphones': ['smartphones'],
  'Audio': ['mobile-accessories'],
  'Ordinateurs': ['laptops'],
  'Gaming': ['laptops','mobile-accessories'],
  'Soins personnels': ['beauty','skin-care','fragrances'],
  'Accessoires': ['mens-watches','womens-watches','sunglasses'],
  'Sport': ['sports-accessories'],
  'Maquillage': ['beauty','skin-care']
}

const mots = {
  'Vêtements': ['shirt','t-shirt','polo','top','hoodie','sweatshirt','jacket','coat','dress'],
  'Chaussures': ['shoe','shoes','sneaker','boot','moccasin','footwear'],
  'Sacs': ['bag','backpack','handbag','purse'],
  'Montres': ['watch','watches'],
  'Téléphones': ['phone','smartphone','iphone','galaxy','pixel','redmi'],
  'Audio': ['earbuds','earphones','headphones','headset','airpods'],
  'Ordinateurs': ['laptop','notebook','computer','macbook','chromebook'],
  'Gaming': ['gaming','controller','keyboard','mouse','webcam','microphone'],
  'Soins personnels': ['trimmer','shaver','dryer','brush','mirror','manicure','toothbrush','massager','skin'],
  'Accessoires': ['wallet','belt','sunglasses','cap','card','umbrella','keychain'],
  'Sport': ['football','basketball','fitness','jump','yoga','bottle','dumbbell','resistance','knee'],
  'Maquillage': ['makeup','foundation','mascara','lipstick','eyeshadow','eyeliner','blush','powder','concealer','highlighter']
}

function normaliser(texte = '') {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function tokens(texte = '') {
  return normaliser(texte)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function scoreProduit(source, categorie, nom) {
  const texte = normaliser(
    `${source.title || ''} ${source.description || ''} ${source.category || ''}`
  )

  const motsCategorie = mots[categorie] || []
  const aliasCategorie = aliases[categorie] || []

  let score = 0

  for (const mot of motsCategorie) {
    if (texte.includes(normaliser(mot))) {
      score += 20
    }
  }

  if (aliasCategorie.includes(source.category)) {
    score += 50
  }

  const nomTokens = tokens(nom)

  for (const token of nomTokens) {
    if (token.length > 2 && texte.includes(token)) {
      score += 5
    }
  }

  if (Array.isArray(source.images) && source.images.length > 0) {
    score += 10
  }

  return score
}

async function recupererProduits() {
  const response = await fetch('https://dummyjson.com/products?limit=0')

  if (!response.ok) {
    throw new Error(`DummyJSON error: ${response.status}`)
  }

  const data = await response.json()

  return (data.products || []).filter(
    produit =>
      produit &&
      Array.isArray(produit.images) &&
      produit.images.length > 0 &&
      typeof produit.images[0] === 'string' &&
      produit.images[0].startsWith('http')
  )
}

function choisirProduit(produits, categorie, nom, utilises) {
  const candidats = produits
    .filter(produit => !utilises.has(produit.id))
    .map(produit => ({
      produit,
      score: scoreProduit(produit, categorie, nom)
    }))
    .sort((a, b) => b.score - a.score)

  if (!candidats.length) {
    return null
  }

  return candidats[0].produit
}

function creerDescription(nom, categorie, source) {
  const descriptionSource = source?.description || ''

  return descriptionSource.trim()
    ? descriptionSource
    : `${nom} de qualité avec un design moderne et une finition soignée.`
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté')

    const sources = await recupererProduits()

    console.log(`${sources.length} produits DummyJSON disponibles`)

    await Product.deleteMany({})

    const utilises = new Set()
    const produits = []

    for (const [categorie, noms] of Object.entries(categories)) {
      for (let i = 0; i < noms.length; i++) {
        const ancienNom = noms[i]

        const source = choisirProduit(
          sources,
          categorie,
          ancienNom,
          utilises
        )

        if (!source) {
          throw new Error(
            `Impossible de trouver une image pour ${ancienNom}`
          )
        }

        utilises.add(source.id)

        let tailles = []

        if (categorie === 'Vêtements') {
          tailles = taillesVetements
        }

        if (categorie === 'Chaussures') {
          tailles = taillesChaussures
        }

        produits.push({
          nom: ancienNom,
          description: creerDescription(
            ancienNom,
            categorie,
            source
          ),
          prix: prix[categorie][i],
          categorie,
          stock: Math.floor(Math.random() * 46) + 5,
          image: source.images[0],
          couleurs: [],
          tailles
        })
      }
    }

    await Product.insertMany(produits)

    console.log(`${produits.length} produits ajoutés`)
    console.log(`${Object.keys(categories).length} catégories créées`)
    console.log(`${utilises.size} images uniques utilisées`)
    console.log('Seed terminé')
  } catch (error) {
    console.error('Erreur seed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()