import { NavLink, Outlet, Link } from 'react-router-dom'
import './Admin.css'

function classeLien({ isActive }) {
  return `admin-nav-link${isActive ? ' active' : ''}`
}

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar-header">
          <div className="admin-brand-mark">DZ</div>

          <div className="admin-brand-info">
            <h2 className="admin-sidebar-title">
              DZ<span className="admin-sidebar-shop">Shop</span>
            </h2>
            <p className="admin-sidebar-subtitle">Administration</p>
          </div>
        </Link>

        <div className="admin-sidebar-section">
          <span className="admin-sidebar-section-label">
            MENU PRINCIPAL
          </span>

          <nav className="admin-nav">
            <NavLink className={classeLien} to="/admin" end>
              <span className="admin-nav-icon" aria-hidden="true">▦</span>
              <span>Tableau de bord</span>
            </NavLink>

            <NavLink className={classeLien} to="/admin/commandes">
              <span className="admin-nav-icon" aria-hidden="true">≡</span>
              <span>Commandes</span>
            </NavLink>

            <NavLink className={classeLien} to="/admin/produits">
              <span className="admin-nav-icon" aria-hidden="true">□</span>
              <span>Produits</span>
            </NavLink>

            <NavLink className={classeLien} to="/admin/utilisateurs">
              <span className="admin-nav-icon" aria-hidden="true">♙</span>
              <span>Utilisateurs</span>
            </NavLink>
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-account">
            <div className="admin-account-avatar">A</div>

            <div className="admin-account-info">
              <strong>Administrateur</strong>
              <span>Accès sécurisé</span>
            </div>

            <span
              className="admin-account-status"
              aria-label="Compte actif"
            />
          </div>

          <Link className="admin-store-link" to="/">
            <span className="admin-store-link-icon" aria-hidden="true">
              ←
            </span>
            <span>Retour à la boutique</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div>
              <span className="admin-topbar-label">ESPACE ADMIN</span>
              <h1 className="admin-topbar-title">
                Gestion de la boutique
              </h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-live-status">
              <span className="admin-status-dot" />

              <div className="admin-live-status-info">
                <strong>Administration</strong>
                <span>Système actif</span>
              </div>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default AdminLayout
