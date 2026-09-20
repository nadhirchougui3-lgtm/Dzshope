import { Link } from 'react-router-dom';
function Navbar() {
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
              <Link className="navbar-brand" to="/">🛒 DZShope</Link>
            <div className="navbar-nav">
              <Link className="nav-link text-white" to="/">Home</Link>
              <Link className="nav-link text-white" to="/produits">Produits</Link>
              <Link className="nav-link text-white" to="/">Contact</Link>
              <Link className="nav-link text-white" to="/panier">🛒Panier</Link>
              <Link className="nav-link text-white" to="/singup">Sign Up</Link>
            </div>
          </div>
      </nav>
    );
}
export default Navbar;