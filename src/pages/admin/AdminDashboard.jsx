import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import BarChart from '../../components/BarChart'
import Chargement from '../../components/Chargement'
import StatutBadge from '../../components/StatutBadge'
import { formatDate, formatPrix, referenceCommande } from '../../utils/format'

function Carte(props) {
  return (
    <div className="col-6 col-xl-3">
      <div className="admin-stat-card h-100">
        <div className="admin-stat-label">{props.titre}</div>
        <div className="admin-stat-value">{props.valeur}</div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  useEffect(function () {
    apiFetch('/api/admin/stats')
      .then(lireJson)
      .then(setStats)
      .catch(function (err) { setErreur(err.message) })
      .finally(function () { setChargement(false) })
  }, [])

  if (chargement) return <Chargement />

  if (erreur || !stats) {
    return (
      <div className="admin-alert admin-alert-danger">
        {erreur || 'Erreur'}
      </div>
    )
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tableau de bord</h1>
        <p className="admin-page-description">
          Vue d'ensemble de l'activité de votre boutique
        </p>
      </div>

      <div className="row g-3 mb-4">
        <Carte
          titre="Chiffre d'affaires (livré)"
          valeur={formatPrix(stats.chiffreAffaires)}
        />

        <Carte
          titre="Commandes"
          valeur={stats.nbCommandes}
        />

        <Carte
          titre="En attente"
          valeur={stats.enAttente}
        />

        <Carte
          titre="Clients"
          valeur={stats.nbClients}
        />
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Ventes des 7 derniers jours</h2>
              </div>
            </div>

            <BarChart data={stats.ventes7j} />
          </div>
        </div>

        <div className="col-xl-4">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Produits les plus vendus</h2>
              </div>
            </div>

            {stats.topProduits.length === 0 && (
              <p className="text-muted mb-0">
                Pas encore de vente livrée.
              </p>
            )}

            {stats.topProduits.map(function (p, index) {
              return (
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  key={index}
                >
                  <span>
                    #{index + 1} {p.nom}
                  </span>

                  <strong className="admin-stat-accent">
                    {p.quantite}
                  </strong>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-xl-7">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Dernières commandes</h2>
              </div>
            </div>

            {stats.dernieresCommandes.length === 0 && (
              <p className="text-muted mb-0">
                Aucune commande.
              </p>
            )}

            {stats.dernieresCommandes.map(function (c) {
              return (
                <div
                  className="d-flex justify-content-between align-items-center border-bottom py-3"
                  key={c._id}
                >
                  <div>
                    <b>{referenceCommande(c._id)}</b> · {c.nom}
                    <small className="text-muted">
                      {' '}· {formatDate(c.createdAt)}
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span>{formatPrix(c.total)}</span>
                    <StatutBadge statut={c.statut} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-xl-5">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Stock faible</h2>
                <p className="admin-card-subtitle">
                  Produits avec 5 unités ou moins
                </p>
              </div>
            </div>

            {stats.stockFaible.length === 0 && (
              <p className="text-muted mb-0">
                Tout va bien.
              </p>
            )}

            {stats.stockFaible.map(function (p) {
              return (
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  key={p._id}
                >
                  <span>{p.nom}</span>

                  <span
                    className={
                      'admin-badge ' +
                      (p.stock === 0
                        ? 'admin-badge-danger'
                        : 'admin-badge-warning')
                    }
                  >
                    {p.stock}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
