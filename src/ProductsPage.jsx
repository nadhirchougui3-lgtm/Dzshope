import { useState, useEffect } from 'react'
import {
  Link,
  useSearchParams,
  useNavigate,
  useLocation
} from 'react-router-dom'
import {
  FaArrowRight,
  FaArrowLeft,
  FaShoppingBag,
  FaSearch,
  FaHeart
} from 'react-icons/fa'
import { apiFetch, lireJson } from './api'
import { useFavorites } from './FavoritesContext'
import { useAuth } from './AuthContext'
import './ProductsPage.css'

const PRODUCTS_PER_PAGE = 40

const aliases = {
  shoes: ['shoes', 'shoe', 'chaussures', 'chaussure', 'أحذية', 'حذاء', 'صباط'],
  clothes: ['clothes', 'clothing', 'vêtements', 'vetements', 'ملابس', 'لباس'],
  makeup: ['makeup', 'maquillage', 'مكياج', 'make up'],
  bags: ['bags', 'bag', 'sacs', 'sac', 'حقائب', 'حقيبة'],
  watches: ['watches', 'watch', 'montres', 'montre', 'ساعات', 'ساعة'],
  accessories: ['accessories', 'accessory', 'accessoires', 'إكسسوارات', 'اكسسوارات'],
  office: ['office', 'bureau', 'مكتب', 'مستلزمات مكتبية'],
  books: ['books', 'book', 'livres', 'livre', 'كتب', 'كتاب'],
  home: ['home', 'maison', 'منزل', 'ديكور', 'decoration'],
  skincare: ['skincare', 'soins', 'soin', 'عناية', 'العناية'],
  camping: ['camping', 'outdoor', 'plein air', 'تخييم', 'رحلات']
}

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ـ/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a, b) {
  const first = normalizeText(a)
  const second = normalizeText(b)

  if (!first) return second.length
  if (!second) return first.length

  const matrix = Array.from(
    { length: second.length + 1 },
    () => []
  )

  for (let i = 0; i <= second.length; i += 1) {
    matrix[i][0] = i
  }

  for (let j = 0; j <= first.length; j += 1) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= second.length; i += 1) {
    for (let j = 1; j <= first.length; j += 1) {
      const cost = second[i - 1] === first[j - 1] ? 0 : 1

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[second.length][first.length]
}

function getAliasesForQuery(query) {
  const normalizedQuery = normalizeText(query)

  for (const group of Object.values(aliases)) {
    const normalizedAliases = group.map(normalizeText)

    if (normalizedAliases.some((alias) => alias === normalizedQuery)) {
      return normalizedAliases
    }
  }

  return [normalizedQuery]
}

function getProductFields(product) {
  return [
    product?.nom,
    product?.categorie,
    product?.description,
    product?.marque,
    product?.brand
  ]
    .filter(Boolean)
    .map(normalizeText)
}

function productMatches(product, query) {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) return true

  const fields = getProductFields(product)
  const queryAliases = getAliasesForQuery(query)

  if (
    queryAliases.some((alias) =>
      fields.some((field) => field.includes(alias))
    )
  ) {
    return true
  }

  const queryWords = normalizedQuery.split(' ')

  return queryWords.some((word) => {
    if (word.length < 2) return false

    return fields.some((field) => {
      const fieldWords = field.split(' ')

      return fieldWords.some((fieldWord) => {
        if (fieldWord.includes(word) || word.includes(fieldWord)) {
          return true
        }

        if (word.length >= 3 && fieldWord.length >= 3) {
          const distance = levenshtein(word, fieldWord)
          const limit = word.length <= 4 ? 1 : 2

          return distance <= limit
        }

        return false
      })
    })
  })
}

function getProductScore(product, query) {
  const normalizedQuery = normalizeText(query)
  const name = normalizeText(product?.nom)
  const brand = normalizeText(product?.marque || product?.brand)
  const category = normalizeText(product?.categorie)

  if (name === normalizedQuery) return 100
  if (name.startsWith(normalizedQuery)) return 90
  if (brand.startsWith(normalizedQuery)) return 85
  if (name.includes(normalizedQuery)) return 80
  if (brand.includes(normalizedQuery)) return 75
  if (category.includes(normalizedQuery)) return 60

  return 40
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [chargement, setChargement] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()

  const categorie = searchParams.get('categorie') || ''
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    let actif = true

    apiFetch('/api/products')
      .then(lireJson)
      .then((data) => {
        if (!actif) return

        setProducts(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.products)
              ? data.products
              : []
        )
      })
      .catch((err) => {
        console.error(err)
        if (actif) setProducts([])
      })
      .finally(() => {
        if (actif) setChargement(false)
      })

    return () => {
      actif = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [categorie, searchQuery])

  if (chargement) {
    return (
      <div className="dz-products-loading">
        <div className="dz-products-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  let produitsFiltres = products

  if (categorie) {
    produitsFiltres = produitsFiltres.filter(
      (product) =>
        normalizeText(product.categorie) === normalizeText(categorie)
    )
  }

  if (searchQuery.trim()) {
    produitsFiltres = produitsFiltres
      .filter((product) => productMatches(product, searchQuery))
      .sort(
        (a, b) =>
          getProductScore(b, searchQuery) -
          getProductScore(a, searchQuery)
      )
  }

  const totalPages = Math.ceil(
    produitsFiltres.length / PRODUCTS_PER_PAGE
  )

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  )

  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = Math.min(
    startIndex + PRODUCTS_PER_PAGE,
    produitsFiltres.length
  )

  const produitsPage = produitsFiltres.slice(startIndex, endIndex)

  function goToPreviousPage() {
    if (safeCurrentPage <= 1) return

    setCurrentPage((page) => Math.max(1, page - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToNextPage() {
    if (safeCurrentPage >= totalPages) return

    setCurrentPage((page) => Math.min(totalPages, page + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const title = searchQuery.trim()
    ? 'Search results'
    : categorie
      ? categorie
      : 'Our'

  const description = searchQuery.trim()
    ? `Results matching "${searchQuery}".`
    : categorie
      ? `Explore our selection from ${categorie}.`
      : 'Discover carefully selected products for everyday life.'

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

  function renderProductCard(p) {
    const productUrl = `/produit/${p._id}`
    const favorite = isFavorite(p)

    const imagePath =
      p.categorie === 'Maquillage' && p.image
        ? p.image.replace(
            '/images/products/makeup/',
            '/images/products/'
          )
        : p.image

    return (
      <article
        className="dz-product-card"
        key={p._id}
      >
        <div className="dz-product-image">
          <Link
            className="dz-product-image-link"
            to={productUrl}
          >
            {imagePath ? (
              <img
                src={imagePath}
                alt={p.nom || 'Product'}
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="dz-product-no-image">
                <FaShoppingBag />
              </div>
            )}

            <span className="dz-product-category">
              {p.categorie}
            </span>

            {p.stock === 0 && (
              <span className="dz-product-soldout">
                Out of Stock
              </span>
            )}
          </Link>

          <button
            type="button"
            className={
              'dz-product-favorite' +
              (favorite ? ' is-favorite' : '')
            }
            onClick={() => handleFavoriteClick(p)}
            aria-label={
              favorite
                ? `Remove ${p.nom} from favorites`
                : `Add ${p.nom} to favorites`
            }
            aria-pressed={favorite}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart />
          </button>
        </div>

        <Link
          className="dz-product-card-link"
          to={productUrl}
        >
          <div className="dz-product-content">
            <span className="dz-product-type">
              {p.categorie}
            </span>

            <h2>{p.nom}</h2>

            <p>{p.description}</p>

            <div className="dz-product-meta">
              <strong>
                {Number(p.prix || 0).toLocaleString('fr-FR')} DA
              </strong>

              <span className={p.stock > 0 ? 'in-stock' : 'out-stock'}>
                {p.stock > 0
                  ? `${p.stock} available`
                  : 'Out of stock'}
              </span>
            </div>

            <div className="dz-product-link">
              View Product
              <FaArrowRight />
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <div className="dz-products-page">
      <div className="dz-products-container">
        <div className="dz-products-header">
          <div>
            <span className="dz-products-eyebrow">
              DZSHOP COLLECTION
            </span>

            <h1>
              {title} <span>Products</span>
            </h1>

            <p>{description}</p>
          </div>

          <div className="dz-products-count">
            <strong>{produitsFiltres.length}</strong>
            <span>
              {searchQuery.trim() ? 'Results' : 'Products'}
            </span>
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="dz-products-search-info">
            <FaSearch />
            <span>Search:</span>
            <strong>{searchQuery}</strong>
          </div>
        )}

        {produitsFiltres.length > 0 ? (
          <>
            <div className="dz-products-grid">
              {produitsPage.map(renderProductCard)}
            </div>

            {totalPages > 1 && (
              <div className="dz-products-pagination">
                <p>
                  Showing {startIndex + 1}–{endIndex} of{' '}
                  {produitsFiltres.length} products
                </p>

                <div className="dz-products-pagination-controls">
                  <button
                    type="button"
                    className="dz-products-page-button"
                    onClick={goToPreviousPage}
                    disabled={safeCurrentPage <= 1}
                  >
                    <FaArrowLeft />
                    Previous
                  </button>

                  <span className="dz-products-page-indicator">
                    Page {safeCurrentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    className="dz-products-page-button"
                    onClick={goToNextPage}
                    disabled={safeCurrentPage >= totalPages}
                  >
                    Next
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="dz-products-empty">
            <FaShoppingBag />

            <h2>No products found</h2>

            <p>
              {searchQuery.trim()
                ? `We couldn't find any product matching "${searchQuery}".`
                : 'There are no products available in this category.'}
            </p>

            <Link to="/produits">View All Products</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
