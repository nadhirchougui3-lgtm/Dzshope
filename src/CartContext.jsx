import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  function addToCart(product, quantity = 1, taille = '') {
    setCartItems(function (items) {
      const existingProduct = items.find(function (item) {
        return item._id === product._id && item.taille === taille
      })

      if (existingProduct) {
        return items.map(function (item) {
          if (item._id === product._id && item.taille === taille) {
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
          quantity: quantity,
          taille: taille
        }
      ]
    })
  }

  function removeFromCart(id, taille = '') {
    setCartItems(function (items) {
      return items.filter(function (item) {
        return !(item._id === id && item.taille === taille)
      })
    })
  }

  function updateQuantity(id, quantity, taille = '') {
    setCartItems(function (items) {
      return items.map(function (item) {
        if (item._id === id && item.taille === taille) {
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
