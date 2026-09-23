import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import { apiFetch, lireJson } from './api'
import { FaArrowLeft, FaLock, FaTruck, FaChevronDown, FaSearch } from 'react-icons/fa'
import wilayas from './data/wilaya-commune.json'
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
  const [wilayaOuverte, setWilayaOuverte] = useState(false)
  const [rechercheWilaya, setRechercheWilaya] = useState('')
  const [rechercheCommune, setRechercheCommune] = useState('')
  const [communeOuverte, setCommuneOuverte] = useState(false)

  function normaliserTexte(texte) {
    return texte
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  const wilayasFiltrees = wilayas.filter(function (wilaya) {
    const nom = wilaya.ascii || ''

    return normaliserTexte(nom).includes(
      normaliserTexte(rechercheWilaya)
    )
  })

  const wilayaSelectionnee = wilayas.find(function (wilaya) {
    return wilaya.ascii === form.wilaya
  })

  const communes = wilayaSelectionnee
    ? wilayaSelectionnee.communes
    : []

  const communesFiltrees = communes
    .filter(function (commune) {
      const nom = commune.ascii || ''

      return normaliserTexte(nom).includes(
        normaliserTexte(rechercheCommune)
      )
    })
    .slice(0, 8)

  function handleChange(event) {
    const { name, value } = event.target

    setForm(function (previous) {
      return {
        ...previous,
        [name]: value
      }
    })
  }

  function choisirWilaya(wilaya) {
    setForm(function (previous) {
      return {
        ...previous,
        wilaya: wilaya.ascii,
        commune: ''
      }
    })

    setRechercheWilaya('')
    setRechercheCommune('')
    setWilayaOuverte(false)
    setCommuneOuverte(false)
  }

  function choisirCommune(commune) {
    setForm(function (previous) {
      return {
        ...previous,
        commune: commune.ascii
      }
    })

    setRechercheCommune(commune.ascii)
    setCommuneOuverte(false)
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
          image: item.image,
          taille: item.taille || ''
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

              <div className="dz-field dz-dropdown-field">
                <label>Wilaya</label>

                <div className="dz-custom-dropdown">

                  <button
                    type="button"
                    className={
                      wilayaOuverte
                        ? 'dz-dropdown-trigger active'
                        : 'dz-dropdown-trigger'
                    }
                    onClick={function () {
                      setWilayaOuverte(!wilayaOuverte)
                      setCommuneOuverte(false)
                    }}
                  >
                    <span>
                      {form.wilaya || 'Choose a wilaya'}
                    </span>

                    <FaChevronDown />
                  </button>

                  {wilayaOuverte && (
                    <div className="dz-dropdown-menu">

                      <div className="dz-dropdown-search">
                        <FaSearch />

                        <input
                          type="text"
                          value={rechercheWilaya}
                          onChange={function (event) {
                            setRechercheWilaya(event.target.value)
                          }}
                          placeholder="Search wilaya..."
                          autoFocus
                        />
                      </div>

                      <div className="dz-dropdown-list">

                        {wilayasFiltrees.length > 0 ? (
                          wilayasFiltrees.map(function (wilaya) {
                            return (
                              <button
                                type="button"
                                key={wilaya.code}
                                className={
                                  form.wilaya === wilaya.ascii
                                    ? 'dz-dropdown-option selected'
                                    : 'dz-dropdown-option'
                                }
                                onClick={function () {
                                  choisirWilaya(wilaya)
                                }}
                              >
                                <span>{wilaya.ascii}</span>

                                <small>
                                  {String(wilaya.code).padStart(2, '0')}
                                </small>
                              </button>
                            )
                          })
                        ) : (
                          <div className="dz-dropdown-empty">
                            No wilaya found
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

              </div>

              <div className="dz-field dz-dropdown-field">
                <label>Commune</label>

                <div className="dz-custom-dropdown">

                  <button
                    type="button"
                    disabled={!form.wilaya}
                    className={
                      communeOuverte
                        ? 'dz-dropdown-trigger active'
                        : 'dz-dropdown-trigger'
                    }
                    onClick={function () {
                      if (!form.wilaya) {
                        return
                      }

                      setCommuneOuverte(!communeOuverte)
                      setWilayaOuverte(false)
                    }}
                  >
                    <span>
                      {form.commune || (
                        form.wilaya
                          ? 'Choose a commune'
                          : 'Choose a wilaya first'
                      )}
                    </span>

                    <FaChevronDown />
                  </button>

                  {communeOuverte && (
                    <div className="dz-dropdown-menu">

                      <div className="dz-dropdown-search">
                        <FaSearch />

                        <input
                          type="text"
                          value={rechercheCommune}
                          onChange={function (event) {
                            setRechercheCommune(event.target.value)
                          }}
                          placeholder="Search commune..."
                          autoFocus
                        />
                      </div>

                      <div className="dz-dropdown-list">

                        {communesFiltrees.length > 0 ? (
                          communesFiltrees.map(function (commune) {
                            return (
                              <button
                                type="button"
                                key={commune.code || commune.ascii}
                                className={
                                  form.commune === commune.ascii
                                    ? 'dz-dropdown-option selected'
                                    : 'dz-dropdown-option'
                                }
                                onClick={function () {
                                  choisirCommune(commune)
                                }}
                              >
                                <span>{commune.ascii}</span>
                              </button>
                            )
                          })
                        ) : (
                          <div className="dz-dropdown-empty">
                            No commune found
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

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
                    key={item._id + '-' + item.taille}
                    className="dz-checkout-item"
                  >

                    <img
                      src={item.image}
                      alt={item.nom}
                    />

                    <div>
                      <h3>{item.nom}</h3>

                      <span>
                        Quantité : {item.quantity}
                      </span>

                      {item.taille && (
                        <span>
                          {item.categorie === 'Chaussures'
                            ? 'Pointure'
                            : 'Taille'} : {item.taille}
                        </span>
                      )}
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