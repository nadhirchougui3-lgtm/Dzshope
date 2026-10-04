import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch, lireJson } from './api'
import {
  FaCheck,
  FaBoxOpen,
  FaTruck,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa'
import './OrderSuccessPage.css'

function OrderSuccessPage() {
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(function () {
    async function chargerCommande() {
      try {
        const reponse = await apiFetch('/api/orders/' + id)
        const data = await lireJson(reponse)

        setOrder(data)
      } catch (error) {
        setErreur(error.message)
      } finally {
        setChargement(false)
      }
    }

    chargerCommande()
  }, [id])

  if (chargement) {
    return (
      <div className="dz-order-result">
        <div className="dz-order-loading">
          Loading your order...
        </div>
      </div>
    )
  }

  if (erreur || !order) {
    return (
      <div className="dz-order-result">
        <div className="dz-order-error">
          <h1>Order Not Found</h1>
          <p>{erreur || 'Unable to find this order.'}</p>
          <Link to="/produits">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dz-order-result">

      <div className="dz-order-success-card">

        <div className="dz-order-success-icon">
          <FaCheck />
        </div>

        <span className="dz-order-success-label">
          DZSHOP
        </span>

        <h1>Order Confirmed</h1>

        <p>
          Thank you for your order. We have received your request
          and will contact you for confirmation.
        </p>

        <div className="dz-order-number">
          <span>Order Number</span>
          <strong>#{order._id}</strong>
        </div>

        <div className="dz-order-details">

          <div className="dz-order-detail">
            <FaTruck />
            <div>
              <span>Delivery</span>
              <strong>
                {order.livraison === 'domicile'
                  ? 'Home Delivery'
                  : 'Office Delivery'}
              </strong>
            </div>
          </div>

          <div className="dz-order-detail">
            <FaBoxOpen />
            <div>
              <span>Payment</span>
              <strong>Cash on Delivery</strong>
            </div>
          </div>

          <div className="dz-order-detail">
            <FaMapMarkerAlt />
            <div>
              <span>Address</span>
              <strong>
                {order.commune}, {order.wilaya}
              </strong>
            </div>
          </div>

          <div className="dz-order-detail">
            <FaPhone />
            <div>
              <span>Phone</span>
              <strong>{order.telephone}</strong>
            </div>
          </div>

        </div>

        <div className="dz-order-total">
          <span>Total</span>
          <strong>
            {order.total.toLocaleString('fr-FR')} DA
          </strong>
        </div>

        <div className="dz-order-actions">
          <Link to="/produits">
            Continue Shopping
          </Link>

          <Link to="/panier">
            Shopping Bag
          </Link>
        </div>

      </div>

    </div>
  )
}

export default OrderSuccessPage ;