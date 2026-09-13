import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    function addToCart(product) {
        setCartItems(function (prev) {
        const existant = prev.find(function (item) { return item.id === product.id; });
        if (existant) {
            return prev.map(function (item) {
            return item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
    }
        return [...prev, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCartItems(function (prev) {
      return prev.filter(function (item) { return item.id !== id; });
    });
  }

  const total = cartItems.reduce(function (sum, item) { return sum + item.prix * item.quantity; }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { 
return useContext(CartContext);
}