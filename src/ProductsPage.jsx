import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiFetch, lireJson } from './api'
import './ProductsPage.css'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [chargement, setChargement] = useState(true)

  const [searchParams] = useSearchParams()
  const categorie = searchParams.get('categorie')

  useEffect(function () {
    apiFetch('/api/products')
      .then(lireJson)
      .then(function (data) {
        console.log('Products API:', data)

        data.forEach(function (p) {
          if (p.categorie === 'Maquillage') {
            console.log('Makeup Image:', p.nom, p.image)
          }
        })

        setProducts(data)
      })
      .catch(function (err) {
        console.error(err)
      })
      .finally(function () {
        setChargement(false)
      })
  }, [])

  if (chargement) {
    return (
      <div className="dz-loading">
        <div className="dz-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  const produitsFiltres = categorie
    ? products.filter(function (p) {
        return p.categorie === categorie
      })
    : products

  return (
    <div className="dz-products-page">

      <div className="container">

        <div className="dz-products-header">

          <div>
            <span className="dz-products-badge">
              🛍️ Our Collection
            </span>

            <h1>
              {categorie ? categorie : 'Our'} <span>Products</span>
            </h1>

            <p>
              {categorie
                ? `Discover our products in the ${categorie} category.`
                : 'Discover our selection of products.'}
            </p>
          </div>

        </div>

        <div className="dz-products-grid">

          {produitsFiltres.map(function (p) {
            const imagePath =
              p.categorie === 'Maquillage' && p.image
                ? p.image.replace(
                    '/images/products/makeup/',
                    '/images/products/'
                  )
                : p.image

            return (
              <div
                className="dz-product-item"
                key={p._id}
              >

                <div className="dz-product-card">

                  <div className="dz-product-image">

                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={p.nom}
                        onError={function (e) {
                          console.error(
                            'Image failed to load:',
                            p.nom,
                            imagePath
                          )
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="dz-no-image">
                        🛍️
                      </div>
                    )}

                    <span className="dz-category">
                      {p.categorie}
                    </span>

                  </div>

                  <div className="dz-product-content">

                    <h3>
                      {p.nom}
                    </h3>

                    <p className="dz-product-description">
                      {p.description}
                    </p>

                    <div className="dz-price">
                      {p.prix.toLocaleString('fr-FR')} DA
                    </div>

                    <div className="dz-stock">
                      {p.stock > 0
                        ? `✓ ${p.stock} available`
                        : '✕ Out of Stock'}
                    </div>

                    <Link
                      to={'/produit/' + p._id}
                      className="dz-product-button"
                    >
                      <span>View Product</span>
                      <strong>→</strong>
                    </Link>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

        {produitsFiltres.length === 0 && (
          <div className="text-center py-5">
            <h3>No products found</h3>
          </div>
        )}

      </div>

    </div>
  )
}

export default ProductsPage ;