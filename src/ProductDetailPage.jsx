import { useParams, Link } from 'react-router-dom';
import { products } from './data/products';
import { useCart } from './CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const produit = products.find(function (p) { return p.id === Number(id); });

  if (!produit) {
    return (
      <div className="container py-5 text-center">
        <h2>Produit introuvable</h2>
        <Link className="btn btn-primary mt-3" to="/produits">Retour aux produits</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1>{produit.nom}</h1>
      <p className="text-muted">{produit.description}</p>
      <h2>{produit.prix.toLocaleString('fr-FR')} DA</h2>
      <button className="btn btn-primary btn-lg" onClick={function () { addToCart(produit); }}>
        🛒 Ajouter au panier
      </button>
    </div>
  );
}

export default ProductDetailPage;