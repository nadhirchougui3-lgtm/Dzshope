require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./models/Product')

const categories = [
  {
    categorie: 'Vêtements',
    items: [
      ['Levi\'s 501 Original Jeans', 'Jean homme classique coupe droite Levi\'s 501.', 14500],
      ['Levi\'s 511 Slim Jeans', 'Jean homme coupe slim Levi\'s 511.', 13500],
      ['Nike Sportswear Club T-Shirt', 'T-shirt homme Nike en coton.', 6500],
      ['Adidas Essentials T-Shirt', 'T-shirt homme Adidas coupe classique.', 5800],
      ['Puma Essentials Logo T-Shirt', 'T-shirt homme Puma avec logo.', 5200],
      ['Lacoste Classic Polo Shirt', 'Polo homme classique Lacoste.', 18500],
      ['Tommy Hilfiger Oxford Shirt', 'Chemise homme Oxford Tommy Hilfiger.', 16500],
      ['Hugo Boss Slim Fit Shirt', 'Chemise homme coupe slim Hugo Boss.', 22000],
      ['Nike Tech Fleece Hoodie', 'Sweat à capuche homme Nike Tech Fleece.', 18500],
      ['Adidas Essentials Hoodie', 'Sweat à capuche homme Adidas.', 12500],
      ['Puma Essentials Hoodie', 'Sweat à capuche homme Puma.', 11000],
      ['The North Face Full Zip Hoodie', 'Sweat zippé homme The North Face.', 19500],
      ['Nike Sportswear Jogger', 'Pantalon jogging homme Nike.', 12500],
      ['Adidas Tiro 24 Pants', 'Pantalon de sport homme Adidas Tiro.', 10500],
      ['Levi\'s 502 Taper Jeans', 'Jean homme Levi\'s 502 coupe fuselée.', 14000],
      ['Jack & Jones Chino Pants', 'Pantalon chino homme Jack & Jones.', 9500],
      ['Nike Dri-FIT Shorts', 'Short de sport homme Nike Dri-FIT.', 7800],
      ['Adidas Own The Run Shorts', 'Short de running homme Adidas.', 7200],
      ['The North Face Quest Jacket', 'Veste homme The North Face résistante aux intempéries.', 23500],
      ['Columbia Watertight II Jacket', 'Veste imperméable homme Columbia.', 21000]
    ]
  },
  {
    categorie: 'Chaussures',
    items: [
      ['Nike Air Force 1 Low', 'Sneakers Nike Air Force 1 Low.', 24000],
      ['Nike Air Max 270', 'Sneakers Nike Air Max 270.', 28500],
      ['Adidas Ultraboost Light', 'Chaussures de running Adidas Ultraboost.', 32000],
      ['Adidas Samba OG', 'Sneakers Adidas Samba OG.', 23000],
      ['Puma Suede Classic', 'Sneakers Puma Suede Classic.', 17500],
      ['New Balance 574', 'Sneakers lifestyle New Balance 574.', 22000],
      ['New Balance 530', 'Sneakers lifestyle New Balance 530.', 25000],
      ['Vans Old Skool', 'Sneakers Vans Old Skool.', 18500],
      ['Converse Chuck Taylor All Star', 'Sneakers Converse Chuck Taylor All Star.', 16000],
      ['Timberland 6-Inch Premium Boot', 'Bottes homme Timberland Premium.', 39000]
    ]
  },
  {
    categorie: 'Sacs',
    items: [
      ['Herschel Classic Backpack', 'Sac à dos Herschel classique.', 11500],
      ['Nike Heritage Backpack', 'Sac à dos Nike Heritage.', 8500],
      ['Adidas Linear Backpack', 'Sac à dos Adidas Linear.', 7500],
      ['Eastpak Padded Pak\'r', 'Sac à dos Eastpak Padded Pak\'r.', 10500],
      ['Samsonite Laptop Backpack', 'Sac à dos Samsonite pour ordinateur portable.', 22000],
      ['Tommy Hilfiger Shoulder Bag', 'Sac bandoulière Tommy Hilfiger.', 18000],
      ['Calvin Klein Crossbody Bag', 'Sac crossbody Calvin Klein.', 17500],
      ['Michael Kors Jet Set Bag', 'Sac à main Michael Kors Jet Set.', 42000],
      ['The North Face Base Camp Duffel', 'Sac de voyage The North Face Base Camp.', 28000],
      ['Adidas Essentials Sports Bag', 'Sac de sport Adidas Essentials.', 9000]
    ]
  },
  {
    categorie: 'Montres',
    items: [
      ['Casio G-Shock GA-2100', 'Montre homme Casio G-Shock GA-2100.', 24000],
      ['Casio Edifice EFV-100', 'Montre homme Casio Edifice.', 18500],
      ['Seiko 5 Sports', 'Montre automatique homme Seiko 5 Sports.', 52000],
      ['Citizen Eco-Drive', 'Montre homme Citizen Eco-Drive.', 48000],
      ['Fossil Grant Chronograph', 'Montre homme Fossil Grant Chronograph.', 32000],
      ['Tissot PRX Quartz', 'Montre homme Tissot PRX Quartz.', 78000],
      ['Tissot Seastar 1000', 'Montre homme Tissot Seastar 1000.', 92000],
      ['Daniel Wellington Classic', 'Montre minimaliste Daniel Wellington.', 26000],
      ['Swatch Gent', 'Montre Swatch classique.', 19000],
      ['Orient Bambino', 'Montre automatique Orient Bambino.', 55000]
    ]
  },
  {
    categorie: 'Téléphones',
    items: [
      ['Apple iPhone 15', 'Smartphone Apple iPhone 15.', 119000],
      ['Apple iPhone 15 Pro', 'Smartphone Apple iPhone 15 Pro.', 169000],
      ['Samsung Galaxy S24', 'Smartphone Samsung Galaxy S24.', 125000],
      ['Samsung Galaxy S24 Ultra', 'Smartphone Samsung Galaxy S24 Ultra.', 185000],
      ['Samsung Galaxy A55 5G', 'Smartphone Samsung Galaxy A55 5G.', 65000],
      ['Xiaomi Redmi Note 13 Pro', 'Smartphone Xiaomi Redmi Note 13 Pro.', 52000],
      ['Xiaomi 14', 'Smartphone Xiaomi 14.', 105000],
      ['Google Pixel 8', 'Smartphone Google Pixel 8.', 95000],
      ['OnePlus 12', 'Smartphone OnePlus 12.', 120000],
      ['Honor 200', 'Smartphone Honor 200.', 68000]
    ]
  },
  {
    categorie: 'Audio',
    items: [
      ['Apple AirPods Pro 2', 'Écouteurs sans fil Apple AirPods Pro 2.', 42000],
      ['Apple AirPods 3', 'Écouteurs sans fil Apple AirPods 3.', 30000],
      ['Sony WH-1000XM5', 'Casque sans fil Sony WH-1000XM5.', 58000],
      ['Sony WF-1000XM5', 'Écouteurs sans fil Sony WF-1000XM5.', 48000],
      ['JBL Tune 770NC', 'Casque Bluetooth JBL avec réduction de bruit.', 22000],
      ['JBL Live Pro 2', 'Écouteurs Bluetooth JBL Live Pro 2.', 27000],
      ['Bose QuietComfort', 'Casque sans fil Bose QuietComfort.', 55000],
      ['Anker Soundcore Q45', 'Casque Bluetooth Soundcore Space Q45.', 30000],
      ['Marshall Major IV', 'Casque Bluetooth Marshall Major IV.', 32000],
      ['JBL Flip 6', 'Enceinte Bluetooth portable JBL Flip 6.', 26000]
    ]
  },
  {
    categorie: 'Ordinateurs',
    items: [
      ['MacBook Air M3 13"', 'Ordinateur portable Apple MacBook Air avec puce M3.', 215000],
      ['MacBook Pro M3 14"', 'Ordinateur portable professionnel Apple MacBook Pro.', 325000],
      ['Dell XPS 13', 'Ultrabook Dell XPS 13.', 210000],
      ['Dell Inspiron 15', 'Ordinateur portable Dell Inspiron 15.', 115000],
      ['HP Pavilion 15', 'Ordinateur portable HP Pavilion 15.', 105000],
      ['HP Envy x360', 'Ordinateur portable convertible HP Envy x360.', 165000],
      ['Lenovo IdeaPad 5', 'Ordinateur portable Lenovo IdeaPad 5.', 115000],
      ['Lenovo ThinkPad E14', 'Ordinateur portable professionnel Lenovo ThinkPad E14.', 145000],
      ['ASUS Zenbook 14', 'Ultrabook ASUS Zenbook 14.', 185000],
      ['Acer Aspire 5', 'Ordinateur portable Acer Aspire 5.', 98000]
    ]
  },
  {
    categorie: 'Gaming',
    items: [
      ['PlayStation 5 Slim', 'Console Sony PlayStation 5 Slim.', 115000],
      ['Xbox Series X', 'Console Microsoft Xbox Series X.', 105000],
      ['Nintendo Switch OLED', 'Console Nintendo Switch OLED.', 78000],
      ['Logitech G Pro X Superlight 2', 'Souris gaming sans fil Logitech.', 32000],
      ['Razer DeathAdder V3 Pro', 'Souris gaming Razer sans fil.', 36000],
      ['Logitech G915 TKL', 'Clavier gaming mécanique sans fil Logitech.', 42000],
      ['Razer BlackWidow V4', 'Clavier gaming mécanique Razer.', 35000],
      ['SteelSeries Arctis Nova 7', 'Casque gaming sans fil SteelSeries.', 42000],
      ['ASUS TUF Gaming Monitor 27"', 'Écran gaming ASUS TUF 27 pouces.', 62000],
      ['Logitech G29 Driving Force', 'Volant gaming Logitech G29.', 65000]
    ]
  },
  {
    categorie: 'Soins personnels',
    items: [
      ['CeraVe Hydrating Cleanser 236ml', 'Nettoyant visage hydratant CeraVe pour peau normale à sèche.', 3200],
      ['CeraVe Moisturizing Cream 340g', 'Crème hydratante CeraVe pour le visage et le corps.', 4300],
      ['NIVEA MEN Sensitive Face Wash 100ml', 'Gel nettoyant visage NIVEA MEN pour peau sensible.', 2200],
      ['Dove Deeply Nourishing Body Wash 550ml', 'Gel douche Dove hydratant pour le corps.', 1800],
      ['The Ordinary Niacinamide 10% + Zinc 1% 30ml', 'Sérum The Ordinary pour les soins quotidiens de la peau.', 2900],
      ['Neutrogena Hydro Boost Aqua-Gel 50ml', 'Gel hydratant visage Neutrogena Hydro Boost.', 2500],
      ['L\'Oréal Paris Elvive Dream Long Shampoo 250ml', 'Shampooing L’Oréal Paris Elvive Dream Long.', 1200],
      ['NIVEA Soft Moisturizing Cream 200ml', 'Crème hydratante légère NIVEA Soft.', 1100],
      ['Dove Original Deodorant 150ml', 'Déodorant Dove Original pour usage quotidien.', 1500],
      ['Neutrogena Norwegian Formula Hand Cream 56g', 'Crème mains concentrée Neutrogena Norwegian Formula.', 1000]
    ]
  },
  {
    categorie: 'Accessoires',
    items: [
      ['Apple MagSafe Charger', 'Chargeur sans fil Apple MagSafe.', 12000],
      ['Apple USB-C to Lightning Cable', 'Câble Apple USB-C vers Lightning.', 7500],
      ['Samsung 25W USB-C Charger', 'Chargeur secteur Samsung 25W USB-C.', 6500],
      ['Anker 65W GaN Charger', 'Chargeur rapide Anker 65W GaN.', 11000],
      ['Belkin 3-in-1 Wireless Charger', 'Station de charge sans fil Belkin 3-en-1.', 26000],
      ['Spigen Ultra Hybrid Case', 'Coque transparente Spigen Ultra Hybrid.', 5500],
      ['OtterBox Defender Case', 'Coque renforcée OtterBox Defender.', 8500],
      ['Apple AirTag', 'Localisateur Apple AirTag.', 12500],
      ['SanDisk Ultra 128GB', 'Carte mémoire microSD SanDisk Ultra 128 Go.', 4500],
      ['Kingston DataTraveler 128GB', 'Clé USB Kingston DataTraveler 128 Go.', 4200]
    ]
  },
  {
    categorie: 'Sport',
    items: [
      ['Nike Academy Football', 'Ballon de football Nike Academy.', 6500],
      ['Adidas UCL League Ball', 'Ballon de football Adidas UCL League.', 7500],
      ['Nike Dri-FIT Training Shirt', 'T-shirt de sport Nike Dri-FIT.', 6500],
      ['Adidas Training Shorts', 'Short de sport Adidas.', 5500],
      ['Puma Training Tracksuit', 'Ensemble de survêtement Puma.', 12500],
      ['Nike Revolution 7', 'Chaussures de running Nike Revolution 7.', 15500],
      ['Adidas Duramo SL', 'Chaussures de running Adidas Duramo SL.', 14500],
      ['Decathlon Domyos Yoga Mat', 'Tapis de yoga Domyos.', 4500],
      ['Everlast Boxing Gloves', 'Gants de boxe Everlast.', 8500],
      ['Garmin Forerunner 55', 'Montre GPS de course Garmin Forerunner 55.', 42000]
    ]
  },
  {
    categorie: 'Maquillage',
    items: [
      ['Maybelline Fit Me Foundation', 'Fond de teint Maybelline Fit Me.', 2600],
      ['L\'Oréal Paris Telescopic Mascara', 'Mascara L’Oréal Paris Telescopic.', 2400],
      ['NYX Professional Makeup Lip Lingerie', 'Rouge à lèvres liquide NYX Lip Lingerie.', 2800],
      ['MAC Studio Fix Powder', 'Poudre compacte MAC Studio Fix.', 6200],
      ['e.l.f. Hydrating Camo Concealer', 'Correcteur hydratant e.l.f. Camo.', 2200],
      ['Maybelline Lash Sensational Mascara', 'Mascara Maybelline Lash Sensational.', 2500],
      ['L\'Oréal Paris Infallible Concealer', 'Correcteur L’Oréal Paris Infallible.', 2700],
      ['NYX Professional Makeup Epic Ink Liner', 'Eyeliner liquide NYX Epic Ink.', 2600],
      ['Revlon ColorStay Lipstick', 'Rouge à lèvres Revlon ColorStay.', 2800],
      ['MAC Powder Blush', 'Blush poudre MAC.', 6500]
    ]
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connecté')

    const produitsExistants = await Product.find().sort({ _id: 1 })

    if (produitsExistants.length !== 130) {
      throw new Error(
        `Nombre de produits inattendu : ${produitsExistants.length}. Le seed attend exactement 130 produits.`
      )
    }

    const produitsPrepares = categories.flatMap(function (categorie) {
      return categorie.items.map(function (item) {
        return {
          categorie: categorie.categorie,
          nom: item[0],
          description: item[1],
          prix: item[2]
        }
      })
    })

    if (produitsPrepares.length !== 130) {
      throw new Error(
        `Nombre de produits préparés inattendu : ${produitsPrepares.length}.`
      )
    }

    for (let i = 0; i < produitsExistants.length; i++) {
      const produit = produitsExistants[i]
      const nouveau = produitsPrepares[i]

      produit.nom = nouveau.nom
      produit.description = nouveau.description
      produit.prix = nouveau.prix
      produit.categorie = nouveau.categorie

      await produit.save()
    }

    console.log('130 produits mis à jour')
    console.log('12 catégories conservées')
    console.log('Aucun produit ajouté ou supprimé')
    console.log('Seed terminé')
  } catch (error) {
    console.error('Erreur seed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()