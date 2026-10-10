import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import StatutBadge from '../../components/StatutBadge'
import {
  formatDate,
  formatPrix,
  referenceCommande,
  STATUTS,
} from '../../utils/format'

function AdminOrders() {
  const [commandes, setCommandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [commandeEnCours, setCommandeEnCours] = useState(null)

  useEffect(function () {
    apiFetch('/api/orders')
      .then(lireJson)
      .then(setCommandes)
      .catch(function () {
        setErreur('Impossible de charger les commandes')
      })
      .finally(function () {
        setChargement(false)
      })
  }, [])

  async function changerStatut(id, statut) {
    setErreur('')
    setCommandeEnCours(id)

    try {
      const reponse = await apiFetch('/api/orders/' + id + '/statut', {
        method: 'PATCH',
        body: JSON.stringify({ statut }),
      })

      const commande = await lireJson(reponse)

      setCommandes(function (anciennes) {
        return anciennes.map(function (c) {
          return c._id === id ? commande : c
        })
      })
    } catch (err) {
      setErreur(err.message || 'Impossible de modifier le statut')
    } finally {
      setCommandeEnCours(null)
    }
  }

  if (chargement) return <Chargement />

  return (
    <div className="admin-orders-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">GESTION COMMERCIALE</span>

          <h1 className="admin-page-title">
            Commandes <span>({commandes.length})</span>
          </h1>

          <p className="admin-page-description">
            Consultez les commandes, les coordonnées de livraison et suivez
            leur état.
          </p>
        </div>

        <div className="admin-orders-summary">
          <span className="admin-orders-summary-label">
            Total des commandes
          </span>
          <strong>{commandes.length}</strong>
        </div>
      </header>

      {erreur && (
        <div className="admin-alert admin-alert-danger" role="alert">
          {erreur}
        </div>
      )}

      <section className="admin-card admin-orders-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-section-eyebrow">SUIVI DES VENTES</span>
            <h2 className="admin-card-title">Toutes les commandes</h2>
            <p className="admin-card-subtitle">
              Modifiez le statut de chaque commande depuis la liste.
            </p>
          </div>
        </div>

        {commandes.length === 0 ? (
          <div className="admin-empty-state">
            Aucune commande à afficher pour le moment.
          </div>
        ) : (
          <div className="admin-orders-table-scroll">
            <div className="admin-table-wrapper">
              <table className="admin-table admin-orders-table">
                <thead>
                  <tr>
                    <th scope="col">Commande</th>
                    <th scope="col">Client</th>
                    <th scope="col">Livraison</th>
                    <th scope="col">Articles</th>
                    <th scope="col">Total</th>
                    <th scope="col">Statut</th>
                  </tr>
                </thead>

                <tbody>
                  {commandes.map(function (c) {
                    return (
                      <tr key={c._id}>
                        <td>
                          <div className="admin-order-cell">
                            <strong className="admin-order-reference">
                              {referenceCommande(c._id)}
                            </strong>

                            <span className="admin-order-date">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-order-cell">
                            <strong className="admin-order-customer">
                              {c.nom || 'Client'}
                            </strong>

                            <span className="admin-order-secondary">
                              {c.telephone || 'Téléphone non renseigné'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-order-cell admin-order-delivery">
                            <strong>
                              {c.wilaya || 'Wilaya non renseignée'}
                            </strong>

                            <span className="admin-order-secondary">
                              {c.livraison || 'Mode non renseigné'}
                            </span>

                            <span className="admin-order-address">
                              {c.adresse || 'Adresse non renseignée'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-order-items">
                            {(c.produits || []).map(function (l, index) {
                              return (
                                <div
                                  className="admin-order-item"
                                  key={l._id || `${l.nom}-${index}`}
                                >
                                  <span className="admin-order-item-name">
                                    {l.nom}
                                  </span>

                                  <span className="admin-order-item-quantity">
                                    × {l.quantity}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </td>

                        <td>
                          <strong className="admin-order-total">
                            {formatPrix(c.total)}
                          </strong>
                        </td>

                        <td>
                          <div className="admin-order-status">
                            <StatutBadge statut={c.statut} />

                            <select
                              className="admin-status-select"
                              aria-label={
                                'Modifier le statut de la commande ' +
                                referenceCommande(c._id)
                              }
                              value={c.statut}
                              disabled={commandeEnCours === c._id}
                              onChange={function (e) {
                                changerStatut(c._id, e.target.value)
                              }}
                            >
                              {STATUTS.map(function (s) {
                                return (
                                  <option key={s.valeur} value={s.valeur}>
                                    {s.libelle}
                                  </option>
                                )
                              })}
                            </select>

                            {commandeEnCours === c._id && (
                              <span className="admin-order-updating">
                                Mise à jour...
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminOrders
