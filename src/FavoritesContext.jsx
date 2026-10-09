
import { createContext, useContext, useEffect, useState } from 'react'

const FavoritesContext = createContext(null)
const FAVORITES_KEY = 'dzshop_favorites'

function readFavorites() {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)
    const parsed = saved ? JSON.parse(saved) : []

    return Array.isArray(parsed)
      ? parsed.filter((product) => product && (product._id || product.id))
      : []
  } catch {
    return []
  }
}

function productId(product) {
  return String(product?._id || product?.id || '')
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Unable to save favorites:', error)
    }
  }, [favorites])

  function isFavorite(product) {
    const id = productId(product)
    return Boolean(id) && favorites.some((item) => productId(item) === id)
  }

  function toggleFavorite(product) {
    const id = productId(product)
    if (!id) return

    setFavorites((current) => {
      const exists = current.some((item) => productId(item) === id)

      if (exists) {
        return current.filter((item) => productId(item) !== id)
      }

      return [product, ...current]
    })
  }

  function removeFavorite(product) {
    const id = productId(product)
    if (!id) return

    setFavorites((current) =>
      current.filter((item) => productId(item) !== id)
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider')
  }

  return context
}