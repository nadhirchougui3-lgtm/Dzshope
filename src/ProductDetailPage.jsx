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
  const [taille, setTaille] = useState('')
  const [couleur, setCouleur] = useState('')

  useEffect(function () {
    setChargement(true)
    setQuantity(1)
    setTaille('')
    setCouleur('')

    apiFetch('/api/products/' + id)
      .then(function (res) {
        return res.ok ? res.json() : null
      })
      .then(function (data) {
        setProduit(data)

        if (
          data &&
          Array.isArray(data.couleurs) &&
          data.couleurs.length === 1
        ) {
          setCouleur(data.couleurs[0].nom)
        }

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

  function choisirCouleur(option) {
    setCouleur(option.nom)
  }

  function getImageProduit() {
    if (
      produit.categorie === 'Vêtements' &&
      couleur &&
      Array.isArray(produit.couleurs)
    ) {
      const couleurSelectionnee = produit.couleurs.find(function (option) {
        return option.nom === couleur
      })

      return couleurSelectionnee?.image || ''
    }

    return produit.image || ''
  }

  function handleAddToCart() {
    if (
      (produit.categorie === 'Vêtements' ||
        produit.categorie === 'Chaussures') &&
      produit.tailles &&
      produit.tailles.length > 0 &&
      !taille
    ) {
      return
    }

    if (
      produit.categorie === 'Vêtements' &&
      produit.couleurs &&
      produit.couleurs.length > 0 &&
      !couleur
    ) {
      return
    }

    addToCart(produit, quantity, taille, couleur)
  }

  const aDesTailles =
    (produit.categorie === 'Vêtements' ||
      produit.categorie === 'Chaussures') &&
    Array.isArray(produit.tailles) &&
    produit.tailles.length > 0

  const aDesCouleurs =
    produit.categorie === 'Vêtements' &&
    Array.isArray(produit.couleurs) &&
    produit.couleurs.length > 0

  const imageProduit = getImageProduit()

  return (
    <div className="dz-detail-page">

      <div className="container">

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

        <div className="dz-detail-card">

          <div className="dz-detail-image">

            {imageProduit ? (
              <img
                src={imageProduit}
                alt={produit.nom}
              />
            ) : (
              <div className="dz-detail-no-image"></div>
            )}

            {produit.categorie && (
              <span className="dz-detail-category">
                {produit.categorie}
              </span>
            )}

          </div>

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

            {aDesTailles && (
              <div className="dz-size-section">

                <span>
                  {produit.categorie === 'Chaussures'
                    ? 'Pointure'
                    : 'Taille'}
                </span>

                <div className="dz-size-options">

                  {produit.tailles.map(function (option) {
                    return (
                      <button
                        key={option}
                        type="button"
                        className={
                          taille === option
                            ? 'active'
                            : ''
                        }
                        onClick={function () {
                          setTaille(option)
                        }}
                      >
                        {option}
                      </button>
                    )
                  })}

                </div>

              </div>
            )}

            {aDesCouleurs && (
              <div className="dz-color-section">

                <span>
                  Couleur
                  {couleur && ` : ${couleur}`}
                </span>

                <div className="dz-color-options">

                  {produit.couleurs.map(function (option) {
                    return (
                      <button
                        key={option.nom}
                        type="button"
                        className={
                          couleur === option.nom
                            ? 'active'
                            : ''
                        }
                        onClick={function () {
                          choisirCouleur(option)
                        }}
                      >
                        {option.nom}
                      </button>
                    )
                  })}

                </div>

              </div>
            )}

            <button
              className="dz-add-cart"
              onClick={handleAddToCart}
              disabled={
                produit.stock === 0 ||
                (aDesTailles && !taille) ||
                (aDesCouleurs && !couleur)
              }
            >
              🛒

              {produit.stock === 0
                ? ' Rupture de stock'
                : aDesTailles && !taille
                  ? ' Choisir une taille'
                  : aDesCouleurs && !couleur
                    ? ' Choisir une couleur'
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

export default ProductDetailPage ;