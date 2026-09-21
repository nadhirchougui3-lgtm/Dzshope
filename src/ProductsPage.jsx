import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, lireJson } from './api'
import './ProductsPage.css'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(function () {
    apiFetch('/api/products')
      .then(lireJson)
      .then(function (data) {
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
        <p>Chargement des produits...</p>
      </div>
    )
  }

  return (
    <div className="dz-products-page">

      <div className="container">

        {/* HEADER */}
        <div className="dz-products-header">

          <div>
            <span className="dz-products-badge">
              🛍️ Notre collection
            </span>

            <h1>
              Nos <span>produits</span>
            </h1>

            <p>
              Découvrez notre sélection de produits.
            </p>
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="row g-4 pb-5">

          {products.map(function (p) {
            return (
              <div
                className="col-md-6 col-lg-4"
                key={p._id}
              >

                <div className="dz-product-card">

                  {/* PRODUCT IMAGE */}
                  <div className="dz-product-image">

                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.nom}
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

                  {/* PRODUCT INFO */}
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
                        ? `✓ ${p.stock} disponibles`
                        : '✕ Rupture de stock'}
                    </div>

                    <Link
                      to={'/produit/' + p._id}
                      className="dz-product-button"
                    >
                      <span>Voir le produit</span>
                      <strong>→</strong>
                    </Link>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>

    </div>
  )
}

export default ProductsPage