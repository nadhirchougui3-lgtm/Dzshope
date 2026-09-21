import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="dz-hero">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">

            <div className="col-lg-6">

              <span className="dz-collection-badge">
                ✨ Découvrez notre collection
              </span>

              <h1 className="dz-hero-title">
                Trouvez ce qu'il vous faut,
                <span> simplement.</span>
              </h1>

              <p className="dz-hero-text">
                Découvrez nos produits sélectionnés avec soin,
                profitez de prix avantageux et faites-vous livrer
                directement chez vous.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">

                <Link to="/produits" className="dz-main-button">
                  🛍️ Nos produits
                </Link>

                <a href="#categories" className="dz-outline-button">
                  Voir les catégories
                </a>

              </div>

              <div className="row g-3">

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">🚚</div>

                    <h6>Livraison 69 wilayas</h6>

                    <small>
                      Recevez votre commande partout en Algérie.
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">💵</div>

                    <h6>Paiement à la livraison</h6>

                    <small>
                      Vous payez uniquement à la réception.
                    </small>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="dz-feature-card">
                    <div className="dz-feature-icon">↩️</div>

                    <h6>Retour sous 7 jours</h6>

                    <small>
                      Retournez votre commande sous 7 jours.
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
                  alt="Nos produits"
                />

                <div className="dz-delivery-badge">

                  <div className="dz-delivery-icon">
                    🚚
                  </div>

                  <div>
                    <strong>Livraison partout</strong>

                    <small>
                      69 wilayas 🇩🇿
                    </small>
                  </div>

                </div>

                <div className="dz-secure-badge">
                  ✓ Achat sécurisé
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="dz-categories">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="dz-section-title">
              Nos catégories
            </h2>

            <p className="dz-section-text">
              Découvrez nos différentes catégories de produits.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <Link to="/produits" className="dz-category-link">

                <div className="dz-category-card">

                  <div className="dz-category-emoji">
                    📱
                  </div>

                  <h5>Téléphones</h5>

                  <p>
                    Découvrez nos smartphones.
                  </p>

                  <div className="dz-arrow">
                    →
                  </div>

                </div>

              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/produits" className="dz-category-link">

                <div className="dz-category-card">

                  <div className="dz-category-emoji">
                    🎧
                  </div>

                  <h5>Audio</h5>

                  <p>
                    Casques et accessoires audio.
                  </p>

                  <div className="dz-arrow">
                    →
                  </div>

                </div>

              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/produits" className="dz-category-link">

                <div className="dz-category-card">

                  <div className="dz-category-emoji">
                    ⌨️
                  </div>

                  <h5>Accessoires</h5>

                  <p>
                    Découvrez nos accessoires.
                  </p>

                  <div className="dz-arrow">
                    →
                  </div>

                </div>

              </Link>
            </div>

          </div>

        </div>

      </section>
    </>
  )
}

export default LandingPage