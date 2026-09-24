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
              🛍️ Notre collection
            </span>

            <h1>
              {categorie ? categorie : 'Nos'} <span>produits</span>
            </h1>

            <p>
              {categorie
                ? `Découvrez nos produits de la catégorie ${categorie}.`
                : 'Découvrez notre sélection de produits.'}
            </p>
          </div>

        </div>

        <div className="dz-products-grid">

          {produitsFiltres.map(function (p) {
            return (
              <div
                className="dz-product-item"
                key={p._id}
              >

                <div className="dz-product-card">

                  <div className="dz-product-image">

                    {p.image ? (
                      <img
                        src={p.image || null}
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

        {produitsFiltres.length === 0 && (
          <div className="text-center py-5">
            <h3>Aucun produit trouvé</h3>
          </div>
        )}

      </div>

    </div>
  )
}

export default ProductsPage ;