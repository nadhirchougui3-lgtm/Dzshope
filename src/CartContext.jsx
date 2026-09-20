import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    // Au démarrage, on relit le panier sauvegardé (il survit au F5)
    const [cartItems, setCartItems] = useState(function () {
        try {
            const sauvegarde = localStorage.getItem('panier');
            return sauvegarde ? JSON.parse(sauvegarde) : [];
        } catch {
            return [];
        }
    });

    // À chaque changement du panier, on le sauvegarde
    useEffect(function () {
        localStorage.setItem('panier', JSON.stringify(cartItems));
    }, [cartItems]);

    function addToCart(product) {
        setCartItems(function (prev) {
        const existant = prev.find(function (item) { return item._id === product._id; });
        if (existant) {
            return prev.map(function (item) {
            return item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
    }
        return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCartItems(function (prev) {
      return prev.filter(function (item) { return item._id !== id; });
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  const total = cartItems.reduce(function (sum, item) { return sum + item.prix * item.quantity; }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { 
return useContext(CartContext);
}