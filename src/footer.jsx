import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="dz-footer">

      <div className="dz-footer-main">

        <div className="dz-footer-brand">
          <Link to="/" className="dz-footer-logo">
            <div className="dz-footer-logo-icon">DZ</div>

            <div>
              <div className="dz-footer-logo-name">
                DZ<span>Shop</span>
              </div>

              <div className="dz-footer-logo-tagline">
                Qualité · Prix · Confiance
              </div>
            </div>
          </Link>

          <p className="dz-footer-description">
            Discover quality products, great prices and a simple
            shopping experience delivered directly to your home.
          </p>
        </div>

        <div className="dz-footer-column">
          <h3>Shop</h3>
          <Link to="/">Home</Link>
          <Link to="/produits">Produits</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/panier">Panier</Link>
        </div>

        <div className="dz-footer-column">
          <h3>Information</h3>
          <Link to="/contact">Contact</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/produits">Our Products</Link>
          <Link to="/">About DZShop</Link>
        </div>

        <div className="dz-footer-column dz-footer-contact">
          <h3>Contact Us</h3>

          <div className="dz-contact-item">
            <FaMapMarkerAlt />
            <span>Algeria</span>
          </div>

          <div className="dz-contact-item">
            <FaPhone />
            <a href="tel:0562997237">0562 99 72 37</a>
          </div>

          <div className="dz-contact-item">
            <FaEnvelope />
            <a href="mailto:contact@dzshop.com">
              contact@dzshop.com
            </a>
          </div>

          <div className="dz-socials">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

      </div>

      <div className="dz-footer-services">

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaTruck />
          </div>

          <div>
            <strong>Fast Delivery</strong>
            <span>Across 69 wilayas</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaShieldAlt />
          </div>

          <div>
            <strong>Secure Shopping</strong>
            <span>Safe and reliable</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaHeadset />
          </div>

          <div>
            <strong>Customer Support</strong>
            <span>We're here to help</span>
          </div>
        </div>

      </div>

      <div className="dz-footer-bottom">
        <p>© {new Date().getFullYear()} DZShop. All rights reserved.</p>
        <span>Quality · Price · Trust</span>
      </div>

    </footer>
  )
}

export default Footer ;