
import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../server.js'

test('GET / retourne une réponse correcte', async function () {
  const response = await request(app).get('/')

  assert.equal(response.status, 200)
  assert.equal(response.body.message, 'API DZShop en ligne')
})

test('Les en-têtes de sécurité sont activés', async function () {
  const response = await request(app).get('/')

  assert.equal(response.headers['x-powered-by'], undefined)
  assert.equal(response.headers['x-content-type-options'], 'nosniff')
})

test('GET /api/auth/me refuse une requête sans token', async function () {
  const response = await request(app).get('/api/auth/me')

  assert.equal(response.status, 401)
  assert.equal(response.body.message, 'Connexion requise')
})

test('GET /api/auth/me refuse un token invalide', async function () {
  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer token-invalide')

  assert.equal(response.status, 401)
  assert.equal(response.body.message, 'Token invalide ou expiré')
})

test('La création de produit exige une authentification', async function () {
  const response = await request(app)
    .post('/api/products')
    .send({ nom: 'Produit test' })

  assert.equal(response.status, 401)
})

test('La création de commande exige une authentification', async function () {
  const response = await request(app)
    .post('/api/orders')
    .send({})

  assert.equal(response.status, 401)
})

test('Le tableau de bord admin exige une authentification', async function () {
  const response = await request(app).get('/api/admin')

  assert.equal(response.status, 401)
})

test('Un JSON invalide est refusé avec le statut 400', async function () {
  const response = await request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send('{"telephone":')

  assert.equal(response.status, 400)
  assert.equal(response.body.message, 'JSON invalide')
})

test('Une requête trop volumineuse est refusée avec le statut 413', async function () {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      telephone: '0550000000',
      password: 'x'.repeat(110 * 1024)
    })

  assert.equal(response.status, 413)
  assert.equal(response.body.message, 'Requête trop volumineuse')
})

test('Une origine non autorisée est refusée', async function () {
  const response = await request(app)
    .get('/')
    .set('Origin', 'https://site-inconnu.example')

  assert.equal(response.status, 403)
  assert.equal(response.body.message, 'Origine non autorisée')
})
