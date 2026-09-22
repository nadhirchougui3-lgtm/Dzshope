import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
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
    <>
      <section className="dz-hero">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">

            <div className="col-lg-6">

              <span className="dz-collection-badge">
                ✨ Discover our collection
              </span>

              <h1 className="dz-hero-title">
                Find what you need,
                <span> simply.</span>
              </h1>

              <p className="dz-hero-text">
                Discover our carefully selected products,
                enjoy great prices and get your order delivered
                directly to your home.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">

                <Link to="/produits" className="dz-main-button">
                  🛍️ Our Products
                </Link>

                <a href="#categories" className="dz-outline-button">
                  View Categories
                </a>

              </div>

              <div className="row g-3">

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">🚚</div>
                    <h6>Delivery to 69 wilayas</h6>
                    <small>
                      Receive your order anywhere in Algeria.
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">💵</div>
                    <h6>Cash on delivery</h6>
                    <small>
                      Pay only when you receive your order.
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">↩️</div>
                    <h6>7-day returns</h6>
                    <small>
                      Return your order within 7 days.
                    </small>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-6">

              <div className="dz-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"
                  className="dz-hero-image"
                  alt="Our products"
                />

                <div className="dz-delivery-badge">

                  <div className="dz-delivery-icon">
                    🚚
                  </div>

                  <div>
                    <strong>Delivery everywhere</strong>
                    <small>
                      69 wilayas 🇩🇿
                    </small>
                  </div>

                </div>

                <div className="dz-secure-badge">
                  ✓ Secure Shopping
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      <section id="categories" className="dz-categories">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="dz-section-title">
              Our Categories
            </h2>

            <p className="dz-section-text">
              Explore our different product categories.
            </p>

          </div>

          <div className="row g-4">

            {categories.map(function (categorie) {
              return (
                <div
                  className="col-md-6 col-lg-4"
                  key={categorie.nom}
                >

                  <Link
                    to={'/produits?categorie=' + encodeURIComponent(categorie.nom)}
                    className="dz-category-link"
                  >

                    <div className="dz-category-card">

                      <div className="dz-category-emoji">
                        {categorie.emoji}
                      </div>

                      <h5>
                        {categorie.label}
                      </h5>

                      <p>
                        {categorie.description}
                      </p>

                      <div className="dz-arrow">
                        →
                      </div>

                    </div>

                  </Link>

                </div>
              )
            })}

          </div>

        </div>

      </section>
    </>
  )
}

export default LandingPage;