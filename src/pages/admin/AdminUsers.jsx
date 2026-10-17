
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

  const [utilisateurMotDePasse, setUtilisateurMotDePasse] = useState(null)
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('')
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('')
  const [chargementMotDePasse, setChargementMotDePasse] = useState(false)
  const [erreurMotDePasse, setErreurMotDePasse] = useState('')
  const [messageMotDePasse, setMessageMotDePasse] = useState('')

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

  function ouvrirReinitialisation(user) {
    if (user._id === monId || user.provider !== 'local') return

    setUtilisateurMotDePasse(user)
    setNouveauMotDePasse('')
    setConfirmationMotDePasse('')
    setErreurMotDePasse('')
    setMessageMotDePasse('')
  }

  function fermerReinitialisation() {
    if (chargementMotDePasse) return

    setUtilisateurMotDePasse(null)
    setNouveauMotDePasse('')
    setConfirmationMotDePasse('')
    setErreurMotDePasse('')
    setMessageMotDePasse('')
  }

  async function confirmerReinitialisation(event) {
    event.preventDefault()
    setErreurMotDePasse('')
    setMessageMotDePasse('')

    if (!utilisateurMotDePasse) return

    if (
      nouveauMotDePasse.length < 8 ||
      nouveauMotDePasse.length > 128
    ) {
      setErreurMotDePasse(
        'Le mot de passe doit contenir entre 8 et 128 caractères.'
      )
      return
    }

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setErreurMotDePasse(
        'Les deux mots de passe ne correspondent pas.'
      )
      return
    }

    setChargementMotDePasse(true)

    try {
      const reponse = await apiFetch(
        '/api/admin/users/' +
          utilisateurMotDePasse._id +
          '/password',
        {
          method: 'PATCH',
          body: JSON.stringify({
            nouveauMotDePasse,
          }),
        }
      )

      const resultat = await lireJson(reponse)

      setMessageMotDePasse(
        resultat.message || 'Mot de passe réinitialisé avec succès.'
      )
      setNouveauMotDePasse('')
      setConfirmationMotDePasse('')
    } catch (err) {
      setErreurMotDePasse(
        err.message || 'Impossible de réinitialiser le mot de passe.'
      )
    } finally {
      setChargementMotDePasse(false)
    }
  }

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

                            {u.provider === 'local' && !cestMoi && (
                              <button
                                type="button"
                                className="admin-button admin-button-small admin-button-secondary"
                                onClick={function () {
                                  ouvrirReinitialisation(u)
                                }}
                              >
                                Reset Password
                              </button>
                            )}

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

      {utilisateurMotDePasse && (
        <div
          onMouseDown={function (event) {
            if (
              event.target === event.currentTarget &&
              !chargementMotDePasse
            ) {
              fermerReinitialisation()
            }
          }}
          onKeyDown={function (event) {
            if (event.key === 'Escape' && !chargementMotDePasse) {
              fermerReinitialisation()
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(28, 28, 30, 0.58)',
            overflowY: 'auto',
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-title"
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              background: '#FFFFFF',
              border: '1px solid #E9E8E6',
              borderRadius: '12px',
              boxShadow: '0 18px 60px rgba(0, 0, 0, 0.18)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span
                  style={{
                    color: '#8B1E2D',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                  }}
                >
                  SÉCURITÉ DU COMPTE
                </span>

                <h2
                  id="reset-password-title"
                  style={{
                    margin: '8px 0',
                    color: '#1C1C1E',
                    fontSize: '23px',
                  }}
                >
                  Reset Password
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#666666',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    overflowWrap: 'anywhere',
                  }}
                >
                  Compte : {utilisateurMotDePasse.nom || 'Utilisateur'}
                </p>
              </div>

              <button
                type="button"
                onClick={fermerReinitialisation}
                disabled={chargementMotDePasse}
                aria-label="Fermer la fenêtre"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#666666',
                  fontSize: '25px',
                  cursor: chargementMotDePasse ? 'not-allowed' : 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {messageMotDePasse ? (
              <div>
                <p
                  role="status"
                  style={{
                    padding: '14px',
                    background: '#F1F8F2',
                    border: '1px solid #CDE7D1',
                    borderRadius: '8px',
                    color: '#245B32',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {messageMotDePasse}
                </p>

                <button
                  type="button"
                  className="admin-button admin-button-primary"
                  onClick={fermerReinitialisation}
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={confirmerReinitialisation}>
                <p
                  style={{
                    margin: '0 0 20px',
                    color: '#666666',
                    fontSize: '13px',
                    lineHeight: 1.7,
                  }}
                >
                  Vérifie l’identité du client avant de modifier son mot de
                  passe. La nouvelle valeur doit contenir entre 8 et 128
                  caractères.
                </p>

                <label
                  htmlFor="nouveau-mot-de-passe"
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#1C1C1E',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Nouveau mot de passe
                </label>

                <input
                  id="nouveau-mot-de-passe"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={nouveauMotDePasse}
                  onChange={function (event) {
                    setNouveauMotDePasse(event.target.value)
                  }}
                  disabled={chargementMotDePasse}
                  style={{
                    width: '100%',
                    minHeight: '46px',
                    padding: '11px 12px',
                    marginBottom: '16px',
                    border: '1px solid #D8D6D3',
                    borderRadius: '7px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                  }}
                />

                <label
                  htmlFor="confirmation-mot-de-passe"
                  style={{
                    display: 'block',
                    marginBottom: '7px',
                    color: '#1C1C1E',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Confirmer le mot de passe
                </label>

                <input
                  id="confirmation-mot-de-passe"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmationMotDePasse}
                  onChange={function (event) {
                    setConfirmationMotDePasse(event.target.value)
                  }}
                  disabled={chargementMotDePasse}
                  style={{
                    width: '100%',
                    minHeight: '46px',
                    padding: '11px 12px',
                    marginBottom: '16px',
                    border: '1px solid #D8D6D3',
                    borderRadius: '7px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                  }}
                />

                {erreurMotDePasse && (
                  <p
                    role="alert"
                    style={{
                      margin: '0 0 16px',
                      padding: '12px',
                      border: '1px solid #E8CACA',
                      borderRadius: '7px',
                      background: '#FFF5F5',
                      color: '#8B1E2D',
                      fontSize: '13px',
                      lineHeight: 1.6,
                    }}
                  >
                    {erreurMotDePasse}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    className="admin-button admin-button-secondary"
                    onClick={fermerReinitialisation}
                    disabled={chargementMotDePasse}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="admin-button admin-button-primary"
                    disabled={chargementMotDePasse}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {chargementMotDePasse
                      ? 'Modification...'
                      : 'Confirmer'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  )
}

export default AdminUsers
