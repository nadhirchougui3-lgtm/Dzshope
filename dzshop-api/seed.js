import 'dotenv/config'

import mongoose from 'mongoose'
import ProductModule from './models/Product.js'

const Product = ProductModule.default || ProductModule

const protectedCategories = [
  'Soins personnels',
  'Accessoires',
  'Art & Création',
  'Lecture'
]

const categories = {
  'Vêtements': [
    'Ralph Lauren Purple Label Cashmere Sweater',
    'Ralph Lauren Polo Bear Sweater',
    'Polo Ralph Lauren Cable Knit Sweater',
    'Polo Ralph Lauren Oxford Shirt',
    'Polo Ralph Lauren Classic Fit Polo',
    'Lacoste Paris Slim Fit Polo',
    'Lacoste Classic Cotton Polo',
    'Hugo Boss H-Huge Suit Jacket',
    'Hugo Boss Slim Fit Suit Trousers',
    'Hugo Boss Regular Fit Wool Coat',
    'Armani Exchange Premium Logo Sweatshirt',
    'Emporio Armani Regular Fit Shirt',
    'Emporio Armani Logo Polo Shirt',
    'Tommy Hilfiger Premium Oxford Shirt',
    'Tommy Hilfiger Essential Chino',
    'Calvin Klein Premium Cotton Shirt',
    'Calvin Klein Modern Cotton Overshirt',
    'Diesel D-Strukt Slim Jeans',
    'Diesel 2023 D-Finitive Jeans',
    'Levi’s 501 Original Jeans',
    'Levi’s 502 Taper Jeans',
    'Levi’s 511 Slim Jeans',
    'G-Star RAW 3301 Slim Jeans',
    'Carhartt WIP Detroit Jacket',
    'Stone Island Ghost Piece Overshirt',
    'Stone Island Compass Patch Sweatshirt',
    'Moncler Grenoble Logo Hoodie',
    'Moncler Maya Short Down Jacket',
    'The North Face 1996 Retro Nuptse Jacket',
    'The North Face McMurdo Parka',
    'Canada Goose Langford Parka',
    'Canada Goose Lodge Hoody',
    'Burberry Check Cotton Shirt',
    'Burberry Quilted Jacket',
    'Maison Margiela Replica Hoodie',
    'AMI Paris Ami de Cœur Sweater',
    'Fear of God Essentials Hoodie',
    'Palm Angels Classic Track Jacket',
    'Loro Piana Cashmere Polo Shirt',
    'Brunello Cucinelli Cashmere Sweater'
  ],

  'Chaussures': [
    'Gucci Ace Embroidered Sneaker',
    'Gucci Rhyton Sneaker',
    'Louis Vuitton Trainer Sneaker',
    'Louis Vuitton Avenue Derby',
    'Dior B23 High-Top Sneaker',
    'Dior B27 Sneaker',
    'Prada Downtown Sneaker',
    'Prada America’s Cup Sneaker',
    'Balenciaga Triple S Sneaker',
    'Balenciaga 3XL Sneaker',
    'Saint Laurent SL/06 Court Classic Sneaker',
    'Saint Laurent Wyatt Chelsea Boot',
    'Alexander McQueen Oversized Sneaker',
    'Common Projects Original Achilles Low',
    'Golden Goose Super-Star Sneaker',
    'Salvatore Ferragamo Gancini Loafer',
    'Tod’s Gommino Driving Shoes',
    'Church’s Shannon Derby',
    'Berluti Alessandro Leather Oxford',
    'New Balance 990v6 Made in USA'
  ],

  'Sacs': [
    'Louis Vuitton Keepall Bandoulière 55',
    'Louis Vuitton Christopher Backpack',
    'Louis Vuitton Discovery Backpack',
    'Gucci GG Supreme Backpack',
    'Gucci Ophidia Messenger Bag',
    'Dior Saddle Messenger Bag',
    'Prada Re-Nylon Backpack',
    'Prada Re-Nylon Laptop Bag',
    'Saint Laurent City Backpack',
    'Burberry Check Backpack',
    'Montblanc Sartorial Backpack',
    'Tumi Alpha 3 Brief Pack',
    'Tumi Alpha Bravo Search Backpack',
    'Samsonite Pro-DLX 6 Laptop Backpack',
    'Samsonite C-Lite Spinner',
    'The North Face Borealis Backpack',
    'Nike Heritage Backpack',
    'Adidas Classic Badge of Sport Backpack',
    'Lululemon Everywhere Belt Bag',
    'Patagonia Black Hole Duffel 55L'
  ],

  'Montres': [
    'Rolex Submariner Date',
    'Rolex Datejust 41',
    'Rolex Oyster Perpetual 41',
    'Rolex GMT-Master II',
    'Omega Speedmaster Moonwatch Professional',
    'Omega Seamaster Diver 300M',
    'Omega Aqua Terra 150M',
    'Cartier Santos de Cartier',
    'Cartier Tank Must',
    'Cartier Ballon Bleu de Cartier',
    'TAG Heuer Carrera Chronograph',
    'TAG Heuer Monaco',
    'TAG Heuer Aquaracer Professional 300',
    'Breitling Navitimer B01 Chronograph 43',
    'Breitling Superocean Automatic 42',
    'Longines HydroConquest',
    'Longines Spirit Zulu Time',
    'Tissot PRX Powermatic 80',
    'Grand Seiko Heritage Collection',
    'IWC Portugieser Automatic'
  ],

  'Téléphones': [
    'Apple iPhone 17 Pro Max',
    'Apple iPhone 17 Pro',
    'Apple iPhone 17',
    'Apple iPhone Air',
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
    'Xiaomi 15',
    'Sony Xperia 1 VII',
    'ASUS ROG Phone 9 Pro',
    'Honor Magic7 Pro',
    'Huawei Pura 80 Ultra'
  ],

  'Audio': [
    'Apple AirPods Pro 3',
    'Apple AirPods Max',
    'Sony WH-1000XM6',
    'Sony WF-1000XM5',
    'Sony ULT Field 5',
    'Bose QuietComfort Ultra Headphones',
    'Bose QuietComfort Ultra Earbuds',
    'Bose SoundLink Max',
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
    'Bang & Olufsen Beoplay H100',
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
    'Dell Precision 5690',
    'Dell Latitude 9450',
    'HP Spectre x360 14',
    'HP EliteBook Ultra G1i',
    'Lenovo ThinkPad X1 Carbon Gen 13',
    'Lenovo ThinkPad X1 Yoga Gen 9',
    'Lenovo Yoga Pro 9i',
    'ASUS ROG Zephyrus G16',
    'ASUS ROG Strix G16',
    'ASUS Zenbook S 16 OLED',
    'Acer Predator Helios 18',
    'MSI Raider 18 HX',
    'Microsoft Surface Laptop 7'
  ],

  'Gaming': [
    'PlayStation 5 Pro',
    'Xbox Series X',
    'Xbox Series S',
    'Nintendo Switch 2',
    'Steam Deck OLED',
    'ASUS ROG Ally X',
    'Lenovo Legion Go',
    'PlayStation Portal Remote Player',
    'PlayStation DualSense Wireless Controller',
    'Xbox Wireless Controller',
    'Nintendo Switch Pro Controller',
    'Nintendo Joy-Con 2 Controllers',
    '8BitDo Ultimate 2C Wireless Controller',
    'Thrustmaster T300 RS GT Racing Wheel',
    'Logitech G923 Racing Wheel',
    'Meta Quest 3S',
    'Meta Quest 3',
    'Elgato Game Capture 4K Pro',
    'Elgato Stream Deck XL',
    'PlayStation VR2'
  ],

  'Sport': [
    'Manduka PRO Yoga Mat 71"',
    'Manduka PRO Yoga Mat 85"',
    'Lululemon The Big Mat 71"',
    'Lululemon The Reversible Mat 5mm',
    'Bowflex SelectTech 552 Adjustable Dumbbells',
    'Bowflex SelectTech 1090 Adjustable Dumbbells',
    'PowerBlock Pro 50 Adjustable Dumbbells',
    'TRX Suspension Trainer',
    'Therabody PowerDot 2.0',
    'Therabody Wave Roller',
    'Hyperice Normatec 3 Legs',
    'Hyperice Normatec Go',
    'TheraBand Professional Resistance Band Set',
    'Rogue Monster Bands Set',
    'Rogue AbMat',
    'Concept2 RowErg',
    'Concept2 BikeErg',
    'Airofit PRO 2.0 Breathing Trainer',
    'Garmin Forerunner 970',
    'Garmin HRM-Pro Plus'
  ],

  'Maquillage': [
    'Charlotte Tilbury Airbrush Flawless Foundation',
    'Charlotte Tilbury Airbrush Flawless Setting Spray',
    'Charlotte Tilbury Pillow Talk Eyeshadow Palette',
    'Charlotte Tilbury Pillow Talk Lipstick',
    'Huda Beauty Rose Quartz Eyeshadow Palette',
    'Huda Beauty Easy Bake Loose Baking & Setting Powder',
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
    'MAC Connect In Colour Eyeshadow Palette',
    'MAC Ruby Woo Lipstick',
    'Estée Lauder Double Wear Foundation',
    'Giorgio Armani Luminous Silk Foundation'
  ],

  'Maison': [
    'Nespresso Vertuo Creatista',
    'De’Longhi La Specialista Arte Evo',
    'Breville Barista Express',
    'KitchenAid Artisan Stand Mixer',
    'Vitamix A3500 Blender',
    'Ninja Foodi Power Nutri Blender',
    'Smeg 50s Style 4-Slice Toaster',
    'Smeg 50s Style Kettle',
    'Tefal OptiGrill Elite',
    'Breville Smart Oven Air Fryer Pro',
    'Ninja Foodi DualZone Air Fryer',
    'Philips Airfryer XXL',
    'Instant Pot Pro Plus',
    'Zojirushi Micom Rice Cooker',
    'Le Creuset Signature Round Dutch Oven',
    'Staub Cocotte Round',
    'Magimix 5200 XL Food Processor',
    'Bosch Series 8 Hand Blender',
    'KitchenAid 5KHM9212 Hand Mixer',
    'Philips PerfectCare Elite Steam Generator'
  ],

  'Camping': [
    'The North Face Wawona 6 Tent',
    'MSR Habitude 4 Tent',
    'MSR Hubba Hubba 2 Tent',
    'Quechua Air Seconds 4.1',
    'Black Diamond Storm 500-R Headlamp',
    'Petzl Actik Core Headlamp',
    'Garmin inReach Mini 2',
    'Garmin GPSMAP 67',
    'Garmin eTrex Solar',
    'Osprey Atmos AG 65 Backpack',
    'Deuter Aircontact Core 65+10 Backpack',
    'Stanley Classic Legendary Bottle',
    'Hydro Flask Wide Mouth 32 oz',
    'YETI Rambler 36 oz Bottle',
    'Therm-a-Rest NeoAir XTherm NXT',
    'Sea to Summit Comfort Plus Insulated Mat',
    'Black Diamond Moji Lantern',
    'Goal Zero Yeti 500X Power Station',
    'Anker SOLIX C800 Portable Power Station',
    'YETI Tundra 45 Cooler'
  ],

  'Décoration': [
    'Diptyque Baies Scented Candle',
    'Diptyque Figuier Scented Candle',
    'Jo Malone Lime Basil & Mandarin Candle',
    'Jo Malone English Pear & Freesia Candle',
    'Byredo Bibliothèque Candle',
    'Byredo Tree House Candle',
    'Tom Dixon London Scent Candle',
    'Ferm Living Riba Vase',
    'Ferm Living Hourglass Pot',
    'Audo Copenhagen Échasse Vase',
    'Audo Copenhagen Kettle Teapot',
    'Georg Jensen Cobra Candle Holder',
    'Georg Jensen Alfredo Vase',
    'Alessi Bark Vase',
    'Alessi Girotondo Fruit Holder',
    'Kartell I Shine Vase',
    'Muuto Kink Vase',
    'Louis Poulsen Portable Table Lamp',
    'Rituals The Ritual of Sakura Fragrance Sticks',
    'Jo Malone Lime Basil & Mandarin Diffuser'
  ],

  'Bureau': [
    'Logitech MX Keys S',
    'Logitech MX Master 3S',
    'Apple Magic Keyboard',
    'Keychron Q1 Pro',
    'Dell UltraSharp U2724D',
    'LG UltraFine 27UP850',
    'BenQ PD2705U',
    'Samsung ViewFinity S7',
    'HP LaserJet Pro 4101fdw',
    'Canon PIXMA G650',
    'Epson EcoTank ET-2850',
    'Brother HL-L3240CDW',
    'Fellowes Fusion A4 Paper Trimmer',
    'Dahle 502 Guillotine Paper Cutter',
    'Rotring A3 Drawing Board',
    'Staedtler Mars A3 Drawing Board',
    'Logitech MX Brio 4K Webcam',
    'Brother P-touch PT-D610BT Label Printer',
    'Moleskine Classic Notebook',
    'Montblanc Meisterstück Classique Ballpoint Pen'
  ]
}

const priceLists = {
  'Vêtements': [
    129000, 85000, 42000, 28500, 27000,
    24500, 18500, 95000, 42000, 135000,
    22000, 31000, 28000, 24500, 26000,
    22000, 30000, 38000, 42000, 23000,
    24000, 24500, 32000, 65000, 85000,
    72000, 95000, 185000, 78000, 105000,
    210000, 145000, 72000, 95000, 65000,
    62000, 48000, 38000, 155000, 185000
  ],

  'Chaussures': [
    165000, 175000, 295000, 185000, 185000,
    175000, 145000, 155000, 165000, 190000,
    125000, 175000, 145000, 95000, 115000,
    125000, 105000, 135000, 210000, 55000
  ],

  'Sacs': [
    285000, 365000, 325000, 185000, 165000,
    215000, 145000, 125000, 135000, 145000,
    95000, 85000, 78000, 52000, 95000,
    32000, 16000, 8500, 8500, 52000
  ],

  'Montres': [
    1850000, 1350000, 850000, 2200000, 650000,
    520000, 480000, 850000, 420000, 620000,
    480000, 520000, 350000, 780000, 520000,
    185000, 265000, 95000, 1250000, 850000
  ],

  'Téléphones': [
    365000, 315000, 245000, 235000, 285000,
    295000, 245000, 205000, 385000, 235000,
    285000, 245000, 185000, 175000, 255000,
    165000, 245000, 285000, 235000, 295000
  ],

  'Audio': [
    42000, 115000, 85000, 52000, 62000,
    95000, 65000, 72000, 78000, 65000,
    85000, 42000, 28000, 52000, 28000,
    65000, 62000, 52000, 95000, 72000
  ],

  'Ordinateurs': [
    520000, 430000, 285000, 245000, 365000,
    325000, 285000, 520000, 285000, 315000,
    345000, 385000, 345000, 385000, 520000,
    425000, 395000, 465000, 520000, 285000
  ],

  'Gaming': [
    195000, 135000, 75000, 95000, 115000,
    145000, 125000, 65000, 11500, 9500,
    12500, 16500, 9500, 85000, 48000,
    95000, 145000, 65000, 52000, 95000
  ],

  'Sport': [
    14500, 18500, 22000, 12000, 95000,
    185000, 125000, 28000, 65000, 35000,
    165000, 95000, 8500, 14500, 6500,
    165000, 155000, 65000, 125000, 18000
  ],

  'Maquillage': [
    9800, 8500, 7200, 6500, 9500,
    7800, 6500, 7200, 8500, 5200,
    6500, 8500, 6500, 9500, 8500,
    6800, 8500, 5200, 8500, 11500
  ],

  'Maison': [
    165000, 95000, 115000, 125000, 145000,
    42000, 28000, 22000, 35000, 85000,
    42000, 38000, 32000, 52000, 52000,
    48000, 85000, 28000, 18000, 65000
  ],

  'Camping': [
    85000, 65000, 48000, 52000, 14500,
    9500, 65000, 65000, 52000, 85000,
    65000, 8500, 7500, 9500, 28000,
    18500, 6500, 85000, 125000, 52000
  ],

  'Décoration': [
    12500, 12500, 14500, 14500, 18500,
    18500, 16500, 9500, 8500, 22000,
    18500, 14500, 18500, 9500, 8500,
    12500, 14500, 85000, 8500, 14500
  ],

  'Bureau': [
    16500, 24500, 14500, 42000, 85000,
    72000, 65000, 62000, 95000, 52000,
    55000, 65000, 12000, 8500, 18500,
    16500, 42000, 65000, 3500, 52000
  ]
}

const categoryDescriptions = {
  'Vêtements': 'Premium men’s fashion product selected by DZShop.',
  'Chaussures': 'Premium footwear product selected by DZShop.',
  'Sacs': 'Premium men’s bag selected by DZShop.',
  'Montres': 'Premium luxury watch selected by DZShop.',
  'Téléphones': 'Premium smartphone selected by DZShop.',
  'Audio': 'Premium wireless audio product selected by DZShop.',
  'Ordinateurs': 'Premium laptop selected by DZShop.',
  'Gaming': 'Gaming console or gaming hardware selected by DZShop.',
  'Sport': 'Premium sports equipment selected by DZShop.',
  'Maquillage': 'Premium makeup product selected by DZShop.',
  'Maison': 'Premium home and kitchen appliance selected by DZShop.',
  'Camping': 'Useful premium outdoor camping equipment selected by DZShop.',
  'Décoration': 'Premium home decoration and ambience product selected by DZShop.',
  'Bureau': 'Professional office and workspace product selected by DZShop.'
}

const makeupVariants = {
  'Charlotte Tilbury Airbrush Flawless Foundation': [
    '1 Neutral',
    '3 Neutral',
    '5 Neutral',
    '7 Neutral',
    '9 Neutral'
  ],
  'Charlotte Tilbury Pillow Talk Eyeshadow Palette': [
    'Pillow Talk'
  ],
  'Charlotte Tilbury Pillow Talk Lipstick': [
    'Pillow Talk Original',
    'Pillow Talk Medium',
    'Pillow Talk Intense'
  ],
  'Huda Beauty Rose Quartz Eyeshadow Palette': [
    'Rose Quartz'
  ],
  'Huda Beauty Easy Bake Loose Baking & Setting Powder': [
    'Pound Cake',
    'Banana Bread',
    'Peach Pie',
    'Kunafa',
    'Coffee Cake'
  ],
  'Rare Beauty Soft Pinch Liquid Blush': [
    'Happy',
    'Hope',
    'Joy',
    'Love',
    'Believe'
  ],
  'Rare Beauty Positive Light Highlighter': [
    'Enlighten',
    'Exhilarate',
    'Mesmerize',
    'Outshine'
  ],
  'Fenty Beauty Pro Filt’r Foundation': [
    '110',
    '170',
    '230',
    '290',
    '330',
    '420'
  ],
  'Fenty Beauty Gloss Bomb': [
    'Fu$$y',
    'Hot Chocolit',
    'Fenty Glow',
    'Glass Slipper'
  ],
  'Fenty Beauty Match Stix Contour Skinstick': [
    'Amber',
    'Mocha',
    'Truffle',
    'Espresso'
  ],
  'Dior Backstage Face & Body Foundation': [
    '0N',
    '1N',
    '2N',
    '3N',
    '4N',
    '6N'
  ],
  'Dior Addict Lip Glow': [
    '001 Pink',
    '004 Coral',
    '006 Berry',
    '012 Rosewood'
  ],
  'YSL Rouge Pur Couture': [
    '01 Le Rouge',
    '21 Rouge Paradoxe',
    '1966 Rouge Libre',
    '70 Le Nu'
  ],
  'NARS Light Reflecting Foundation': [
    'L1 Oslo',
    'L2 Mont Blanc',
    'M1 Punjab',
    'M3 Stromboli',
    'M6 Barcelona',
    'D4 Macao'
  ],
  'NARS Radiant Creamy Concealer': [
    'Chantilly',
    'Vanilla',
    'Custard',
    'Ginger',
    'Caramel',
    'Cacao'
  ],
  'MAC Connect In Colour Eyeshadow Palette': [
    'Bronze Influence'
  ],
  'MAC Ruby Woo Lipstick': [
    'Ruby Woo'
  ],
  'Estée Lauder Double Wear Foundation': [
    '1N2 Ecru',
    '2N1 Desert Beige',
    '3N1 Ivory Beige',
    '4N1 Shell Beige',
    '5N1 Rich Ginger'
  ],
  'Giorgio Armani Luminous Silk Foundation': [
    '2',
    '4',
    '5.1',
    '6',
    '7.5',
    '9'
  ]
}

function createColorObjects(productName) {
  const variants = makeupVariants[productName]

  if (!variants) {
    return undefined
  }

  return variants.map(name => ({
    nom: name,
    image: ''
  }))
}

function createProducts() {
  const products = []

  for (const [categorie, names] of Object.entries(categories)) {
    const prices = priceLists[categorie]

    names.forEach((nom, index) => {
      const prix = prices[index]

      const product = {
        nom,
        description: `${nom}. ${categoryDescriptions[categorie]}`,
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

      const couleurs = createColorObjects(nom)

      if (couleurs) {
        product.couleurs = couleurs
      }

      products.push(product)
    })
  }

  return products
}

async function validateProtectedCategories() {
  for (const categorie of protectedCategories) {
    const count = await Product.countDocuments({ categorie })

    if (count !== 20) {
      throw new Error(
        `Protected category "${categorie}" contains ${count} products. Expected 20. Seed aborted to protect existing data.`
      )
    }
  }
}

async function validateCategories() {
  const categoryNames = Object.keys(categories)

  if (categoryNames.length !== 14) {
    throw new Error(
      `Expected 14 modified categories, found ${categoryNames.length}.`
    )
  }

  for (const [categorie, names] of Object.entries(categories)) {
    if (names.length !== 20 && categorie !== 'Vêtements') {
      throw new Error(
        `Category "${categorie}" must contain 20 products. Found ${names.length}.`
      )
    }

    if (categorie === 'Vêtements' && names.length !== 40) {
      throw new Error(
        `Category "Vêtements" must contain 40 products. Found ${names.length}.`
      )
    }

    if (!priceLists[categorie] || priceLists[categorie].length !== names.length) {
      throw new Error(
        `Category "${categorie}" price list does not match product count.`
      )
    }
  }
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected')
    console.log('')

    await validateCategories()
    await validateProtectedCategories()

    const products = createProducts()

    if (products.length !== 300) {
      throw new Error(
        `Expected 300 products in modified categories, but prepared ${products.length}.`
      )
    }

    console.log(`${products.length} new products prepared`)
    console.log('300 products in modified categories')
    console.log('80 products protected')
    console.log('')

    await Product.deleteMany({
      categorie: {
        $in: Object.keys(categories)
      }
    })

    console.log('Old products from modified categories deleted')

    await Product.insertMany(products)

    console.log(`${products.length} new products inserted`)
    console.log('')

    for (const [categorie, names] of Object.entries(categories)) {
      console.log(`✓ ${categorie}: ${names.length}`)
    }

    console.log('')
    console.log('✓ Soins personnels: PROTECTED')
    console.log('✓ Accessoires: PROTECTED')
    console.log('✓ Art & Création: PROTECTED')
    console.log('✓ Lecture: PROTECTED')
    console.log('')

    const totalInDatabase = await Product.countDocuments({})

    console.log(`Total products in MongoDB: ${totalInDatabase}`)

    if (totalInDatabase !== 380) {
      throw new Error(
        `Expected total = 380, current total = ${totalInDatabase}`
      )
    }

    console.log('')
    console.log('✓ Seed completed successfully')
  } catch (error) {
    console.error('Seed error:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seed()
