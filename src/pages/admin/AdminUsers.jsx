import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import { formatDate, formatPrix } from '../../utils/format'

function AdminUsers() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  function charger() {
    apiFetch('/api/admin/users')
      .then(lireJson)
      .then(setUtilisateurs)
      .catch(function () {
        setErreur('Impossible de charger les utilisateurs')
      })
      .finally(function () {
        setChargement(false)
      })
  }

  useEffect(function () {
    charger()
  }, [])

  // Bloque ou réactive un compte
  async function changerStatut(user) {
    try {
      const reponse = await apiFetch(
        '/api/admin/users/' + user._id + '/statut',
        {
          method: 'PATCH',
          body: JSON.stringify({ actif: !user.actif }),
        }
      )

      const majour = await lireJson(reponse)

      setUtilisateurs(function (liste) {
        return liste.map(function (u) {
          return u._id === user._id
            ? { ...u, actif: majour.actif }
            : u
        })
      })
    } catch (err) {
      alert(err.message)
    }
  }

  // Passe un client en admin, ou un admin en client
  async function changerRole(user) {
    const nouveauRole =
      user.role === 'admin' ? 'client' : 'admin'

    if (
      !window.confirm(
        'Faire de ' + user.nom + ' un ' + nouveauRole + ' ?'
      )
    ) {
      return
    }

    try {
      const reponse = await apiFetch(
        '/api/admin/users/' + user._id + '/role',
        {
          method: 'PATCH',
          body: JSON.stringify({ role: nouveauRole }),
        }
      )

      const majour = await lireJson(reponse)

      setUtilisateurs(function (liste) {
        return liste.map(function (u) {
          return u._id === user._id
            ? { ...u, role: majour.role }
            : u
        })
      })
    } catch (err) {
      alert(err.message)
    }
  }

  // Supprime un compte client
  async function supprimer(user) {
    if (
      !window.confirm(
        'Supprimer définitivement ' + user.nom + ' ?'
      )
    ) {
      return
    }

    try {
      await apiFetch(
        '/api/admin/users/' + user._id,
        { method: 'DELETE' }
      )

      setUtilisateurs(function (liste) {
        return liste.filter(function (u) {
          return u._id !== user._id
        })
      })
    } catch (err) {
      alert(err.message)
    }
  }

  if (chargement) return <Chargement />

  return (
    <>
      <h1 className="h3 mb-4">
        Utilisateurs ({utilisateurs.length})
      </h1>

      {erreur && (
        <div className="alert alert-danger">
          {erreur}
        </div>
      )}

      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Client</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Commandes</th>
              <th>Total dépensé</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {utilisateurs.map(function (u) {
              // C'est TOI, connecté : on désactive les boutons qui te concernent
              const cestMoi =
                u._id ===
                JSON.parse(
                  localStorage.getItem('user') || '{}'
                ).id

              return (
                <tr key={u._id}>
                  <td>
                    {u.nom}
                    <div className="text-muted small">
                      {u.telephone || u.email}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        'badge text-bg-' +
                        (u.role === 'admin'
                          ? 'primary'
                          : 'secondary')
                      }
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        'badge text-bg-' +
                        (u.actif ? 'success' : 'danger')
                      }
                    >
                      {u.actif ? 'actif' : 'bloqué'}
                    </span>
                  </td>

                  <td>{u.nbCommandes}</td>

                  <td>{formatPrix(u.totalDepense)}</td>

                  <td className="small text-muted">
                    {formatDate(u.createdAt)}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        disabled={cestMoi}
                        title={
                          cestMoi
                            ? 'Tu ne peux pas modifier ton propre compte'
                            : ''
                        }
                        onClick={function () {
                          changerStatut(u)
                        }}
                      >
                        {u.actif ? 'Bloquer' : 'Réactiver'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        disabled={cestMoi}
                        title={
                          cestMoi
                            ? 'Tu ne peux pas modifier ton propre compte'
                            : ''
                        }
                        onClick={function () {
                          changerRole(u)
                        }}
                      >
                        {u.role === 'admin'
                          ? 'Rétrograder'
                          : 'Rendre admin'}
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={cestMoi || u.role === 'admin'}
                        title={
                          u.role === 'admin'
                            ? "On ne supprime pas un admin d'ici"
                            : ''
                        }
                        onClick={function () {
                          supprimer(u)
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
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

export default AdminUsers
