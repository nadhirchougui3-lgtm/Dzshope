import { useCart } from './CartContext'
import { Link } from 'react-router-dom'
import {
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTrash
} from 'react-icons/fa'
import './CartPage.css'

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    total
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="dz-cart-empty">
        <FaShoppingCart className="dz-empty-icon" />
        <h1>Your Shopping Bag Is Empty</h1>
        <p>Add products to start shopping.</p>
        <Link to="/" className="dz-shop-btn">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="dz-cart-page">

      <div className="dz-cart-header">
        <div>
          <span className="dz-cart-label">DZSHOP</span>
          <h1>Your Shopping Bag</h1>
          <p>{cartItems.length} item(s) in your shopping bag</p>
        </div>

        <FaShoppingCart className="dz-cart-header-icon" />
      </div>

      <div className="dz-cart-layout">

        <div className="dz-cart-products">

          {cartItems.map(function (item) {
            return (
              <div
                key={item._id + '-' + item.taille}
                className="dz-cart-product"
              >

                <img
                  src={item.image || null}
                  alt={item.nom}
                  className="dz-cart-product-image"
                />

                <div className="dz-cart-product-info">

                  <h3>{item.nom}</h3>

                  {item.taille && (
                    <div className="dz-cart-size">
                      {item.categorie === 'Chaussures'
                        ? 'Shoe Size'
                        : 'Size'}: <strong>{item.taille}</strong>
                    </div>
                  )}

                  <span className="dz-cart-price">
                    {item.prix.toLocaleString('fr-FR')} DA
                  </span>

                  <div className="dz-cart-actions">

                    <div className="dz-cart-quantity">

                      <button
                        onClick={function () {
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1),
                            item.taille
                          )
                        }}
                      >
                        −
                      </button>

                      <strong>{item.quantity}</strong>

                      <button
                        onClick={function () {
                          updateQuantity(
                            item._id,
                            item.quantity + 1,
                            item.taille
                          )
                        }}
                      >
                        +
                      </button>

                    </div>

                    <Link
                      to={`/produit/${item._id}`}
                      className="dz-view-btn"
                    >
                      View
                    </Link>

                    <button
                      className="dz-delete-btn"
                      onClick={function () {
                        removeFromCart(item._id, item.taille)
                      }}
                    >
                      <FaTrash />
                      Delete
                    </button>

                  </div>

                </div>

                <strong className="dz-product-total">
                  {(item.prix * item.quantity).toLocaleString('fr-FR')} DA
                </strong>

              </div>
            )
          })}

        </div>

        <div className="dz-cart-summary">

          <div className="dz-summary-card">

            <h2>Summary</h2>

            <div className="dz-summary-line">
              <span>Subtotal</span>
              <strong>
                {total.toLocaleString('fr-FR')} DA
              </strong>
            </div>

            <div className="dz-summary-line">
              <span>Shipping</span>
              <span className="dz-free">FREE</span>
            </div>

            <hr />

            <div className="dz-summary-total">
              <span>Total</span>
              <strong>
                {total.toLocaleString('fr-FR')} DA
              </strong>
            </div>

            <Link
              to="/checkout"
              className="dz-checkout-btn"
            >
              Checkout
            </Link>

          </div>

          <div className="dz-benefits">

            <div>
              <FaTruck />
              <span>Fast Delivery</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Payment</span>
            </div>

            <div>
              <FaUndo />
              <span>Easy Returns</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CartPage ;