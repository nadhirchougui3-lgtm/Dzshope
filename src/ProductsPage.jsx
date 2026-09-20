import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, lireJson } from './api';

function ProductsPage() {

  // Les produits viennent maintenant du serveur (MongoDB)
  const [products, setProducts] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(function () {
    apiFetch('/api/products')
      .then(lireJson)
      .then(function (data) { setProducts(data); })
      .catch(function (err) { console.error(err); })
      .finally(function () { setChargement(false); });
  }, []);

  return (
    <div className="container py-5">
      <h1>Nos produits</h1>
      {chargement && <p className="text-muted">Chargement...</p>}
      <div className="row g-4">
        {products.map(function (p) {
          return (
            <div className="col-md-4" key={p._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5>{p.nom}</h5>
                  <p className="text-muted">{p.description}</p>
                  <p><strong>{p.prix.toLocaleString('fr-FR')} DA</strong></p>
                  <Link className="btn btn-primary" to={'/produit/' + p._id}>Voir le produit</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsPage;