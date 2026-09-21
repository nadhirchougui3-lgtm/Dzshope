import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(function () {
    try {
      const sauvegarde = localStorage.getItem('panier')
      return sauvegarde ? JSON.parse(sauvegarde) : []
    } catch {
      return []
    }
  })

  useEffect(function () {
    localStorage.setItem('panier', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(product, quantity = 1) {
    setCartItems(function (prev) {
      const existant = prev.find(function (item) {
        return item._id === product._id
      })

      if (existant) {
        return prev.map(function (item) {
          return item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        })
      }

      return [...prev, { ...product, quantity }]
    })
  }

  function removeFromCart(id) {
    setCartItems(function (prev) {
      return prev.filter(function (item) {
        return item._id !== id
      })
    })
  }

  function clearCart() {
    setCartItems([])
  }

  function updateQuantity(id, quantity) {
    setCartItems(function (prev) {
      return prev.map(function (item) {
        return item._id === id
          ? { ...item, quantity }
          : item
      })
    })
  }

  const total = cartItems.reduce(function (sum, item) {
    return sum + item.prix * item.quantity
  }, 0)

  const cartCount = cartItems.reduce(function (sum, item) {
    return sum + item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        total,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}