import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiFetch } from './api'
import { useCart } from './CartContext'
import './ProductDetailPage.css'

function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [produit, setProduit] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(function () {
    setChargement(true)
    setQuantity(1)

    apiFetch('/api/products/' + id)
      .then(function (res) {
        return res.ok ? res.json() : null
      })
      .then(function (data) {
        setProduit(data)
        setChargement(false)
      })
      .catch(function () {
        setChargement(false)
      })
  }, [id])

  if (chargement) {
    return (
      <div className="dz-detail-loading">
        <div className="dz-spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    )
  }

  if (!produit) {
    return (
      <div className="dz-not-found">

        <div className="dz-not-found-icon">
          🛍️
        </div>

        <h2>Produit introuvable</h2>

        <p>
          Ce produit n'existe pas ou n'est plus disponible.
        </p>

        <Link
          className="dz-back-button"
          to="/produits"
        >
          ← Retour aux produits
        </Link>

      </div>
    )
  }

  function diminuer() {
    setQuantity(function (ancienne) {
      return Math.max(1, ancienne - 1)
    })
  }

  function augmenter() {
    setQuantity(function (ancienne) {
      return Math.min(produit.stock, ancienne + 1)
    })
  }

  function handleAddToCart() {
    addToCart(produit, quantity)
  }

  return (
    <div className="dz-detail-page">

      <div className="container">

        {/* BREADCRUMB */}

        <div className="dz-breadcrumb">
          <Link to="/">
            Accueil
          </Link>

          <span>›</span>

          <Link to="/produits">
            Produits
          </Link>

          <span>›</span>

          <span>{produit.nom}</span>
        </div>

        {/* PRODUCT */}

        <div className="dz-detail-card">

          {/* IMAGE */}

          <div className="dz-detail-image">

            {produit.image ? (
              <img
                src={produit.image}
                alt={produit.nom}
              />
            ) : (
              <div className="dz-detail-no-image">
                🛍️
              </div>
            )}

            {produit.categorie && (
              <span className="dz-detail-category">
                {produit.categorie}
              </span>
            )}

          </div>

          {/* INFO */}

          <div className="dz-detail-info">

            <span className="dz-detail-label">
              Produit
            </span>

            <h1>
              {produit.nom}
            </h1>

            <p className="dz-detail-description">
              {produit.description}
            </p>

            <div className="dz-detail-divider"></div>

            <div className="dz-detail-price">
              {produit.prix.toLocaleString('fr-FR')} DA
            </div>

            <div className="dz-detail-stock">
              {produit.stock > 0
                ? `✓ ${produit.stock} produits disponibles`
                : '✕ Produit en rupture de stock'}
            </div>

            {/* QUANTITY */}

            <div className="dz-quantity-section">

              <span>
                Quantité
              </span>

              <div className="dz-quantity">

                <button
                  type="button"
                  onClick={diminuer}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <strong>
                  {quantity}
                </strong>

                <button
                  type="button"
                  onClick={augmenter}
                  disabled={quantity >= produit.stock}
                >
                  +
                </button>

              </div>

            </div>

            {/* ADD TO CART */}

            <button
              className="dz-add-cart"
              onClick={handleAddToCart}
              disabled={produit.stock === 0}
            >
              🛒
              {produit.stock === 0
                ? ' Rupture de stock'
                : ' Ajouter au panier'}
            </button>

            <Link
              to="/produits"
              className="dz-back-products"
            >
              ← Continuer mes achats
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductDetailPage