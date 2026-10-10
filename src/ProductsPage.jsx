
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FaArrowRight,
  FaShoppingBag,
  FaSearch,
  FaHeart
} from 'react-icons/fa'
import { apiFetch, lireJson } from './api'
import { useFavorites } from './FavoritesContext'
import './ProductsPage.css'

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
  const [searchParams] = useSearchParams()
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

  const productRows = []

  for (let i = 0; i < produitsFiltres.length; i += 10) {
    productRows.push(produitsFiltres.slice(i, i + 10))
  }

  function renderProductCard(p, duplicate = false) {
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
        key={`${duplicate ? 'duplicate-' : ''}${p._id}`}
        aria-hidden={duplicate ? 'true' : undefined}
      >
        <div className="dz-product-image">
          <Link
            className="dz-product-image-link"
            to={productUrl}
            tabIndex={duplicate ? -1 : undefined}
            aria-hidden={duplicate ? 'true' : undefined}
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
            onClick={() => toggleFavorite(p)}
            aria-label={
              favorite
                ? `Remove ${p.nom} from favorites`
                : `Add ${p.nom} to favorites`
            }
            aria-pressed={favorite}
            disabled={duplicate}
            tabIndex={duplicate ? -1 : 0}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FaHeart />
          </button>
        </div>

        <Link
          className="dz-product-card-link"
          to={productUrl}
          tabIndex={duplicate ? -1 : undefined}
          aria-hidden={duplicate ? 'true' : undefined}
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
            <div className="dz-products-rows">
              {productRows.map((row, rowIndex) => (
                <div
                  className="dz-products-row"
                  key={`row-${rowIndex}`}
                >
                  <div
                    className="dz-products-track"
                    style={{
                      '--dz-row-duration': `${Math.max(
                        24,
                        row.length * 4
                      )}s`
                    }}
                  >
                    <div className="dz-products-track-group">
                      {row.map((p) => renderProductCard(p))}
                    </div>

                    <div
                      className="dz-products-track-group"
                      aria-hidden="true"
                    >
                      {row.map((p) => renderProductCard(p, true))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dz-products-grid">
              {produitsFiltres.map((p) => renderProductCard(p))}
            </div>
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
