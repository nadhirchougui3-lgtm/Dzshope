import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from './api';
import { useCart } from './CartContext';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [produit, setProduit] = useState(null);
  const [chargement, setChargement] = useState(true);

  // On demande CE produit au serveur
  useEffect(function () {
    apiFetch('/api/products/' + id)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        setProduit(data);
        setChargement(false);
      })
      .catch(function () { setChargement(false); });
  }, [id]);

  if (chargement) {
    return <p className="container py-5">Chargement...</p>;
  }

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