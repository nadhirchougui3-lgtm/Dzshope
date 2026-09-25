import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5175' }))
app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

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