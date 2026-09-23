import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  function addToCart(product, quantity = 1) {
    setCartItems(function (items) {
      const existingProduct = items.find(function (item) {
        return item._id === product._id
      })

      if (existingProduct) {
        return items.map(function (item) {
          if (item._id === product._id) {
            return {
              ...item,
              quantity: item.quantity + quantity
            }
          }

          return item
        })
      }

      return [
        ...items,
        {
          ...product,
          quantity: quantity
        }
      ]
    })
  }

  function removeFromCart(id) {
    setCartItems(function (items) {
      return items.filter(function (item) {
        return item._id !== id
      })
    })
  }

  function updateQuantity(id, quantity) {
    setCartItems(function (items) {
      return items.map(function (item) {
        if (item._id === id) {
          return {
            ...item,
            quantity: quantity
          }
        }

        return item
      })
    })
  }

  function clearCart() {
    setCartItems([])
  }

  const total = cartItems.reduce(function (sum, item) {
    return sum + item.prix * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}