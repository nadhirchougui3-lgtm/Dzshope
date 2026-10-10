import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import { formatDate, formatPrix } from '../../utils/format'

function AdminUsers() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [recherche, setRecherche] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('tous')
  const [filtreRole, setFiltreRole] = useState('tous')

  function charger() {
    setChargement(true)
    setErreur('')

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

  function obtenirMonId() {
    try {
      const utilisateurConnecte = JSON.parse(
        localStorage.getItem('user') || '{}'
      )

      return utilisateurConnecte.id || utilisateurConnecte._id || ''
    } catch {
      return ''
    }
  }

  const monId = obtenirMonId()

  const actifs = utilisateurs.filter(function (u) {
    return Boolean(u.actif)
  }).length

  const bloques = utilisateurs.filter(function (u) {
    return !u.actif
  }).length

  const admins = utilisateurs.filter(function (u) {
    return u.role === 'admin'
  }).length

  const utilisateursFiltres = utilisateurs.filter(function (u) {
    const terme = recherche.trim().toLowerCase()

    const correspondRecherche =
      !terme ||
      [u.nom, u.telephone, u.email].some(function (valeur) {
        return String(valeur || '')
          .toLowerCase()
          .includes(terme)
      })

    const correspondStatut =
      filtreStatut === 'tous' ||
      (filtreStatut === 'actifs' && Boolean(u.actif)) ||
      (filtreStatut === 'bloques' && !u.actif)

    const correspondRole =
      filtreRole === 'tous' || u.role === filtreRole

    return (
      correspondRecherche &&
      correspondStatut &&
      correspondRole
    )
  })

  async function changerStatut(user) {
    const nouveauStatut = !user.actif

    const confirmation = window.confirm(
      nouveauStatut
        ? 'Réactiver le compte de ' + user.nom + ' ?'
        : 'Bloquer le compte de ' + user.nom + ' ?'
    )

    if (!confirmation) return

    try {
      const reponse = await apiFetch(
        '/api/admin/users/' + user._id + '/statut',
        {
          method: 'PATCH',
          body: JSON.stringify({ actif: nouveauStatut }),
        }
      )

      const misAJour = await lireJson(reponse)

      setUtilisateurs(function (liste) {
        return liste.map(function (u) {
          return u._id === user._id
            ? { ...u, actif: misAJour.actif }
            : u
        })
      })
    } catch (err) {
      alert(err.message || 'Impossible de modifier le statut')
    }
  }

  async function changerRole(user) {
    if (user._id === monId) {
      alert('Tu ne peux pas modifier ton propre rôle.')
      return
    }

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

      const misAJour = await lireJson(reponse)

      setUtilisateurs(function (liste) {
        return liste.map(function (u) {
          return u._id === user._id
            ? { ...u, role: misAJour.role }
            : u
        })
      })
    } catch (err) {
      alert(err.message || 'Impossible de modifier le rôle')
    }
  }

  async function supprimer(user) {
    if (user._id === monId || user.role === 'admin') {
      alert('Cette opération n’est pas autorisée.')
      return
    }

    if (
      !window.confirm(
        'Supprimer définitivement le compte de ' +
          user.nom +
          ' ? Cette action est irréversible.'
      )
    ) {
      return
    }

    try {
      await apiFetch('/api/admin/users/' + user._id, {
        method: 'DELETE',
      })

      setUtilisateurs(function (liste) {
        return liste.filter(function (u) {
          return u._id !== user._id
        })
      })
    } catch (err) {
      alert(err.message || 'Impossible de supprimer cet utilisateur')
    }
  }

  if (chargement) return <Chargement />

  return (
    <section className="admin-users-page">
      <header className="admin-page-header admin-users-page-header">
        <div>
          <span className="admin-page-eyebrow">
            GESTION DE LA BOUTIQUE
          </span>

          <h1 className="admin-page-title">
            Utilisateurs <span>({utilisateurs.length})</span>
          </h1>

          <p className="admin-page-description">
            Gérez les comptes clients, les accès et les rôles de votre boutique.
          </p>
        </div>

        <button
          type="button"
          className="admin-button admin-button-secondary admin-users-refresh"
          onClick={charger}
        >
          Actualiser la liste
        </button>
      </header>

      {erreur && (
        <div
          className="admin-alert admin-alert-danger admin-users-error"
          role="alert"
        >
          <span>{erreur}</span>

          <button
            type="button"
            className="admin-button admin-button-secondary"
            onClick={charger}
          >
            Réessayer
          </button>
        </div>
      )}

      <section
        className="admin-users-stats"
        aria-label="Statistiques des utilisateurs"
      >
        <article className="admin-users-stat admin-users-stat-total">
          <div className="admin-users-stat-top">
            <span className="admin-users-stat-label">
              Total utilisateurs
            </span>
            <span className="admin-users-stat-marker" aria-hidden="true">
              U
            </span>
          </div>

          <strong className="admin-users-stat-value">
            {utilisateurs.length}
          </strong>

          <span className="admin-users-stat-caption">
            Comptes enregistrés
          </span>
        </article>

        <article className="admin-users-stat admin-users-stat-active">
          <div className="admin-users-stat-top">
            <span className="admin-users-stat-label">
              Comptes actifs
            </span>
            <span className="admin-users-stat-marker" aria-hidden="true">
              +
            </span>
          </div>

          <strong className="admin-users-stat-value">{actifs}</strong>

          <span className="admin-users-stat-caption">
            Accès autorisé
          </span>
        </article>

        <article className="admin-users-stat admin-users-stat-blocked">
          <div className="admin-users-stat-top">
            <span className="admin-users-stat-label">
              Comptes bloqués
            </span>
            <span className="admin-users-stat-marker" aria-hidden="true">
              !
            </span>
          </div>

          <strong className="admin-users-stat-value">{bloques}</strong>

          <span className="admin-users-stat-caption">
            Accès suspendu
          </span>
        </article>

        <article className="admin-users-stat admin-users-stat-admins">
          <div className="admin-users-stat-top">
            <span className="admin-users-stat-label">
              Administrateurs
            </span>
            <span className="admin-users-stat-marker" aria-hidden="true">
              A
            </span>
          </div>

          <strong className="admin-users-stat-value">{admins}</strong>

          <span className="admin-users-stat-caption">
            Accès de gestion
          </span>
        </article>
      </section>

      <section className="admin-card admin-users-card">
        <div className="admin-card-header admin-users-card-header">
          <div>
            <span className="admin-section-eyebrow">
              COMPTES ET ACCÈS
            </span>

            <h2 className="admin-card-title">
              Liste des utilisateurs
            </h2>

            <p className="admin-card-subtitle">
              {utilisateursFiltres.length} résultat(s) sur{' '}
              {utilisateurs.length} compte(s)
            </p>
          </div>

          <span className="admin-users-total-label">
            {utilisateurs.length} compte(s)
          </span>
        </div>

        <div className="admin-users-toolbar">
          <div className="admin-users-search">
            <span
              className="admin-users-search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              type="search"
              value={recherche}
              onChange={function (event) {
                setRecherche(event.target.value)
              }}
              placeholder="Nom, téléphone ou email..."
              aria-label="Rechercher un utilisateur"
            />

            {recherche && (
              <button
                type="button"
                onClick={function () {
                  setRecherche('')
                }}
                aria-label="Effacer la recherche"
              >
                ×
              </button>
            )}
          </div>

          <select
            className="admin-users-role-filter"
            value={filtreRole}
            onChange={function (event) {
              setFiltreRole(event.target.value)
            }}
            aria-label="Filtrer par rôle"
          >
            <option value="tous">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>

        <div
          className="admin-users-tabs"
          role="group"
          aria-label="Filtrer par statut"
        >
          <button
            type="button"
            className={filtreStatut === 'tous' ? 'active' : ''}
            aria-pressed={filtreStatut === 'tous'}
            onClick={function () {
              setFiltreStatut('tous')
            }}
          >
            Tous <span>{utilisateurs.length}</span>
          </button>

          <button
            type="button"
            className={filtreStatut === 'actifs' ? 'active' : ''}
            aria-pressed={filtreStatut === 'actifs'}
            onClick={function () {
              setFiltreStatut('actifs')
            }}
          >
            Actifs <span>{actifs}</span>
          </button>

          <button
            type="button"
            className={filtreStatut === 'bloques' ? 'active' : ''}
            aria-pressed={filtreStatut === 'bloques'}
            onClick={function () {
              setFiltreStatut('bloques')
            }}
          >
            Bloqués <span>{bloques}</span>
          </button>
        </div>

        {utilisateursFiltres.length === 0 ? (
          <div className="admin-empty-state admin-users-empty">
            <strong>Aucun utilisateur trouvé</strong>

            <p>
              Essaie de modifier ta recherche ou les filtres sélectionnés.
            </p>

            {(recherche ||
              filtreStatut !== 'tous' ||
              filtreRole !== 'tous') && (
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={function () {
                  setRecherche('')
                  setFiltreStatut('tous')
                  setFiltreRole('tous')
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="admin-users-table-scroll">
            <div className="admin-table-wrapper">
              <table className="admin-table admin-users-table">
                <thead>
                  <tr>
                    <th scope="col">Client</th>
                    <th scope="col">Rôle</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Commandes</th>
                    <th scope="col">Total dépensé</th>
                    <th scope="col">Inscrit le</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {utilisateursFiltres.map(function (u) {
                    const cestMoi = u._id === monId

                    return (
                      <tr key={u._id}>
                        <td className="admin-users-client-cell">
                          <strong className="admin-users-client-name">
                            {u.nom || 'Utilisateur'}
                          </strong>

                          <span className="admin-users-client-contact">
                            {u.telephone || u.email || 'Aucun contact'}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              'admin-badge ' +
                              (u.role === 'admin'
                                ? 'admin-badge-role-admin'
                                : 'admin-badge-secondary')
                            }
                          >
                            {u.role === 'admin' ? 'Admin' : 'Client'}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              'admin-badge ' +
                              (u.actif
                                ? 'admin-badge-success'
                                : 'admin-badge-danger')
                            }
                          >
                            <span
                              className="admin-users-status-dot"
                              aria-hidden="true"
                            />
                            {u.actif ? 'Actif' : 'Bloqué'}
                          </span>
                        </td>

                        <td>{u.nbCommandes ?? 0}</td>

                        <td className="admin-users-spent">
                          {formatPrix(u.totalDepense ?? 0)}
                        </td>

                        <td className="admin-users-date">
                          {formatDate(u.createdAt)}
                        </td>

                        <td>
                          <div className="admin-users-actions">
                            <button
                              type="button"
                              className={
                                'admin-button admin-button-small ' +
                                (u.actif
                                  ? 'admin-button-secondary'
                                  : 'admin-button-primary')
                              }
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
                              className="admin-button admin-button-small admin-button-secondary"
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
                              className="admin-button admin-button-small admin-button-danger"
                              disabled={cestMoi || u.role === 'admin'}
                              title={
                                u.role === 'admin'
                                  ? 'La suppression des administrateurs est interdite'
                                  : cestMoi
                                    ? 'Tu ne peux pas supprimer ton propre compte'
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
          </div>
        )}
      </section>
    </section>
  )
}

export default AdminUsers
