
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import helmet from 'helmet'
import dns from 'node:dns'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import authRoutes from './routes/auth.js'
import passkeyRoutes from './routes/passkey.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'
import adminUsersRoutes from './routes/adminUsers.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.disable('x-powered-by')
app.use(helmet())

const origines = [
  'http://localhost:5173',
  'http://192.168.1.8:5173',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origines.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origine non autorisée'))
  }
}))

app.use(express.json({ limit: '100kb' }))

app.get('/', function (req, res) {
  res.json({ message: 'API DZShop en ligne' })
})

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/passkey', passkeyRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin/users', adminUsersRoutes)

app.use('/uploads', express.static('uploads'))

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Requête trop volumineuse'
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'JSON invalide'
    })
  }

  if (err.message === 'Origine non autorisée') {
    return res.status(403).json({
      message: 'Origine non autorisée'
    })
  }

  console.error('Erreur serveur :', err.message)

  return res.status(500).json({
    message: 'Une erreur interne est survenue'
  })
})

mongoose.connection.on('error', function (err) {
  console.error('Erreur MongoDB :', err.message)
})

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET doit contenir au moins 32 caractères')
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI manquant dans le fichier .env')
  }

  try {
    if (process.env.NODE_ENV !== 'production') {
      dns.setServers(['8.8.8.8', '8.8.4.4'])
    }

    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connecté avec succès')

    app.listen(PORT, '0.0.0.0', function () {
      console.log('Serveur DZShop démarré sur le port ' + PORT)
    })
  } catch (err) {
    console.error('Connexion ou démarrage impossible :', err.message)
    process.exitCode = 1
  }
}

const fichierActuel = fileURLToPath(import.meta.url)
const fichierExecute = process.argv[1]
  ? path.resolve(process.argv[1])
  : ''

if (fichierExecute === fichierActuel) {
  startServer().catch(function (err) {
    console.error('Démarrage impossible :', err.message)
    process.exitCode = 1
  })
}

export default app
