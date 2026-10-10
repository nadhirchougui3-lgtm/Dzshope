import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaPhone,
  FaUser,
  FaSearch,
  FaTimes,
  FaHistory,
  FaTrash,
  FaSignOutAlt,
  FaTools,
  FaThLarge
} from 'react-icons/fa'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import './navbar.css'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const HISTORY_KEY = 'dzshop_search_history'
const MAX_HISTORY = 12

const aliases = {
  shoes: [
    'shoes',
    'shoe',
    'chaussures',
    'chaussure',
    'أحذية',
    'حذاء',
    'صباط'
  ],
  clothes: [
    'clothes',
    'clothing',
    'vêtements',
    'vetements',
    'ملابس',
    'لباس'
  ],
  makeup: [
    'makeup',
    'maquillage',
    'مكياج',
    'make up'
  ],
  bags: [
    'bags',
    'bag',
    'sacs',
    'sac',
    'حقائب',
    'حقيبة'
  ],
  watches: [
    'watches',
    'watch',
    'montres',
    'montre',
    'ساعات',
    'ساعة'
  ],
  accessories: [
    'accessories',
    'accessory',
    'accessoires',
    'إكسسوارات',
    'اكسسوارات'
  ],
  office: [
    'office',
    'bureau',
    'مكتب',
    'مستلزمات مكتبية'
  ],
  books: [
    'books',
    'book',
    'livres',
    'livre',
    'كتب',
    'كتاب'
  ],
  home: [
    'home',
    'maison',
    'منزل',
    'ديكور',
    'decoration'
  ],
  skincare: [
    'skincare',
    'soins',
    'soin',
    'عناية',
    'العناية'
  ],
  camping: [
    'camping',
    'outdoor',
    'plein air',
    'تخييم',
    'رحلات'
  ]
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
      const cost =
        second[i - 1] === first[j - 1] ? 0 : 1

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

    if (normalizedAliases.some((item) => item === normalizedQuery)) {
      return normalizedAliases
    }
  }

  return [normalizedQuery]
}

function productMatches(product, query) {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) return false

  const fields = [
    product?.nom,
    product?.categorie,
    product?.description,
    product?.marque,
    product?.brand
  ]
    .filter(Boolean)
    .map(normalizeText)

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

function Navbar() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [history, setHistory] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)

  const searchRef = useRef(null)

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY)

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)

        if (Array.isArray(parsed)) {
          setHistory(
            parsed
              .filter(
                (item) =>
                  typeof item === 'string' && item.trim()
              )
              .slice(0, MAX_HISTORY)
          )
        }
      }
    } catch {
      setHistory([])
    }
  }, [])

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products`)

        if (!response.ok) return

        const data = await response.json()

        if (Array.isArray(data)) {
          setProducts(data)
        } else if (Array.isArray(data.products)) {
          setProducts(data.products)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Unable to load products for search:', error)
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  function saveSearch(value) {
    const cleaned = value.trim()

    if (!cleaned) return

    const updatedHistory = [
      cleaned,
      ...history.filter(
        (item) => normalizeText(item) !== normalizeText(cleaned)
      )
    ].slice(0, MAX_HISTORY)

    setHistory(updatedHistory)

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    } catch {
      return
    }
  }

  function deleteHistoryItem(value) {
    const updatedHistory = history.filter((item) => item !== value)

    setHistory(updatedHistory)

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    } catch {
      return
    }
  }

  function clearHistory() {
    setHistory([])

    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      return
    }
  }

  function submitSearch(value = search) {
    const cleaned = value.trim()

    if (!cleaned) return

    saveSearch(cleaned)
    setSearchOpen(false)

    navigate(`/produits?search=${encodeURIComponent(cleaned)}`)
  }

  function openProduct(product) {
    if (search.trim()) saveSearch(search)

    setSearchOpen(false)
    setSearch('')

    navigate(`/produit/${product._id}`)
  }

  const suggestions = search.trim()
    ? products
        .filter((product) => productMatches(product, search))
        .sort(
          (a, b) =>
            getProductScore(b, search) -
            getProductScore(a, search)
        )
        .slice(0, 7)
    : []

  return (
    <nav className="dz-navbar">
      <div className="dz-navbar-container">
        <Link to="/" className="dz-logo">
          <div className="dz-logo-mark">DZ</div>

          <div className="dz-logo-text">
            <div className="dz-shop-name">
              DZ<span>Shop</span>
            </div>

            <div className="dz-tagline">
              Quality · Price · Trust
            </div>
          </div>
        </Link>

        <div className="dz-search-wrapper" ref={searchRef}>
          <form
            className="dz-search"
            onSubmit={(event) => {
              event.preventDefault()
              submitSearch()
            }}
          >
            <FaSearch />

            <input
              type="search"
              value={search}
              placeholder="Search products, brands or categories..."
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setSearch(event.target.value)
                setSearchOpen(true)
              }}
            />

            {search && (
              <button
                type="button"
                className="dz-search-clear"
                onClick={() => {
                  setSearch('')
                  setSearchOpen(true)
                }}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </form>

          {searchOpen && (
            <div className="dz-search-dropdown">
              {search.trim() ? (
                suggestions.length > 0 ? (
                  <>
                    <div className="dz-search-heading">
                      <span>Suggestions</span>
                      <span>{suggestions.length}</span>
                    </div>

                    {suggestions.map((product) => (
                      <button
                        type="button"
                        className="dz-search-result"
                        key={product._id}
                        onClick={() => openProduct(product)}
                      >
                        <div className="dz-search-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.nom}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <FaShoppingBag />
                          )}
                        </div>

                        <div className="dz-search-result-info">
                          <strong>{product.nom}</strong>
                          <span>{product.categorie || 'Product'}</span>
                        </div>

                        <span className="dz-search-price">
                          {Number(product.prix || 0).toLocaleString('fr-DZ')}{' '}
                          DA
                        </span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="dz-search-empty">
                    <FaSearch />
                    <strong>No products found</strong>
                    <span>Try another product, brand or category.</span>
                  </div>
                )
              ) : history.length > 0 ? (
                <>
                  <div className="dz-search-heading">
                    <span>Recent searches</span>
                    <button type="button" onClick={clearHistory}>
                      Clear all
                    </button>
                  </div>

                  {history.map((item) => (
                    <div className="dz-history-item" key={item}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch(item)
                          setSearchOpen(true)
                        }}
                      >
                        <FaHistory />
                        <span>{item}</span>
                      </button>

                      <button
                        type="button"
                        className="dz-history-delete"
                        onClick={() => deleteHistoryItem(item)}
                        aria-label={`Delete ${item}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="dz-search-empty dz-search-empty-small">
                  <FaSearch />
                  <span>Search by product, brand or category.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop navigation */}
        <div className="dz-nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/produits"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaShoppingBag />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaPhone />
            <span>Contact</span>
          </NavLink>

          <NavLink
            to="/panier"
            className={({ isActive }) =>
              'dz-nav-link cart-link ' + (isActive ? 'active' : '')
            }
          >
            <div className="cart-icon-wrapper">
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </div>

            <span>Bag</span>
          </NavLink>

          {user && user.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                'dz-nav-link ' + (isActive ? 'active' : '')
              }
            >
              <FaTools />
              <span>Admin</span>
            </NavLink>
          )}

          {user ? (
            <>
              <span className="dz-nav-link dz-account-link">
                <FaUser />
                <span>Account</span>
              </span>

              <button
                type="button"
                className="dz-signout-button"
                onClick={logout}
              >
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="dz-auth-actions">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'dz-signin-link ' + (isActive ? 'active' : '')
                }
              >
                <FaUser />
                <span>Sign In</span>
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  'dz-signup-button ' + (isActive ? 'active' : '')
                }
              >
                <span>Sign Up</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        <div className="dz-mobile-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              'dz-mobile-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaHome />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/produits"
            className={({ isActive }) =>
              'dz-mobile-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaShoppingBag />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              'dz-mobile-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaThLarge />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/panier"
            className={({ isActive }) =>
              'dz-mobile-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <span className="dz-mobile-icon-wrapper">
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="dz-mobile-badge">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>

            <span>Bag</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              'dz-mobile-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaPhone />
            <span>Contact</span>
          </NavLink>

          {user && user.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                'dz-mobile-nav-link ' + (isActive ? 'active' : '')
              }
            >
              <FaTools />
              <span>Admin</span>
            </NavLink>
          )}

          {user ? (
            <button
              type="button"
              className="dz-mobile-nav-link dz-mobile-account"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'dz-mobile-nav-link dz-mobile-signin ' +
                  (isActive ? 'active' : '')
                }
              >
                <FaUser />
                <span>Sign In</span>
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  'dz-mobile-nav-link dz-mobile-signup ' +
                  (isActive ? 'active' : '')
                }
              >
                <FaUser />
                <span>Sign Up</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
