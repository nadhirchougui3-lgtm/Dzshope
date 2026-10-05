import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
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
      <h1 className="h3 mb-4">Commandes ({commandes.length})</h1>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table align-middle mb-0">
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
                    <b>{referenceCommande(c._id)}</b>
                    <div className="text-muted small">{formatDate(c.createdAt)}</div>
                  </td>
                  <td>
                    {c.nom}
                    <div className="text-muted small">{c.telephone}</div>
                  </td>
                  <td className="small">
                    {c.wilaya} ({c.livraison})
                    <div className="text-muted">{c.adresse}</div>
                  </td>
                  <td className="small">
                    {c.produits
                      .map(function (l) {
                        return l.nom + ' × ' + l.quantity
                      })
                      .join(', ')}
                  </td>
                  <td className="fw-semibold">{formatPrix(c.total)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
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
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminOrders
