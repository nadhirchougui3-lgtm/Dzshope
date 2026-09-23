import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import { apiFetch, lireJson } from './api'
import { FaArrowLeft, FaLock, FaTruck } from 'react-icons/fa'
import './CheckoutPage.css'

function CheckoutPage() {
  const { cartItems, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: '',
    telephone: '',
    wilaya: '',
    commune: '',
    adresse: '',
    livraison: 'domicile'
  })

  const [chargement, setChargement] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm(function (previous) {
      return {
        ...previous,
        [name]: value
      }
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (cartItems.length === 0) {
      return
    }

    setChargement(true)

    try {
      const produits = cartItems.map(function (item) {
        return {
          productId: item._id,
          nom: item.nom,
          prix: item.prix,
          quantity: item.quantity,
          image: item.image
        }
      })

      const reponse = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          produits,
          total
        })
      })

      await lireJson(reponse)

      clearCart()
      navigate('/panier')
    } catch (error) {
      alert(error.message)
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="dz-checkout-page">

      <div className="dz-checkout-header">

        <Link to="/panier" className="dz-back-link">
          <FaArrowLeft />
          Retour au panier
        </Link>

        <div>
          <span className="dz-checkout-label">DZSHOP</span>
          <h1>Finaliser la commande</h1>
          <p>Complétez vos informations de livraison</p>
        </div>

      </div>

      <div className="dz-checkout-layout">

        <div className="dz-checkout-form">

          <form
            className="dz-checkout-card"
            onSubmit={handleSubmit}
          >

            <div className="dz-section-title">
              <div>
                <span>01</span>
                <h2>Informations de livraison</h2>
              </div>
            </div>

            <div className="dz-checkout-fields">

              <div className="dz-field">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div className="dz-field">
                <label>Numéro de téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="05 XX XX XX XX"
                  required
                />
              </div>

              <div className="dz-field">
                <label>Wilaya</label>
                <select
                  name="wilaya"
                  value={form.wilaya}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir une wilaya</option>
                  <option value="Alger">Alger</option>
                  <option value="Constantine">Constantine</option>
                  <option value="Skikda">Skikda</option>
                  <option value="Annaba">Annaba</option>
                  <option value="Oran">Oran</option>
                  <option value="Sétif">Sétif</option>
                  <option value="Blida">Blida</option>
                  <option value="Batna">Batna</option>
                </select>
              </div>

              <div className="dz-field">
                <label>Commune</label>
                <input
                  type="text"
                  name="commune"
                  value={form.commune}
                  onChange={handleChange}
                  placeholder="Votre commune"
                  required
                />
              </div>

            </div>

            <div className="dz-field dz-address-field">
              <label>Adresse</label>
              <textarea
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                placeholder="Votre adresse complète"
                required
              />
            </div>

            <div className="dz-section-title dz-delivery-title">
              <div>
                <span>02</span>
                <h2>Mode de livraison</h2>
              </div>
            </div>

            <div className="dz-delivery-options">

              <button
                type="button"
                className={
                  form.livraison === 'domicile'
                    ? 'dz-delivery-option active'
                    : 'dz-delivery-option'
                }
                onClick={function () {
                  setForm(function (previous) {
                    return {
                      ...previous,
                      livraison: 'domicile'
                    }
                  })
                }}
              >
                <strong>
                  <FaTruck />
                </strong>

                <span>
                  <b>Livraison à domicile</b>
                  Livraison rapide à votre adresse
                </span>
              </button>

              <button
                type="button"
                className={
                  form.livraison === 'bureau'
                    ? 'dz-delivery-option active'
                    : 'dz-delivery-option'
                }
                onClick={function () {
                  setForm(function (previous) {
                    return {
                      ...previous,
                      livraison: 'bureau'
                    }
                  })
                }}
              >
                <strong>
                  <FaTruck />
                </strong>

                <span>
                  <b>Livraison au bureau</b>
                  Retrait auprès du transporteur
                </span>
              </button>

            </div>

            <button
              type="submit"
              className="dz-confirm-order-btn"
              disabled={chargement || cartItems.length === 0}
            >
              {chargement
                ? 'Création de la commande...'
                : 'Confirmer la commande'}
            </button>

          </form>

        </div>

        <div className="dz-checkout-summary">

          <div className="dz-checkout-summary-card">

            <h2>Votre commande</h2>

            <div className="dz-checkout-items">

              {cartItems.map(function (item) {
                return (
                  <div
                    key={item._id}
                    className="dz-checkout-item"
                  >

                    <img
                      src={item.image}
                      alt={item.nom}
                    />

                    <div>
                      <h3>{item.nom}</h3>
                      <span>Quantité : {item.quantity}</span>
                    </div>

                    <strong>
                      {(item.prix * item.quantity).toLocaleString('fr-FR')} DA
                    </strong>

                  </div>
                )
              })}

            </div>

            <div className="dz-checkout-total">
              <span>Total</span>

              <strong>
                {total.toLocaleString('fr-FR')} DA
              </strong>
            </div>

            <div className="dz-secure-checkout">
              <FaLock />
              <span>Paiement à la livraison</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CheckoutPage ;