import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaCheck,
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaStar
} from 'react-icons/fa'
import { apiFetch, lireJson } from './api'
import './LandingPage.css'

function LandingPage() {
  const [products, setProducts] = useState([])

  useEffect(function () {
    apiFetch('/api/products')
      .then(lireJson)
      .then(function (data) {
        setProducts(Array.isArray(data) ? data.slice(0, 4) : [])
      })
      .catch(function () {
        setProducts([])
      })
  }, [])

  return (
    <div className="dz-landing">
      <section className="dz-editorial-hero">
        <div className="dz-hero-inner">
          <div className="dz-hero-copy">
            <span className="dz-eyebrow">
              DZSHOP
            </span>

            <div className="dz-hero-line"></div>

            <h1>
              Quality products.
              <span> Better shopping.</span>
            </h1>

            <p>
              Discover carefully selected products designed
              to make everyday shopping simple, reliable and
              enjoyable.
            </p>

            <div className="dz-hero-actions">
              <Link
                to="/produits"
                className="dz-primary-button"
              >
                Shop Now
                <FaArrowRight />
              </Link>

              <Link
                to="/categories"
                className="dz-secondary-button"
              >
                Explore Categories
              </Link>
            </div>

            <div className="dz-hero-trust">
              <span>
                <FaCheck />
                Quality
              </span>

              <span>
                <FaCheck />
                Price
              </span>

              <span>
                <FaCheck />
                Trust
              </span>
            </div>
          </div>

          <div className="dz-hero-visual">
            <div className="dz-hero-frame">
              <div className="dz-hero-frame-main">
                <div className="dz-hero-frame-label">
                  SELECTED COLLECTION
                </div>

                <div className="dz-hero-frame-content">
                  <span>EVERYDAY</span>
                  <strong>ESSENTIALS</strong>
                </div>

                <div className="dz-hero-frame-number">
                  01
                </div>
              </div>

              <div className="dz-hero-frame-side">
                <span>ALGERIA</span>
                <span>2026</span>
              </div>
            </div>

            <div className="dz-hero-accent"></div>
          </div>
        </div>
      </section>

      <section className="dz-category-section">
        <div className="dz-section-container">
          <div className="dz-section-heading">
            <div>
              <span className="dz-section-eyebrow">
                COLLECTIONS
              </span>

              <h2>
                Shop by category
              </h2>
            </div>

            <Link to="/categories">
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="dz-category-grid">
            <Link
              to="/produits?categorie=Vêtements"
              className="dz-category-tile dz-category-fashion"
            >
              <span>01</span>
              <div>
                <small>STYLE</small>
                <h3>Fashion</h3>
              </div>
            </Link>

            <Link
              to="/produits?categorie=Maquillage"
              className="dz-category-tile dz-category-beauty"
            >
              <span>02</span>
              <div>
                <small>BEAUTY</small>
                <h3>Beauty</h3>
              </div>
            </Link>

            <Link
              to="/produits?categorie=Maison"
              className="dz-category-tile dz-category-home"
            >
              <span>03</span>
              <div>
                <small>LIVING</small>
                <h3>Home</h3>
              </div>
            </Link>

            <Link
              to="/produits?categorie=Bureau"
              className="dz-category-tile dz-category-office"
            >
              <span>04</span>
              <div>
                <small>WORK</small>
                <h3>Office</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="dz-featured-section">
        <div className="dz-section-container">
          <div className="dz-section-heading">
            <div>
              <span className="dz-section-eyebrow">
                CURATED FOR YOU
              </span>

              <h2>
                Featured products
              </h2>
            </div>

            <Link to="/produits">
              Discover all
              <FaArrowRight />
            </Link>
          </div>

          {products.length > 0 && (
            <div className="dz-featured-grid">
              {products.map(function (product) {
                const imagePath =
                  product.categorie === 'Maquillage' &&
                  product.image
                    ? product.image.replace(
                        '/images/products/makeup/',
                        '/images/products/'
                      )
                    : product.image

                return (
                  <Link
                    key={product._id}
                    to={'/produit/' + product._id}
                    className="dz-featured-card"
                  >
                    <div className="dz-featured-image">
                      {imagePath ? (
                        <img
                          src={imagePath}
                          alt={product.nom}
                        />
                      ) : (
                        <div className="dz-featured-placeholder">
                          DZ
                        </div>
                      )}

                      <span>
                        {product.categorie}
                      </span>
                    </div>

                    <div className="dz-featured-info">
                      <small>
                        {product.categorie}
                      </small>

                      <h3>
                        {product.nom}
                      </h3>

                      <div className="dz-featured-bottom">
                        <strong>
                          {product.prix.toLocaleString('fr-FR')} DA
                        </strong>

                        <span>
                          <FaArrowRight />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {products.length === 0 && (
            <div className="dz-featured-empty">
              <p>
                Discover our complete product collection.
              </p>

              <Link to="/produits">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="dz-values-section">
        <div className="dz-section-container">
          <div className="dz-values-intro">
            <span className="dz-section-eyebrow">
              THE DZSHOP PROMISE
            </span>

            <h2>
              A simpler way to shop.
            </h2>

            <p>
              Everything you need for a smooth shopping
              experience, from discovery to delivery.
            </p>
          </div>

          <div className="dz-values-grid">
            <div className="dz-value-card">
              <div className="dz-value-icon">
                <FaShippingFast />
              </div>

              <span>01</span>

              <h3>
                Fast Delivery
              </h3>

              <p>
                Reliable delivery throughout Algeria.
              </p>
            </div>

            <div className="dz-value-card">
              <div className="dz-value-icon">
                <FaShieldAlt />
              </div>

              <span>02</span>

              <h3>
                Secure Shopping
              </h3>

              <p>
                A protected and trustworthy shopping experience.
              </p>
            </div>

            <div className="dz-value-card">
              <div className="dz-value-icon">
                <FaHeadset />
              </div>

              <span>03</span>

              <h3>
                Customer Support
              </h3>

              <p>
                Support whenever you need assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dz-review-section">
        <div className="dz-review-inner">
          <span className="dz-section-eyebrow">
            CUSTOMER EXPERIENCE
          </span>

          <div className="dz-review-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <blockquote>
            “Quality products, simple ordering and a shopping
            experience built around trust.”
          </blockquote>

          <span className="dz-review-label">
            THE DZSHOP STANDARD
          </span>
        </div>
      </section>
    </div>
  )
}

export default LandingPage ;