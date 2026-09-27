import { NavLink, Link } from 'react-router-dom'
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaPhone,
  FaUserPlus,
  FaUser
} from 'react-icons/fa'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import './navbar.css'

function Navbar() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()

  const cartCount = cartItems.reduce(function (total, item) {
    return total + item.quantity
  }, 0)

  return (
    <nav className="dz-navbar">
      <div className="dz-navbar-container">

        {/* LOGO */}
        <Link to="/" className="dz-logo">
          <div className="dz-logo-mark">
            DZ
          </div>

          <div className="dz-logo-text">
            <div className="dz-shop-name">
              DZ<span>Shop</span>
            </div>

            <div className="dz-tagline">
              Qualité · Prix · Confiance
            </div>
          </div>
        </Link>

        {/* NAVIGATION */}
        <div className="dz-nav-links">

          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaHome />
            <span>Home</span>
          </NavLink>

          {/* PRODUITS */}
          <NavLink
            to="/produits"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaShoppingBag />
            <span>Produits</span>
          </NavLink>

          {/* CONTACT */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              'dz-nav-link ' + (isActive ? 'active' : '')
            }
          >
            <FaPhone />
            <span>Contact</span>
          </NavLink>

          {/* PANIER */}
          <NavLink
            to="/panier"
            className={({ isActive }) =>
              'dz-nav-link cart-link ' + (isActive ? 'active' : '')
            }
          >
            <div className="cart-icon-wrapper">
              <FaShoppingCart />

              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </div>

            <span>Panier</span>
          </NavLink>

          {/* CONNEXION / COMPTE */}
          {user ? (
            <>
              <span className="dz-nav-link">
                <FaUser />
                <span>{user.nom}</span>
              </span>
              <button
                type="button"
                className="dz-nav-link"
                style={{ background: 'none', border: 'none' }}
                onClick={logout}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  'dz-nav-link ' + (isActive ? 'active' : '')
                }
              >
                <FaUser />
                <span>Connexion</span>
              </NavLink>

              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  'dz-nav-link ' + (isActive ? 'active' : '')
                }
              >
                <FaUserPlus />
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