import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

// Relit le panier sauvegardé dans le navigateur (localStorage), s'il existe.
// Si jamais le contenu est corrompu ou absent, on repart d'un panier vide
// (mieux vaut un panier vide qu'un site qui plante à l'ouverture).
function panierSauvegarde() {
  try {
    const brut = localStorage.getItem('dzshop-panier')
    return brut ? JSON.parse(brut) : []
  } catch (erreur) {
    return []
  }
}

export function CartProvider({ children }) {
  // On donne une FONCTION à useState (pas un tableau direct) : elle n'est
  // exécutée qu'UNE SEULE FOIS, au tout premier rendu.
  const [cartItems, setCartItems] = useState(panierSauvegarde)

  // À chaque changement du panier, on le réenregistre dans le navigateur.
  useEffect(function () {
    localStorage.setItem('dzshop-panier', JSON.stringify(cartItems))
  }, [cartItems])

  function addToCart(
    product,
    quantity = 1,
    taille = '',
    couleur = ''
  ) {
    setCartItems(function (items) {
      const existingProduct = items.find(function (item) {
        return (
          item._id === product._id &&
          item.taille === taille &&
          item.couleur === couleur
        )
      })

      if (existingProduct) {
        const newQuantity = Math.min(
          existingProduct.quantity + quantity,
          product.stock
        )

        return items.map(function (item) {
          if (
            item._id === product._id &&
            item.taille === taille &&
            item.couleur === couleur
          ) {
            return {
              ...item,
              quantity: newQuantity
            }
          }

          return item
        })
      }

      const safeQuantity = Math.min(
        Math.max(1, quantity),
        product.stock
      )

      if (safeQuantity <= 0) {
        return items
      }

      return [
        ...items,
        {
          ...product,
          quantity: safeQuantity,
          taille: taille,
          couleur: couleur
        }
      ]
    })
  }

  function removeFromCart(
    id,
    taille = '',
    couleur = ''
  ) {
    setCartItems(function (items) {
      return items.filter(function (item) {
        return !(
          item._id === id &&
          item.taille === taille &&
          item.couleur === couleur
        )
      })
    })
  }

  function updateQuantity(
    id,
    quantity,
    taille = '',
    couleur = ''
  ) {
    setCartItems(function (items) {
      return items.map(function (item) {
        if (
          item._id === id &&
          item.taille === taille &&
          item.couleur === couleur
        ) {
          const safeQuantity = Math.min(
            Math.max(1, quantity),
            item.stock
          )

          return {
            ...item,
            quantity: safeQuantity
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

