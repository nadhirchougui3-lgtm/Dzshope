import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'
import adminUsersRoutes from './routes/adminUsers.js'

dotenv.config()

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans le fichier .env')
}

const app = express()
const PORT = process.env.PORT || 5000

const origines = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://192.168.1.12:5173',
  'http://192.168.1.12:5174',
  'http://192.168.1.12:5175',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({ origin: origines }))
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin/users', adminUsersRoutes)

app.use('/uploads', express.static('uploads'))

app.get('/', function (req, res) {
  res.json({ message: 'API DZShop en ligne' })
})

mongoose
  .connect(process.env.MONGODB_URI)
  .then(function () {
    console.log('MongoDB connecté')

    app.listen(PORT, '0.0.0.0', function () {
      console.log('Serveur sur http://localhost:' + PORT)
      console.log('Serveur réseau sur http://192.168.1.12:' + PORT)
    })
  })
  .catch(function (err) {
    console.log('Erreur MongoDB : ' + err.message)
  })

mongoose.connection.on('error', function (err) {
  console.log('Erreur MongoDB : ' + err.message)
})
