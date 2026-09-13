import { useCart } from './CartContext';

function CartPage() {
  const { cartItems, removeFromCart, total } = useCart();

  if (cartItems.length === 0) {
    return <div className="container py-5"><h1>Panier</h1><p>Ton panier est vide.</p></div>;
  }

  return (
    <div className="container py-5">
      <h1>Panier</h1>
      {cartItems.map(function (item) {
        return (
          <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
            <span>{item.nom} — {item.quantity} x {item.prix.toLocaleString('fr-FR')} DA</span>
            <button className="btn btn-sm btn-outline-danger" onClick={function () { removeFromCart(item.id); }}>Retirer</button>
          </div>
        );
      })}
      <h2 className="mt-4">Total : {total.toLocaleString('fr-FR')} DA</h2>
    </div>
  );
}

export default CartPage;