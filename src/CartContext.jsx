
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

function panierSauvegarde() {
  try {
    const brut = localStorage.getItem('dzshop-panier')
    const donnees = brut ? JSON.parse(brut) : []

    if (!Array.isArray(donnees)) {
      return []
    }

    return donnees.filter(function (item) {
      return (
        item &&
        typeof item._id === 'string' &&
        item._id.length > 0 &&
        Number.isFinite(Number(item.prix)) &&
        Number(item.prix) >= 0 &&
        Number.isFinite(Number(item.stock)) &&
        Number(item.stock) > 0 &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) >= 1
      )
    }).map(function (item) {
      return {
        ...item,
        prix: Number(item.prix),
        stock: Number(item.stock),
        quantity: Math.min(
          Math.floor(Number(item.quantity)),
          Number(item.stock)
        ),
        taille: item.taille || '',
        couleur: item.couleur || ''
      }
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState(panierSauvegarde)

  useEffect(function () {
    try {
      localStorage.setItem(
        'dzshop-panier',
        JSON.stringify(cartItems)
      )
    } catch {
      // La boutique reste utilisable même si le stockage échoue.
    }
  }, [cartItems])

  function addToCart(
    product,
    quantity = 1,
    taille = '',
    couleur = ''
  ) {
    if (!user) {
      return false
    }

    const productId = String(product?._id || product?.id || '')
    const stock = Number(product?.stock)
    const prix = Number(product?.prix)

    if (
      !productId ||
      !Number.isFinite(stock) ||
      stock <= 0 ||
      !Number.isFinite(prix) ||
      prix < 0
    ) {
      return false
    }

    const safeQuantity = Math.min(
      Math.max(1, Math.floor(Number(quantity) || 1)),
      Math.floor(stock)
    )

    if (safeQuantity < 1) {
      return false
    }

    setCartItems(function (items) {
      const existingProduct = items.find(function (item) {
        return (
          String(item._id) === productId &&
          (item.taille || '') === taille &&
          (item.couleur || '') === couleur
        )
      })

      if (existingProduct) {
        const newQuantity = Math.min(
          Number(existingProduct.quantity) + safeQuantity,
          stock
        )

        return items.map(function (item) {
          if (
            String(item._id) === productId &&
            (item.taille || '') === taille &&
            (item.couleur || '') === couleur
          ) {
            return {
              ...item,
              ...product,
              _id: productId,
              prix,
              stock,
              taille,
              couleur,
              quantity: newQuantity
            }
          }

          return item
        })
      }

      return [
        ...items,
        {
          ...product,
          _id: productId,
          prix,
          stock,
          quantity: safeQuantity,
          taille,
          couleur
        }
      ]
    })

    return true
  }

  function removeFromCart(
    id,
    taille = '',
    couleur = ''
  ) {
    setCartItems(function (items) {
      return items.filter(function (item) {
        return !(
          String(item._id) === String(id) &&
          (item.taille || '') === taille &&
          (item.couleur || '') === couleur
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
          String(item._id) === String(id) &&
          (item.taille || '') === taille &&
          (item.couleur || '') === couleur
        ) {
          const stock = Math.floor(Number(item.stock) || 0)

          if (stock < 1) {
            return {
              ...item,
              quantity: 0
            }
          }

          const safeQuantity = Math.min(
            Math.max(1, Math.floor(Number(quantity) || 1)),
            stock
          )

          return {
            ...item,
            quantity: safeQuantity
          }
        }

        return item
      }).filter(function (item) {
        return item.quantity > 0
      })
    })
  }

  function clearCart() {
    setCartItems([])
  }

  const total = cartItems.reduce(function (sum, item) {
    return sum + Number(item.prix || 0) * Number(item.quantity || 0)
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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext)
}
