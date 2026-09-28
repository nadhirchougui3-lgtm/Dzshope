import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'

const categories = {
  'Vêtements': [
    'Nike Tech Fleece Full-Zip Hoodie',
    'Adidas Essentials Hoodie',
    'Polo Ralph Lauren Classic Polo Shirt',
    'Lacoste Classic Fit Polo',
    'Tommy Hilfiger Essential T-Shirt',
    'Hugo Boss Regular Fit T-Shirt',
    'Armani Exchange Logo T-Shirt',
    'Calvin Klein Cotton Stretch T-Shirt',
    'Levi’s 501 Original Jeans',
    'Levi’s 511 Slim Jeans',
    'Diesel D-Strukt Jeans',
    'G-Star RAW 3301 Jeans',
    'Nike Sportswear Club Fleece Pants',
    'Adidas Adicolor Classics Track Pants',
    'Puma Essentials Sweatpants',
    'Under Armour Rival Fleece Joggers',
    'Nike Academy Dri-FIT Tracksuit',
    'Adidas Tiro 24 Training Jacket',
    'Puma BMW Motorsport Jacket',
    'The North Face 1996 Nuptse Jacket',
    'Columbia Powder Lite Jacket',
    'Jack & Jones Premium Wool Coat',
    'Hugo Boss Slim Fit Blazer',
    'Zara Relaxed Fit Overshirt',
    'Massimo Dutti Linen Shirt',
    'Ralph Lauren Oxford Shirt',
    'Lacoste Long Sleeve Shirt',
    'Tommy Hilfiger Oxford Shirt',
    'Uniqlo Premium Linen Shirt',
    'Carhartt WIP Detroit Jacket',
    'Levi’s Sherpa Trucker Jacket',
    'Dickies Eisenhower Jacket',
    'Nike Windrunner Jacket',
    'Adidas Originals Track Jacket',
    'Puma Essentials Jacket',
    'The North Face Mountain Jacket',
    'Patagonia Better Sweater',
    'Nike Dri-FIT Training Top',
    'Adidas Own The Run T-Shirt',
    'Under Armour Tech 2.0 T-Shirt'
  ],

  'Chaussures': [
    'Nike Air Force 1 Low',
    'Nike Air Max 1',
    'Nike Air Max 90',
    'Nike Air Max 270',
    'Nike Dunk Low',
    'Nike Air Jordan 1 Low',
    'Adidas Samba OG',
    'Adidas Gazelle Indoor',
    'Adidas Campus 00s',
    'Adidas Ultraboost Light',
    'Adidas Superstar',
    'New Balance 550',
    'New Balance 574',
    'New Balance 9060',
    'New Balance 2002R',
    'ASICS GEL-Kayano 30',
    'ASICS GEL-Nimbus 26',
    'Puma Suede Classic',
    'Puma RS-X',
    'Vans Old Skool'
  ],

  'Sacs': [
    'Louis Vuitton Keepall Bandoulière',
    'Louis Vuitton Discovery Backpack',
    'Gucci GG Supreme Backpack',
    'Gucci Ophidia Messenger Bag',
    'Prada Re-Nylon Backpack',
    'Prada Re-Nylon Shoulder Bag',
    'Saint Laurent City Backpack',
    'Burberry Check Backpack',
    'Montblanc Sartorial Backpack',
    'Tumi Alpha Bravo Backpack',
    'Samsonite Pro-DLX Backpack',
    'Herschel Little America Backpack',
    'The North Face Borealis Backpack',
    'Eastpak Provider Backpack',
    'Nike Heritage Backpack',
    'Adidas Classic Backpack',
    'Puma Deck Backpack',
    'Carhartt Kickflip Backpack',
    'Fjallraven Kanken Backpack',
    'Patagonia Refugio Backpack'
  ],

  'Montres': [
    'Rolex Submariner Date',
    'Rolex Datejust 41',
    'Omega Speedmaster Professional',
    'Omega Seamaster Diver 300M',
    'TAG Heuer Carrera Chronograph',
    'TAG Heuer Aquaracer',
    'Cartier Santos de Cartier',
    'Cartier Tank Must',
    'Tissot PRX Powermatic 80',
    'Tissot Gentleman Powermatic 80',
    'Seiko Prospex Diver',
    'Seiko Presage Cocktail Time',
    'Casio G-Shock GA-2100',
    'Casio G-Shock Mudmaster',
    'Citizen Tsuyosa',
    'Citizen Promaster Diver',
    'Hamilton Khaki Field',
    'Longines HydroConquest',
    'Orient Bambino',
    'Swatch Sistem51'
  ],

  'Téléphones': [
    'Apple iPhone 17 Pro Max',
    'Apple iPhone 17 Pro',
    'Apple iPhone 17',
    'Apple iPhone 16 Pro Max',
    'Samsung Galaxy S26 Ultra',
    'Samsung Galaxy S26+',
    'Samsung Galaxy S26',
    'Samsung Galaxy Z Fold7',
    'Samsung Galaxy Z Flip7',
    'Google Pixel 10 Pro XL',
    'Google Pixel 10 Pro',
    'Google Pixel 10',
    'OnePlus 13',
    'Xiaomi 15 Ultra',
    'Xiaomi 15 Pro',
    'Xiaomi 15',
    'Sony Xperia 1 VII',
    'ASUS ROG Phone 9 Pro',
    'Nothing Phone 3',
    'Honor Magic7 Pro'
  ],

  'Audio': [
    'Apple AirPods Pro 3',
    'Apple AirPods Max',
    'Sony WH-1000XM6',
    'Sony WF-1000XM5',
    'Bose QuietComfort Ultra Headphones',
    'Bose QuietComfort Ultra Earbuds',
    'Sennheiser Momentum 4 Wireless',
    'Sennheiser Momentum True Wireless 4',
    'JBL Tour One M3',
    'JBL Live Beam 3',
    'JBL Charge 6',
    'JBL Xtreme 4',
    'Marshall Major V',
    'Marshall Monitor III ANC',
    'Marshall Kilburn III',
    'Beats Studio Pro',
    'Beats Fit Pro',
    'Bang & Olufsen Beoplay H100',
    'Sonos Era 300',
    'Sonos Move 2'
  ],

  'Ordinateurs': [
    'Apple MacBook Pro 16 M4 Pro',
    'Apple MacBook Pro 14 M4 Pro',
    'Apple MacBook Air 15 M4',
    'Apple MacBook Air 13 M4',
    'Dell XPS 16',
    'Dell XPS 14',
    'Dell XPS 13',
    'HP Spectre x360 14',
    'HP EliteBook 840 G11',
    'Lenovo ThinkPad X1 Carbon Gen 13',
    'Lenovo Yoga Pro 9i',
    'Lenovo Legion Pro 7i',
    'ASUS ROG Zephyrus G16',
    'ASUS ROG Strix G16',
    'ASUS Zenbook 14 OLED',
    'Acer Swift Go 14',
    'Acer Predator Helios Neo 16',
    'MSI Raider 18 HX',
    'MSI Prestige 16 AI Evo',
    'Microsoft Surface Laptop 7'
  ],

  'Gaming': [
    'PlayStation 5 Pro',
    'Xbox Series X',
    'Nintendo Switch 2',
    'Steam Deck OLED',
    'ASUS ROG Ally X',
    'Lenovo Legion Go',
    'PlayStation DualSense Wireless Controller',
    'Xbox Wireless Controller',
    'Nintendo Switch Pro Controller',
    'Logitech G Pro X Superlight 2',
    'Razer DeathAdder V3 Pro',
    'SteelSeries Arctis Nova Pro Wireless',
    'Logitech G915 X Lightspeed',
    'Razer BlackWidow V4 Pro',
    'Elgato Stream Deck XL',
    'Elgato Game Capture 4K Pro',
    'Alienware 34 Curved Gaming Monitor',
    'Samsung Odyssey OLED G8',
    'ASUS ROG Swift OLED PG27AQDP',
    'BenQ Zowie XL2586X'
  ],

  'Soins personnels': [
    'Augustinus Bader The Body Cream 100ml',
    'La Mer The Body Crème 200ml',
    'Jo Malone London Lime Basil & Mandarin Body Crème 175ml',
    'Aesop Geranium Leaf Body Cleanser 500ml',
    'Le Labo Hinoki Shower Gel 500ml',
    'Kiehl’s Creme de Corps 500ml',
    'Sol de Janeiro Brazilian Bum Bum Cream 240ml',
    'OUAI Body Crème 212ml',
    'Byredo Bal d’Afrique Body Lotion 225ml',
    'Diptyque Do Son Perfumed Body Lotion 200ml',
    'Aesop Resurrection Aromatique Hand Balm',
    'Kiehl’s Ultra Facial Cream',
    'La Mer Crème de la Mer',
    'Augustinus Bader The Rich Cream',
    'Dr. Barbara Sturm Face Cream',
    'SK-II Facial Treatment Essence',
    'La Roche-Posay Cicaplast Baume B5+',
    'CeraVe Moisturising Cream',
    'Clinique Dramatically Different Moisturizing Lotion+',
    'Shiseido Vital Perfection Uplifting Cream'
  ],

  'Accessoires': [
    'Montblanc Meisterstück Wallet',
    'Montblanc Leather Belt',
    'Hugo Boss Leather Belt',
    'Tommy Hilfiger Leather Belt',
    'Lacoste Leather Belt',
    'Ralph Lauren Leather Belt',
    'Ray-Ban Aviator Classic',
    'Ray-Ban Wayfarer Classic',
    'Oakley Holbrook',
    'Persol PO0649',
    'Tom Ford FT5401',
    'Gentle Monster Lang',
    'Swarovski Men’s Bracelet',
    'Tateossian Leather Bracelet',
    'Montblanc Cufflinks',
    'Hugo Boss Cufflinks',
    'Fossil Leather Card Holder',
    'Coach Leather Card Case',
    'Michael Kors Card Holder',
    'S.T. Dupont Money Clip'
  ],

  'Sport': [
    'Nike Air Zoom Pegasus 41',
    'Nike Alphafly 3',
    'Nike Metcon 9',
    'Adidas Adizero Adios Pro 4',
    'Adidas Ultraboost 5',
    'Adidas Dropset 3 Trainer',
    'ASICS Novablast 5',
    'ASICS Metaspeed Sky Paris',
    'Under Armour HOVR Mach 6',
    'Under Armour TriBase Reign 6',
    'Puma Deviate Nitro 3',
    'Puma Fast-R Nitro Elite 3',
    'Wilson Clash 100 V3',
    'Wilson Blade 98 V9',
    'Babolat Pure Aero 98',
    'Head Speed MP 2024',
    'Yonex Ezone 98',
    'Nike Dri-FIT Training Backpack',
    'Adidas Training Duffel Bag',
    'Under Armour Undeniable 5.0 Duffel'
  ],

  'Maquillage': [
    'Charlotte Tilbury Airbrush Flawless Foundation',
    'Charlotte Tilbury Airbrush Flawless Setting Spray',
    'Charlotte Tilbury Pillow Talk Lipstick',
    'Huda Beauty Easy Bake Loose Baking & Setting Powder',
    'Huda Beauty #FauxFilter Foundation',
    'Rare Beauty Soft Pinch Liquid Blush',
    'Rare Beauty Positive Light Highlighter',
    'Fenty Beauty Pro Filt’r Foundation',
    'Fenty Beauty Gloss Bomb',
    'Fenty Beauty Match Stix Contour Skinstick',
    'Dior Backstage Face & Body Foundation',
    'Dior Addict Lip Glow',
    'YSL Rouge Pur Couture',
    'NARS Light Reflecting Foundation',
    'NARS Radiant Creamy Concealer',
    'MAC Studio Fix Fluid',
    'MAC Ruby Woo Lipstick',
    'Estée Lauder Double Wear Foundation',
    'Giorgio Armani Luminous Silk Foundation',
    'Lancôme Teint Idole Ultra Wear'
  ],

  'Maison': [
    'KitchenAid Artisan Stand Mixer',
    'Nespresso Vertuo Creatista',
    'De’Longhi Hot & Cold Coffee Maker',
    'Philips Airfryer XXL',
    'Ninja Foodi DualZone Air Fryer',
    'Dyson V15 Detect',
    'Dyson V12 Detect Slim',
    'Shark Stratos Cordless Vacuum',
    'Bose Home Speaker 500',
    'Sonos Arc Ultra',
    'Le Creuset Signature Dutch Oven',
    'Staub Cocotte Round',
    'Zwilling Pro Knife Set',
    'Wüsthof Classic Chef Knife',
    'Vitamix A3500 Blender',
    'Breville Barista Express',
    'Smeg 50s Style Toaster',
    'Smeg 50s Style Kettle',
    'Philips PerfectCare Iron',
    'Tefal Ingenio Cookware Set'
  ],

  'Camping': [
    'The North Face Wawona 6 Tent',
    'MSR Habitude 4 Tent',
    'Coleman Sundome 4 Tent',
    'Quechua Air Seconds 4.1',
    'Black Diamond Storm 500-R Headlamp',
    'Petzl Actik Core Headlamp',
    'Garmin inReach Mini 2',
    'Garmin GPSMAP 67',
    'Osprey Atmos AG 65',
    'Deuter Aircontact Core 65+10',
    'Salomon Quest 4 GTX',
    'Merrell Moab 3 Mid GTX',
    'Stanley Classic Legendary Bottle',
    'Hydro Flask Wide Mouth',
    'Yeti Rambler 36 oz',
    'Jetboil Flash Cooking System',
    'MSR PocketRocket Deluxe',
    'Therm-a-Rest NeoAir XTherm NXT',
    'Sea to Summit Comfort Plus',
    'Black Diamond Moji Lantern'
  ],

  'Décoration': [
    'Ferm Living Plant Box',
    'Ferm Living Ripple Glasses',
    'Hay About A Chair',
    'Hay Tray Table',
    'Muuto Fiber Chair',
    'Muuto Ambit Pendant Lamp',
    'Kartell Componibili',
    'Kartell Masters Chair',
    'Normann Copenhagen Form Chair',
    'Normann Copenhagen Bell Lamp',
    'Vitra Eames Plastic Chair',
    'Vitra Noguchi Coffee Table',
    'Louis Poulsen PH 5 Pendant',
    'Louis Poulsen AJ Table Lamp',
    'Artemide Tolomeo Lamp',
    'Flos IC Lights',
    'Alessi Juicy Salif',
    'Alessi Anna G Corkscrew',
    'Georg Jensen Candle Holder',
    'Tom Dixon Scent Diffuser'
  ],

  'Art & Création': [
    'Faber-Castell Polychromos Colored Pencils',
    'Faber-Castell Albrecht Dürer Watercolor Pencils',
    'Caran d’Ache Luminance Colored Pencils',
    'Caran d’Ache Pablo Colored Pencils',
    'Copic Sketch Marker Set',
    'Winsor & Newton Professional Watercolor Set',
    'Winsor & Newton Artists’ Oil Colour Set',
    'Liquitex Heavy Body Acrylic Set',
    'Golden Heavy Body Acrylic Set',
    'Sennelier Soft Pastels',
    'Derwent Graphic Pencils',
    'Derwent Lightfast Colored Pencils',
    'Staedtler Mars Lumograph Set',
    'Prismacolor Premier Colored Pencils',
    'Pentel Arts GraphGear 1000',
    'Sakura Pigma Micron Set',
    'Posca Paint Marker Set',
    'Moleskine Art Sketchbook',
    'Canson XL Watercolor Pad',
    'Strathmore 400 Series Sketch Pad'
  ],

  'Lecture': [
    'Atomic Habits — James Clear',
    'The Psychology of Money — Morgan Housel',
    'Deep Work — Cal Newport',
    'The 7 Habits of Highly Effective People',
    'Thinking, Fast and Slow — Daniel Kahneman',
    'The Intelligent Investor — Benjamin Graham',
    'Clean Code — Robert C. Martin',
    'Designing Data-Intensive Applications',
    'The Pragmatic Programmer',
    'Computer Networking: A Top-Down Approach',
    'Operating System Concepts',
    'Introduction to Algorithms',
    'The C Programming Language',
    'You Don’t Know JS Yet',
    'Eloquent JavaScript',
    'The Linux Command Line',
    'Cybersecurity for Beginners',
    'The Web Application Hacker’s Handbook',
    'Python Crash Course',
    'Automate the Boring Stuff with Python'
  ],

  'Bureau': [
    'Logitech MX Keys S',
    'Logitech MX Master 3S',
    'Apple Magic Keyboard',
    'Apple Magic Mouse',
    'Keychron Q1 Pro',
    'Keychron K8 Pro',
    'Dell UltraSharp U2724D',
    'LG UltraFine 27UP850',
    'BenQ PD2705U',
    'Samsung ViewFinity S7',
    'HP LaserJet Pro 4101fdw',
    'Canon PIXMA G650',
    'Epson EcoTank ET-2850',
    'Brother HL-L3240CDW',
    'Moleskine Classic Notebook',
    'Leuchtturm1917 Notebook',
    'Parker Jotter Premium',
    'Lamy Safari Fountain Pen',
    'Pilot Custom 823',
    'Montblanc Meisterstück Classique Pen'
  ]
}

const priceRanges = {
  'Vêtements': [3500, 45000],
  'Chaussures': [5000, 65000],
  'Sacs': [4500, 150000],
  'Montres': [8000, 1200000],
  'Téléphones': [35000, 350000],
  'Audio': [7000, 180000],
  'Ordinateurs': [70000, 650000],
  'Gaming': [12000, 350000],
  'Soins personnels': [4000, 70000],
  'Accessoires': [3000, 80000],
  'Sport': [5000, 120000],
  'Maquillage': [3500, 55000],
  'Maison': [5000, 180000],
  'Camping': [4000, 100000],
  'Décoration': [3000, 150000],
  'Art & Création': [1500, 60000],
  'Lecture': [1200, 15000],
  'Bureau': [1500, 100000]
}

const categoryDescriptions = {
  'Vêtements': 'Vêtement homme sélectionné par DZShop.',
  'Chaussures': 'Chaussure sélectionnée par DZShop.',
  'Sacs': 'Sac pratique et élégant sélectionné par DZShop.',
  'Montres': 'Montre sélectionnée par DZShop.',
  'Téléphones': 'Smartphone sélectionné par DZShop.',
  'Audio': 'Produit audio sélectionné par DZShop.',
  'Ordinateurs': 'Ordinateur sélectionné par DZShop.',
  'Gaming': 'Produit gaming sélectionné par DZShop.',
  'Soins personnels': 'Produit de soin personnel sélectionné par DZShop.',
  'Accessoires': 'Accessoire sélectionné par DZShop.',
  'Sport': 'Équipement sportif sélectionné par DZShop.',
  'Maquillage': 'Produit de maquillage sélectionné par DZShop.',
  'Maison': 'Produit pour la maison sélectionné par DZShop.',
  'Camping': 'Équipement de camping sélectionné par DZShop.',
  'Décoration': 'Produit de décoration sélectionné par DZShop.',
  'Art & Création': 'Matériel artistique sélectionné par DZShop.',
  'Lecture': 'Livre sélectionné par DZShop.',
  'Bureau': 'Produit de bureau sélectionné par DZShop.'
}

function createProducts() {
  const products = []

  for (const [categorie, names] of Object.entries(categories)) {
    const [minPrice, maxPrice] =
      priceRanges[categorie]

    names.forEach((nom, index) => {
      const priceStep =
        (maxPrice - minPrice) /
        Math.max(names.length - 1, 1)

      const prix =
        Math.round(
          (minPrice + priceStep * index) / 100
        ) * 100

      const product = {
        nom,
        description:
          `${nom}. ${categoryDescriptions[categorie]}`,
        prix,
        categorie,
        stock: 10 + (index % 21),
        image: ''
      }

      if (categorie === 'Vêtements') {
        product.tailles = [
          'XS',
          'S',
          'M',
          'L',
          'XL',
          'XXL',
          'XXXL'
        ]
      }

      if (categorie === 'Chaussures') {
        product.tailles = [
          '36',
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
      }

      products.push(product)
    })
  }

  return products
}

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    )

    console.log('MongoDB connecté')

    const products = createProducts()

    console.log(
      `${products.length} produits préparés`
    )

    console.log(
      `${Object.keys(categories).length} catégories préparées`
    )

    console.log('')

    await Product.deleteMany({})

    console.log(
      'Anciens produits supprimés'
    )

    await Product.insertMany(products)

    console.log(
      `${products.length} produits ajoutés`
    )

    console.log('')

    for (const [categorie, names] of Object.entries(categories)) {
      console.log(
        `✓ ${categorie}: ${names.length}`
      )
    }

    console.log('')
    console.log('Seed terminé')
  } catch (error) {
    console.error(
      'Erreur seed:',
      error.message
    )
  } finally {
    await mongoose.disconnect()
  }
}

seed()