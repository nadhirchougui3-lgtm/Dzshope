import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

// Sans phrase secrète, on ne démarre pas : mieux vaut planter que d'être vulnérable
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans le fichier .env')
}

const app = express()
const PORT = process.env.PORT || 5000

// Qui a le droit d'appeler l'API depuis un navigateur ?
// En local : Vite (port 5173, ou 5174/5175 si 5173 est déjà pris). En ligne : l'adresse de ton site (variable FRONTEND_URL).
const origines = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL
].filter(Boolean)
app.use(cors({ origin: origines }))
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

// Les images envoyées en local sont servies depuis le dossier uploads/
app.use('/uploads', express.static('uploads'))

app.get('/', function (req, res) {
  res.json({ message: 'API DZShop en ligne' })
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log('MongoDB connecté')

    app.listen(PORT, function () {
      console.log('Serveur sur http://localhost:' + PORT)
    })
  })
  .catch(function (err) {
    console.log('Erreur MongoDB : ' + err.message)
  })

mongoose.connection.on('error', function (err) {
  console.log('Erreur MongoDB : ' + err.message)
})