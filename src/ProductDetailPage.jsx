import { useState, useEffect, useRef } from 'react'
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
  const [addedToBag, setAddedToBag] = useState(false)

  const addLocked = useRef(false)

  useEffect(function () {
    setChargement(true)
    setQuantity(1)
    setTaille('')
    setCouleur('')
    setAddedToBag(false)
    addLocked.current = false

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
        <p>Loading product...</p>
      </div>
    )
  }

  if (!produit) {
    return (
      <div className="dz-not-found">
        <div className="dz-not-found-icon">
          🛍️
        </div>

        <h2>Product not found</h2>

        <p>
          This product does not exist or is no longer available.
        </p>

        <Link
          className="dz-back-button"
          to="/produits"
        >
          ← Back to Products
        </Link>
      </div>
    )
  }

  function playButtonSound() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext

      if (!AudioContext) {
        return
      }

      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.value = 520

      gain.gain.setValueAtTime(0.04, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.08
      )

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start()
      oscillator.stop(context.currentTime + 0.08)
    } catch (error) {
    }
  }

  function playSuccessSound() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext

      if (!AudioContext) {
        return
      }

      const context = new AudioContext()

      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(
        620,
        context.currentTime
      )
      oscillator.frequency.setValueAtTime(
        820,
        context.currentTime + 0.1
      )

      gain.gain.setValueAtTime(0.05, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.22
      )

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start()
      oscillator.stop(context.currentTime + 0.22)
    } catch (error) {
    }
  }

  function diminuer() {
    playButtonSound()

    setQuantity(function (ancienne) {
      return Math.max(1, ancienne - 1)
    })
  }

  function augmenter() {
    playButtonSound()

    setQuantity(function (ancienne) {
      return Math.min(produit.stock, ancienne + 1)
    })
  }

  function choisirCouleur(option) {
    playButtonSound()
    setCouleur(option.nom)
  }

  function choisirTaille(option) {
    playButtonSound()
    setTaille(option)
  }

  function getImageProduit() {
    if (
      couleur &&
      Array.isArray(produit.couleurs)
    ) {
      const couleurSelectionnee = produit.couleurs.find(function (option) {
        return option.nom === couleur
      })

      return couleurSelectionnee?.image || produit.image || ''
    }

    return produit.image || ''
  }

  function handleAddToCart() {
    if (addLocked.current) {
      return
    }

    if (
      aDesTailles &&
      !taille
    ) {
      return
    }

    if (
      aDesCouleurs &&
      !couleur
    ) {
      return
    }

    addLocked.current = true

    try {
      addToCart(produit, quantity, taille, couleur)
      setAddedToBag(true)
      playSuccessSound()
    } catch (error) {
      addLocked.current = false
    }
  }

  const aDesTailles =
    (produit.categorie === 'Vêtements' ||
      produit.categorie === 'Chaussures') &&
    Array.isArray(produit.tailles) &&
    produit.tailles.length > 0

  const aDesCouleurs =
    Array.isArray(produit.couleurs) &&
    produit.couleurs.length > 0

  const imageProduit = getImageProduit()

  const colorLabel =
    produit.categorie === 'Maquillage'
      ? 'Shade'
      : 'Color'

  return (
    <div className="dz-detail-page">

      <div className="container">

        <div className="dz-breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span>›</span>

          <Link to="/produits">
            Products
          </Link>

          <span>›</span>

          <span>{produit.nom}</span>

        </div>

        <div className="dz-detail-card">

          <div className="dz-detail-image">

            {imageProduit ? (
              <img
                src={imageProduit}
                alt={produit.nom + (couleur ? ` - ${couleur}` : '')}
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
              Product
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
                ? `✓ ${produit.stock} items available`
                : '✕ Out of Stock'}
            </div>

            <div className="dz-quantity-section">

              <span>
                Quantity
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

            {aDesCouleurs && (
              <div className="dz-color-section">

                <span>
                  {colorLabel}
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

            {aDesTailles && (
              <div className="dz-size-section">

                <span>
                  {produit.categorie === 'Chaussures'
                    ? 'Shoe Size'
                    : 'Size'}
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
                          choisirTaille(option)
                        }}
                      >
                        {option}
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
                addedToBag ||
                (aDesTailles && !taille) ||
                (aDesCouleurs && !couleur)
              }
            >
              {produit.stock === 0
                ? '✕ Out of Stock'
                : addedToBag
                  ? '✓ Added to Bag'
                  : aDesTailles && !taille
                    ? 'Choose a Size'
                    : aDesCouleurs && !couleur
                      ? `Choose a ${colorLabel}`
                      : 'Add to Bag'}
            </button>

            <Link
              to="/produits"
              className="dz-back-products"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductDetailPage ;