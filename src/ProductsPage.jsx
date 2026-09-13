import { Link } from 'react-router-dom';
import { products } from './data/products';

function ProductsPage() {
  return (
    <div className="container py-5">
      <h1>Nos produits</h1>
      <div className="row g-4">
        {products.map(function (p) {
          return (
            <div className="col-md-4" key={p.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5>{p.nom}</h5>
                  <p className="text-muted">{p.description}</p>
                  <p><strong>{p.prix.toLocaleString('fr-FR')} DA</strong></p>
                  <Link className="btn btn-primary" to={'/produit/' + p.id}>Voir le produit</Link>
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