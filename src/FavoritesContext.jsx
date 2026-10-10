
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)
const LEGACY_FAVORITES_KEY = 'dzshop_favorites'

function getUserKey(user) {
  const id = user?._id || user?.id || user?.telephone || user?.email
  return id ? `dzshop_favorites_${String(id)}` : null
}

function readFavorites(key) {
  if (!key) return []

  try {
    const saved = localStorage.getItem(key)
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
  const { user } = useAuth()
  const userKey = getUserKey(user)

  const [favorites, setFavorites] = useState([])
  const [loadedUserKey, setLoadedUserKey] = useState(null)

  useEffect(() => {
    if (!userKey) {
      setFavorites([])
      setLoadedUserKey(null)

      try {
        localStorage.removeItem(LEGACY_FAVORITES_KEY)
      } catch {
        // Ignore storage errors.
      }

      return
    }

    setFavorites(readFavorites(userKey))
    setLoadedUserKey(userKey)
  }, [userKey])

  useEffect(() => {
    if (!userKey || loadedUserKey !== userKey) return

    try {
      localStorage.setItem(userKey, JSON.stringify(favorites))
    } catch (error) {
      console.error('Unable to save favorites:', error)
    }
  }, [favorites, userKey, loadedUserKey])

  const visibleFavorites =
    userKey && loadedUserKey === userKey ? favorites : []

  function isFavorite(product) {
    const id = productId(product)

    return Boolean(userKey && id) &&
      visibleFavorites.some((item) => productId(item) === id)
  }

  function toggleFavorite(product) {
    const id = productId(product)

    if (!userKey || loadedUserKey !== userKey || !id) return

    setFavorites((current) => {
      const exists = current.some((item) => productId(item) === id)

      return exists
        ? current.filter((item) => productId(item) !== id)
        : [product, ...current]
    })
  }

  function removeFavorite(product) {
    const id = productId(product)

    if (!userKey || loadedUserKey !== userKey || !id) return

    setFavorites((current) =>
      current.filter((item) => productId(item) !== id)
    )
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites: visibleFavorites,
        favoriteCount: visibleFavorites.length,
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
