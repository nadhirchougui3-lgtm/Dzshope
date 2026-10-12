
import { useState, useEffect, useRef } from 'react'
import {
  useParams,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom'
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaHeart
} from 'react-icons/fa'
import { apiFetch } from './api'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import { useAuth } from './AuthContext'
import './ProductsPage.css'
import './ProductDetailPage.css'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [produit, setProduit] = useState(null)
  const [produitsDisponibles, setProduitsDisponibles] = useState([])
  const [chargement, setChargement] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [taille, setTaille] = useState('')
  const [couleur, setCouleur] = useState('')
  const [addedToBag, setAddedToBag] = useState(false)

  const addLocked = useRef(false)

  useEffect(function () {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    setChargement(true)
    setProduit(null)
    setProduitsDisponibles([])
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

    apiFetch('/api/products')
      .then(function (res) {
        return res.ok ? res.json() : []
      })
      .then(function (data) {
        const liste = Array.isArray(data)
          ? data
          : Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.produits)
              ? data.produits
              : []

        setProduitsDisponibles(liste)
      })
      .catch(function () {
        setProduitsDisponibles([])
      })
  }, [id])

  function handleFavoriteClick(product) {
    if (!user) {
      navigate('/login', {
        state: {
          from: `${location.pathname}${location.search}${location.hash}`
        }
      })

      return
    }

    toggleFavorite(product)
  }

  function renderRelatedProductCard(p) {
    const productId = p._id || p.id
    const productUrl = `/produit/${productId}`
    const favorite = isFavorite(p)

    const imagePath =
      p.categorie === 'Maquillage' && p.image
        ? p.image.replace(
            '/images/products/makeup/',
            '/images/products/'
          )
        : p.image

    return (
      <article className="dz-product-card" key={productId}>
        <div className="dz-product-image">
          <Link
            to={productUrl}
            className="dz-product-image-link"
            aria-label={`View ${p.nom || 'product'}`}
          >
            {imagePath ? (
              <img
                src={imagePath}
                alt={p.nom || 'Product'}
                loading="lazy"
              />
            ) : (
              <div className="dz-product-no-image">
                <FaShoppingBag />
                <span>No image</span>
              </div>
            )}

            {p.categorie && (
              <span className="dz-product-category">
                {p.categorie}
              </span>
            )}

            {p.stock <= 0 && (
              <span className="dz-product-soldout">
                Sold Out
              </span>
            )}
          </Link>

          <button
            type="button"
            className={
              'dz-product-favorite' +
              (favorite ? ' is-favorite' : '')
            }
            onClick={function (event) {
              event.preventDefault()
              event.stopPropagation()
              handleFavoriteClick(p)
            }}
            aria-label={
              favorite
                ? `Remove ${p.nom} from favorites`
                : `Add ${p.nom} to favorites`
            }
            aria-pressed={favorite}
            title={
              favorite
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
          >
            <FaHeart />
          </button>
        </div>

        <Link to={productUrl} className="dz-product-card-link">
          <div className="dz-product-content">
            <span className="dz-product-type">
              {p.categorie || 'Product'}
            </span>

            <h2>{p.nom}</h2>

            <p>{p.description}</p>

            <div className="dz-product-meta">
              <span className="dz-product-price">
                {Number(p.prix || 0).toLocaleString('fr-FR')} DA
              </span>

              <span
                className={
                  p.stock > 0
                    ? 'dz-product-stock available'
                    : 'dz-product-stock unavailable'
                }
              >
                {p.stock > 0
                  ? `${p.stock} available`
                  : 'Out of stock'}
              </span>
            </div>

            <span className="dz-product-link">
              View Product
              <FaArrowRight />
            </span>
          </div>
        </Link>
      </article>
    )
  }

  if (chargement) {
    return (
      <div className="dz-detail-loading">
        <div className="dz-detail-spinner"></div>
        <p>Loading product...</p>
      </div>
    )
  }

  if (!produit) {
    return (
      <div className="dz-not-found">
        <FaShoppingBag />

        <h2>Product not found</h2>

        <p>
          This product does not exist or is no longer available.
        </p>

        <Link
          className="dz-back-button"
          to="/produits"
        >
          <FaArrowLeft />
          Back to Products
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
    setAddedToBag(false)
    addLocked.current = false
  }

  function choisirTaille(option) {
    playButtonSound()
    setTaille(option)
    setAddedToBag(false)
    addLocked.current = false
  }

  function getImageProduit() {
    if (
      couleur &&
      Array.isArray(produit.couleurs)
    ) {
      const couleurSelectionnee =
        produit.couleurs.find(function (option) {
          return option.nom === couleur
        })

      return (
        couleurSelectionnee?.image ||
        produit.image ||
        ''
      )
    }

    return produit.image || ''
  }

  function handleAddToCart() {
    if (addLocked.current) {
      return
    }

    if (produit.stock <= 0) {
      return
    }

    if (aDesTailles && !taille) {
      return
    }

    if (aDesCouleurs && !couleur) {
      return
    }

    const safeQuantity = Math.min(
      Math.max(1, quantity),
      produit.stock
    )

    addLocked.current = true

    try {
      addToCart(
        produit,
        safeQuantity,
        taille,
        couleur
      )

      setQuantity(safeQuantity)
      setAddedToBag(true)
      playSuccessSound()
    } catch (error) {
      addLocked.current = false
    }
  }

  const aDesTailles =
    (
      produit.categorie === 'Vêtements' ||
      produit.categorie === 'Chaussures'
    ) &&
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

  const produitId = String(produit._id || produit.id || id)

  const produitsMemeCategorie = produitsDisponibles.filter(
    function (item) {
      const itemId = String(item._id || item.id || '')

      return (
        itemId !== produitId &&
        item.categorie === produit.categorie
      )
    }
  )

  const autresProduits = produitsDisponibles.filter(
    function (item) {
      const itemId = String(item._id || item.id || '')

      return itemId !== produitId
    }
  )

  const produitsSimilaires = (
    produitsMemeCategorie.length > 0
      ? produitsMemeCategorie
      : autresProduits
  ).slice(0, 10)

  return (
    <div className="dz-detail-page">
      <div className="dz-detail-container">
        <div className="dz-detail-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/produits">Products</Link>
          <span>/</span>
          <strong>{produit.nom}</strong>
        </div>

        <div className="dz-detail-card">
          <div className="dz-detail-image-panel">
            {imageProduit ? (
              <img
                src={imageProduit}
                alt={
                  produit.nom +
                  (couleur ? ` - ${couleur}` : '')
                }
              />
            ) : (
              <div className="dz-detail-no-image">
                <FaShoppingBag />
              </div>
            )}

            {produit.categorie && (
              <span className="dz-detail-category">
                {produit.categorie}
              </span>
            )}

            <span className="dz-detail-image-number">
              DZ / PRODUCT
            </span>
          </div>

          <div className="dz-detail-info">
            <span className="dz-detail-label">
              Selected product
            </span>

            <h1>{produit.nom}</h1>

            <p className="dz-detail-description">
              {produit.description}
            </p>

            <div className="dz-detail-divider"></div>

            <div className="dz-detail-price">
              {produit.prix.toLocaleString('fr-FR')} DA
            </div>

            <div
              className={
                produit.stock > 0
                  ? 'dz-detail-stock available'
                  : 'dz-detail-stock unavailable'
              }
            >
              {produit.stock > 0 ? (
                <>
                  <FaCheck />
                  {produit.stock} items available
                </>
              ) : (
                'Out of Stock'
              )}
            </div>

            <div className="dz-detail-options">
              <div className="dz-quantity-section">
                <span>Quantity</span>

                <div className="dz-quantity">
                  <button
                    type="button"
                    onClick={diminuer}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>

                  <strong>{quantity}</strong>

                  <button
                    type="button"
                    onClick={augmenter}
                    disabled={quantity >= produit.stock}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {aDesCouleurs && (
                <div className="dz-option-section">
                  <div className="dz-option-heading">
                    <span>{colorLabel}</span>
                    {couleur && <strong>{couleur}</strong>}
                  </div>

                  <div className="dz-color-options">
                    {produit.couleurs.map(function (option) {
                      return (
                        <button
                          key={option.nom}
                          type="button"
                          className={
                            couleur === option.nom ? 'active' : ''
                          }
                          onClick={function () {
                            choisirCouleur(option)
                          }}
                        >
                          {option.nom}

                          {couleur === option.nom && (
                            <FaCheck />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {aDesTailles && (
                <div className="dz-option-section">
                  <div className="dz-option-heading">
                    <span>
                      {produit.categorie === 'Chaussures'
                        ? 'Shoe Size'
                        : 'Size'}
                    </span>

                    {taille && <strong>{taille}</strong>}
                  </div>

                  <div className="dz-size-options">
                    {produit.tailles.map(function (option) {
                      return (
                        <button
                          key={option}
                          type="button"
                          className={
                            taille === option ? 'active' : ''
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
            </div>

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
                ? 'Out of Stock'
                : addedToBag
                  ? 'Added to Bag'
                  : aDesTailles && !taille
                    ? 'Choose a Size'
                    : aDesCouleurs && !couleur
                      ? `Choose a ${colorLabel}`
                      : 'Add to Bag'}
              <FaArrowRight />
            </button>

            <Link
              to="/produits"
              className="dz-back-products"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </div>

        {produitsSimilaires.length > 0 && (
          <section className="dz-related-section">
            <div className="dz-related-heading">
              <div>
                <span className="dz-related-eyebrow">
                  DISCOVER MORE
                </span>

                <h2>Products You May Like</h2>

                <p>
                  Explore more products selected for you.
                </p>
              </div>

              <Link
                to="/produits"
                className="dz-related-see-all"
              >
                See All <FaArrowRight />
              </Link>
            </div>

            <div className="dz-related-grid">
              {produitsSimilaires.map(renderRelatedProductCard)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
