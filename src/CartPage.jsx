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
        <h1>Ton panier est vide</h1>
        <p>Ajoute des produits pour commencer tes achats.</p>
        <Link to="/" className="dz-shop-btn">
          Continuer mes achats
        </Link>
      </div>
    )
  }

  return (
    <div className="dz-cart-page">

      <div className="dz-cart-header">
        <div>
          <span className="dz-cart-label">DZSHOP</span>
          <h1>Votre panier</h1>
          <p>{cartItems.length} produit(s) dans votre panier</p>
        </div>

        <FaShoppingCart className="dz-cart-header-icon" />
      </div>

      <div className="dz-cart-layout">

        <div className="dz-cart-products">

          {cartItems.map(function (item) {
            return (
              <div
                key={item._id}
                className="dz-cart-product"
              >

                <img
                  src={item.image}
                  alt={item.nom}
                  className="dz-cart-product-image"
                />

                <div className="dz-cart-product-info">

                  <h3>{item.nom}</h3>

                  <span className="dz-cart-price">
                    {item.prix.toLocaleString('fr-FR')} DA
                  </span>

                  <div className="dz-cart-actions">

                    <div className="dz-cart-quantity">

                      <button
                        onClick={function () {
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1)
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
                            item.quantity + 1
                          )
                        }}
                      >
                        +
                      </button>

                    </div>

                    <Link
                      to={`/products/${item._id}`}
                      className="dz-view-btn"
                    >
                      View
                    </Link>

                    <button
                      className="dz-delete-btn"
                      onClick={function () {
                        removeFromCart(item._id)
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

            <h2>Résumé</h2>

            <div className="dz-summary-line">
              <span>Sous-total</span>
              <strong>
                {total.toLocaleString('fr-FR')} DA
              </strong>
            </div>

            <div className="dz-summary-line">
              <span>Livraison</span>
              <span className="dz-free">GRATUITE</span>
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
              <span>Livraison rapide</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Paiement sécurisé</span>
            </div>

            <div>
              <FaUndo />
              <span>Retour facile</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CartPage ;