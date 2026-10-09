
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingBag, FaArrowRight, FaTrash } from 'react-icons/fa'
import { useFavorites } from './FavoritesContext'
import './FavoritesPage.css'

function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div className="dz-favorites-page">
      <div className="dz-favorites-container">
        <header className="dz-favorites-header">
          <div>
            <span className="dz-favorites-eyebrow">YOUR COLLECTION</span>
            <h1>Mes <span>favoris</span></h1>
            <p>All the products you have saved in one place.</p>
          </div>

          <div className="dz-favorites-count">
            <FaHeart />
            <strong>{favorites.length}</strong>
            <span>{favorites.length === 1 ? 'Product' : 'Products'}</span>
          </div>
        </header>

        {favorites.length > 0 ? (
          <div className="dz-favorites-grid">
            {favorites.map((product) => {
              const id = product._id || product.id
              const imagePath =
                product.categorie === 'Maquillage' && product.image
                  ? product.image.replace(
                      '/images/products/makeup/',
                      '/images/products/'
                    )
                  : product.image

              return (
                <article className="dz-favorite-card" key={id}>
                  <Link
                    className="dz-favorite-image"
                    to={`/produit/${id}`}
                  >
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={product.nom || 'Product'}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <span className="dz-favorite-no-image">
                        <FaShoppingBag />
                      </span>
                    )}

                    <span className="dz-favorite-category">
                      {product.categorie || 'Product'}
                    </span>
                  </Link>

                  <div className="dz-favorite-content">
                    <span className="dz-favorite-type">
                      {product.categorie || 'DZShop'}
                    </span>

                    <h2>
                      <Link to={`/produit/${id}`}>
                        {product.nom || 'Unnamed product'}
                      </Link>
                    </h2>

                    <div className="dz-favorite-meta">
                      <strong>
                        {Number(product.prix || 0).toLocaleString('fr-FR')} DA
                      </strong>

                      <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
                        {product.stock > 0 ? 'Available' : 'Out of stock'}
                      </span>
                    </div>

                    <div className="dz-favorite-actions">
                      <Link to={`/produit/${id}`} className="dz-favorite-view">
                        View Product <FaArrowRight />
                      </Link>

                      <button
                        type="button"
                        className="dz-favorite-remove"
                        onClick={() => removeFavorite(product)}
                        aria-label={`Remove ${product.nom || 'product'} from favorites`}
                        title="Remove from favorites"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="dz-favorites-empty">
            <FaHeart />
            <h2>Your favorites are waiting</h2>
            <p>Save products you like by selecting the heart on a product card.</p>
            <Link to="/produits">Explore Products <FaArrowRight /></Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage 