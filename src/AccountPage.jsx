
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaShoppingBag,
  FaPhone,
  FaEnvelope,
  FaSignOutAlt,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaSpinner,
  FaKey,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import { startRegistration } from '@simplewebauthn/browser'

import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useFavorites } from './FavoritesContext'
import { apiFetch, lireJson } from './api'
import './AccountPage.css'

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString('en-DZ')} DA`
}

function formatDate(value) {
  if (!value) return 'Date unavailable'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatus(status) {
  const statuses = {
    'en attente': {
      label: 'Pending',
      icon: FaClock,
      className: 'pending',
    },
    confirmee: {
      label: 'Confirmed',
      icon: FaCheckCircle,
      className: 'confirmed',
    },
    expediee: {
      label: 'Shipped',
      icon: FaTruck,
      className: 'shipped',
    },
    livree: {
      label: 'Delivered',
      icon: FaCheckCircle,
      className: 'delivered',
    },
    annulee: {
      label: 'Cancelled',
      icon: FaTimesCircle,
      className: 'cancelled',
    },
  }

  return statuses[status] || {
    label: status || 'Pending',
    icon: FaClock,
    className: 'pending',
  }
}

async function requestJson(url, options) {
  const response = await apiFetch(url, options)
  return lireJson(response)
}

function AccountPage() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  const [passkeys, setPasskeys] = useState([])
  const [loadingPasskeys, setLoadingPasskeys] = useState(true)
  const [passkeyBusy, setPasskeyBusy] = useState(false)
  const [passkeyError, setPasskeyError] = useState('')
  const [passkeyMessage, setPasskeyMessage] = useState('')

  const name =
    user?.nom ||
    user?.name ||
    user?.username ||
    'DZShop Customer'

  const telephone = user?.telephone || user?.phone || ''
  const email = user?.email || ''

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  useEffect(() => {
    let active = true

    async function loadOrders() {
      setLoadingOrders(true)
      setOrdersError('')

      try {
        const data = await requestJson('/api/orders/my')

        if (active) {
          setOrders(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        if (active) {
          setOrdersError(
            error.message || 'Unable to load your orders.'
          )
        }
      } finally {
        if (active) setLoadingOrders(false)
      }
    }

    loadOrders()

    return () => {
      active = false
    }
  }, [])

  const loadPasskeys = useCallback(async () => {
    setLoadingPasskeys(true)
    setPasskeyError('')

    try {
      const data = await requestJson('/api/passkey/me')
      setPasskeys(Array.isArray(data) ? data : data.passkeys || [])
    } catch (error) {
      setPasskeyError(
        error.message || 'Unable to load your passkeys.'
      )
    } finally {
      setLoadingPasskeys(false)
    }
  }, [])

  useEffect(() => {
    loadPasskeys()
  }, [loadPasskeys])

  async function addPasskey() {
    setPasskeyError('')
    setPasskeyMessage('')
    setPasskeyBusy(true)

    try {
      const data = await requestJson(
        '/api/passkey/registration/options',
        {
          method: 'POST',
          body: JSON.stringify({}),
        }
      )

      const registrationResponse = await startRegistration({
        optionsJSON: data.options,
      })

      await requestJson('/api/passkey/registration/verify', {
        method: 'POST',
        body: JSON.stringify({
          response: registrationResponse,
          challengeId: data.challengeId,
        }),
      })

      setPasskeyMessage('Your passkey has been added successfully.')
      await loadPasskeys()
    } catch (error) {
      setPasskeyError(
        error.message || 'Unable to register this passkey.'
      )
    } finally {
      setPasskeyBusy(false)
    }
  }

  async function deletePasskey(id) {
    if (!id || passkeyBusy) return

    const confirmed = window.confirm(
      'Are you sure you want to remove this passkey?'
    )

    if (!confirmed) return

    setPasskeyError('')
    setPasskeyMessage('')
    setPasskeyBusy(true)

    try {
      await requestJson(`/api/passkey/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })

      setPasskeyMessage('Passkey removed successfully.')
      await loadPasskeys()
    } catch (error) {
      setPasskeyError(
        error.message || 'Unable to remove this passkey.'
      )
    } finally {
      setPasskeyBusy(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dz-account-page">
      <div className="dz-account-container">
        <header className="dz-account-header">
          <div>
            <span className="dz-account-eyebrow">
              DZSHOP / PERSONAL SPACE
            </span>
            <h1>My Account</h1>
            <p>Manage your account and track your orders.</p>
          </div>

          <button
            type="button"
            className="dz-account-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </header>

        <section className="dz-account-welcome">
          <div className="dz-account-avatar">
            <FaUser />
          </div>

          <div className="dz-account-welcome-info">
            <span>Welcome to DZShop</span>
            <h2>{name}</h2>

            <div className="dz-account-contact-info">
              {telephone && (
                <span>
                  <FaPhone />
                  {telephone}
                </span>
              )}

              {email && (
                <span>
                  <FaEnvelope />
                  {email}
                </span>
              )}
            </div>
          </div>

          <div className="dz-account-member-label">
            <span>CUSTOMER ACCOUNT</span>
          </div>
        </section>

        <section className="dz-account-shortcuts">
          <Link to="/favoris" className="dz-account-shortcut">
            <span className="dz-account-shortcut-icon">
              <FaHeart />
            </span>
            <span className="dz-account-shortcut-text">
              <strong>My Favorites</strong>
              <small>
                {favorites.length} saved item(s)
              </small>
            </span>
            <FaArrowRight className="dz-account-shortcut-arrow" />
          </Link>

          <Link to="/panier" className="dz-account-shortcut">
            <span className="dz-account-shortcut-icon">
              <FaShoppingBag />
            </span>
            <span className="dz-account-shortcut-text">
              <strong>My Cart</strong>
              <small>{cartCount} item(s)</small>
            </span>
            <FaArrowRight className="dz-account-shortcut-arrow" />
          </Link>

          <Link to="/contact" className="dz-account-shortcut">
            <span className="dz-account-shortcut-icon">
              <FaPhone />
            </span>
            <span className="dz-account-shortcut-text">
              <strong>Need Help?</strong>
              <small>Contact DZShop</small>
            </span>
            <FaArrowRight className="dz-account-shortcut-arrow" />
          </Link>
        </section>

        <section className="dz-account-passkeys">
          <div className="dz-account-section-heading">
            <div>
              <span className="dz-account-eyebrow">
                ACCOUNT SECURITY
              </span>
              <h2>Passkeys</h2>
            </div>

            <button
              type="button"
              className="dz-account-passkey-add"
              onClick={addPasskey}
              disabled={passkeyBusy}
            >
              {passkeyBusy ? (
                <FaSpinner className="dz-account-spinner" />
              ) : (
                <FaPlus />
              )}
              <span>Add Passkey</span>
            </button>
          </div>

          <p className="dz-account-passkey-description">
            Sign in securely without entering your password, using a
            supported device or security key.
          </p>

          {passkeyError && (
            <div className="dz-account-passkey-message error" role="alert">
              {passkeyError}
            </div>
          )}

          {passkeyMessage && (
            <div className="dz-account-passkey-message success" role="status">
              {passkeyMessage}
            </div>
          )}

          {loadingPasskeys ? (
            <div className="dz-account-state">
              <FaSpinner className="dz-account-spinner" />
              <span>Loading passkeys...</span>
            </div>
          ) : passkeys.length === 0 ? (
            <div className="dz-account-empty">
              <span className="dz-account-empty-icon">
                <FaKey />
              </span>
              <h3>No passkeys yet</h3>
              <p>
                Add a passkey to make signing in to your account easier.
              </p>
            </div>
          ) : (
            <div className="dz-account-passkey-list">
              {passkeys.map((passkey) => {
                const id = passkey._id || passkey.id

                return (
                  <article
                    className="dz-account-passkey-item"
                    key={id || passkey.credentialId}
                  >
                    <span className="dz-account-shortcut-icon">
                      <FaKey />
                    </span>

                    <div className="dz-account-passkey-info">
                      <strong>Passkey</strong>
                      <small>
                        Added {formatDate(passkey.createdAt)}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="dz-account-passkey-delete"
                      onClick={() => deletePasskey(id)}
                      disabled={passkeyBusy || !id}
                      aria-label="Remove passkey"
                      title="Remove passkey"
                    >
                      <FaTrash />
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="dz-account-orders">
          <div className="dz-account-section-heading">
            <div>
              <span className="dz-account-eyebrow">YOUR ACTIVITY</span>
              <h2>My Orders</h2>
            </div>

            <span className="dz-account-order-count">
              {orders.length} order(s)
            </span>
          </div>

          {loadingOrders ? (
            <div className="dz-account-state">
              <FaSpinner className="dz-account-spinner" />
              <span>Loading your orders...</span>
            </div>
          ) : ordersError ? (
            <div className="dz-account-state dz-account-state-error">
              <p>{ordersError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="dz-account-empty">
              <span className="dz-account-empty-icon">
                <FaBoxOpen />
              </span>
              <h3>No orders yet</h3>
              <p>
                Your orders will appear here after your first purchase.
              </p>
              <Link to="/produits" className="dz-account-shop-link">
                Browse Products
                <FaArrowRight />
              </Link>
            </div>
          ) : (
            <div className="dz-account-order-list">
              {orders.map((order) => {
                const status = getStatus(order.statut)
                const StatusIcon = status.icon

                return (
                  <article
                    className="dz-account-order"
                    key={order._id}
                  >
                    <div className="dz-account-order-main">
                      <div className="dz-account-order-icon">
                        <FaBoxOpen />
                      </div>

                      <div className="dz-account-order-details">
                        <strong>
                          Order #
                          {String(order._id || '')
                            .slice(-7)
                            .toUpperCase()}
                        </strong>
                        <span>{formatDate(order.createdAt)}</span>
                        <small>
                          {Array.isArray(order.produits)
                            ? `${order.produits.reduce(
                                (sum, item) =>
                                  sum + Number(item.quantity || 0),
                                0
                              )} item(s)`
                            : 'DZShop Order'}
                        </small>
                      </div>
                    </div>

                    <div className="dz-account-order-side">
                      <strong className="dz-account-order-price">
                        {formatPrice(order.total)}
                      </strong>

                      <span
                        className={`dz-account-order-status ${status.className}`}
                      >
                        <StatusIcon />
                        {status.label}
                      </span>

                      {order._id && (
                        <Link
                          to={`/commande/${order._id}`}
                          className="dz-account-order-link"
                        >
                          Details
                          <FaArrowRight />
                        </Link>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AccountPage
