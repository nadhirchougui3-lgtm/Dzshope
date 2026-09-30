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

        <Link to="/" className="dz-logo">
          <div className="dz-logo-mark">
            DZ
          </div>

          <div className="dz-logo-text">
            <div className="dz-shop-name">
              DZ<span>Shop</span>
            </div>

            <div className="dz-tagline">
              Quality · Price · Trust
            </div>
          </div>
        </Link>

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
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </div>

            <span>Shopping Bag</span>
          </NavLink>

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
                Sign Out
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
                <span>Sign In</span>
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

export default Navbar ;