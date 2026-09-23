import { Link } from 'react-router-dom'
import './CategoriesPage.css'

function CategoriesPage() {
  const categories = [
    {
      nom: 'Vêtements',
      label: 'Clothing',
      emoji: '👕',
      description: 'Discover our clothing collection.'
    },
    {
      nom: 'Chaussures',
      label: 'Shoes',
      emoji: '👟',
      description: 'Discover our shoe collection.'
    },
    {
      nom: 'Sacs',
      label: 'Bags',
      emoji: '🎒',
      description: 'Discover our bags collection.'
    },
    {
      nom: 'Montres',
      label: 'Watches',
      emoji: '⌚',
      description: 'Discover our watches collection.'
    },
    {
      nom: 'Téléphones',
      label: 'Phones',
      emoji: '📱',
      description: 'Discover our phones collection.'
    },
    {
      nom: 'Audio',
      label: 'Audio',
      emoji: '🎧',
      description: 'Discover our audio products.'
    },
    {
      nom: 'Ordinateurs',
      label: 'Computers',
      emoji: '💻',
      description: 'Discover our computers collection.'
    },
    {
      nom: 'Gaming',
      label: 'Gaming',
      emoji: '🎮',
      description: 'Discover our gaming products.'
    },
    {
      nom: 'Soins personnels',
      label: 'Personal Care',
      emoji: '🧴',
      description: 'Discover our personal care products.'
    },
    {
      nom: 'Accessoires',
      label: 'Accessories',
      emoji: '🕶️',
      description: 'Discover our accessories collection.'
    },
    {
      nom: 'Sport',
      label: 'Sports',
      emoji: '⚽',
      description: 'Discover our sports products.'
    },
    {
      nom: 'Maquillage',
      label: 'Makeup',
      emoji: '💄',
      description: 'Discover our makeup collection.'
    }
  ]

  return (
    <div className="dz-categories-page">

      <div className="dz-categories-header">

        <span className="dz-categories-label">
          DZSHOP
        </span>

        <h1>
          Our Categories
        </h1>

        <p>
          Explore our different product categories.
        </p>

      </div>

      <div className="dz-categories-grid">

        {categories.map(function (categorie) {
          return (
            <Link
              key={categorie.nom}
              to={'/produits?categorie=' + encodeURIComponent(categorie.nom)}
              className="dz-category-link"
            >

              <div className="dz-category-card">

                <div className="dz-category-emoji">
                  {categorie.emoji}
                </div>

                <div className="dz-category-content">

                  <span>
                    {categorie.nom}
                  </span>

                  <h2>
                    {categorie.label}
                  </h2>

                  <p>
                    {categorie.description}
                  </p>

                </div>

                <div className="dz-category-arrow">
                  →
                </div>

              </div>

            </Link>
          )
        })}

      </div>

    </div>
  )
}

export default CategoriesPage ;