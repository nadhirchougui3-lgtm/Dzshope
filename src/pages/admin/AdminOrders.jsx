import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import StatutBadge from '../../components/StatutBadge'
import { formatDate, formatPrix, referenceCommande, STATUTS } from '../../utils/format'

function AdminOrders() {
  const [commandes, setCommandes] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(function () {
    apiFetch('/api/orders')
      .then(lireJson)
      .then(setCommandes)
      .catch(function () { setErreur('Impossible de charger les commandes') })
      .finally(function () { setChargement(false) })
  }, [])

  async function changerStatut(id, statut) {
    try {
      const reponse = await apiFetch('/api/orders/' + id + '/statut', {
        method: 'PATCH',
        body: JSON.stringify({ statut: statut }),
      })

      const commande = await lireJson(reponse)

      setCommandes(function (anciennes) {
        return anciennes.map(function (c) {
          return c._id === id ? commande : c
        })
      })
    } catch (err) {
      setErreur('Impossible de modifier le statut')
    }
  }

  if (chargement) return <Chargement />

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Commandes ({commandes.length})
        </h1>

        <p className="admin-page-description">
          Consultez et gérez les commandes de votre boutique
        </p>
      </div>

      {erreur && (
        <div className="admin-alert admin-alert-danger">
          {erreur}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Commande</th>
                <th>Client</th>
                <th>Livraison</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {commandes.map(function (c) {
                return (
                  <tr key={c._id}>
                    <td>
                      <strong>{referenceCommande(c._id)}</strong>
                      <div className="text-muted small">
                        {formatDate(c.createdAt)}
                      </div>
                    </td>

                    <td>
                      {c.nom}
                      <div className="text-muted small">
                        {c.telephone}
                      </div>
                    </td>

                    <td>
                      <div>
                        {c.wilaya} ({c.livraison})
                      </div>

                      <div className="text-muted small">
                        {c.adresse}
                      </div>
                    </td>

                    <td>
                      <div className="small">
                        {c.produits
                          .map(function (l) {
                            return l.nom + ' × ' + l.quantity
                          })
                          .join(', ')}
                      </div>
                    </td>

                    <td>
                      <strong>{formatPrix(c.total)}</strong>
                    </td>

                    <td>
                      <div className="d-flex flex-column gap-2">
                        <StatutBadge statut={c.statut} />

                        <select
                          className="admin-status-select"
                          value={c.statut}
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
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AdminOrders