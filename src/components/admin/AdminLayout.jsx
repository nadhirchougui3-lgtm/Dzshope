import { NavLink, Outlet } from 'react-router-dom'

function AdminLayout() {
  function classeLien(info) {
    return 'list-group-item list-group-item-action' + (info.isActive ? ' active' : '')
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-3 col-lg-2">
          <div className="list-group shadow-sm">
            <NavLink className={classeLien} to="/admin" end>
              📊 Tableau de bord
            </NavLink>
            <NavLink className={classeLien} to="/admin/commandes">
              📦 Commandes
            </NavLink>
            <NavLink className={classeLien} to="/admin/produits">
              🛍️ Produits
            </NavLink>
          </div>
        </div>

        <div className="col-md-9 col-lg-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
