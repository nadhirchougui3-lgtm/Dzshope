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
  FaHeadset,
  FaCcVisa,
  FaCcMastercard,
  FaMoneyBillWave
} from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="dz-footer">

      <div className="dz-footer-services">

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaTruck />
          </div>
          <div>
            <strong>Fast Delivery</strong>
            <span>Throughout Algeria</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaShieldAlt />
          </div>
          <div>
            <strong>Secure Payment</strong>
            <span>Buy with confidence</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <div className="dz-footer-service-icon">
            <FaHeadset />
          </div>
          <div>
            <strong>Customer Service</strong>
            <span>A team ready to help you</span>
          </div>
        </div>

      </div>

      <div className="dz-footer-main">

        <div className="dz-footer-brand">

          <Link to="/" className="dz-footer-logo">
            <span className="dz-footer-logo-box">DZ</span>
            <span className="dz-footer-logo-text">
              DZ<span>Shop</span>
            </span>
          </Link>

          <p className="dz-footer-description">
            Your trusted online shopping destination in Algeria.
            Quality products, great prices and a simple shopping experience.
          </p>

          <div className="dz-footer-socials">
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

        <div className="dz-footer-column">
          <h3>Shop</h3>
          <Link to="/">Home</Link>
          <Link to="/produits">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/produits">New Arrivals</Link>
          <Link to="/produits">Special Offers</Link>
          <Link to="/panier">Shopping Cart</Link>
        </div>

        <div className="dz-footer-column">
          <h3>Customer Service</h3>
          <Link to="/contact">Help Center</Link>
          <Link to="/contact">Delivery Information</Link>
          <Link to="/contact">Payment Methods</Link>
          <Link to="/contact">Returns & Refunds</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/contact">FAQ</Link>
        </div>

        <div className="dz-footer-column">
          <h3>My Account</h3>
          <Link to="/signup">Create an Account</Link>
          <Link to="/panier">My Basket</Link>
          <Link to="/produits">My Products</Link>
          <Link to="/contact">Assistance</Link>
          <Link to="/contact">FAQ</Link>
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
            <a href="mailto:dzshop@gmail.com">dzshop@gmail.com</a>
          </div>

          <span className="dz-contact-note">
            Available every day to help you
          </span>
        </div>

      </div>

      <div className="dz-footer-payment">

        <div className="dz-payment-title">
          Payment methods
        </div>

        <div className="dz-payment-method">
          <FaMoneyBillWave />
          <span>Cash on delivery</span>
        </div>

        <div className="dz-payment-method">
          <FaCcVisa />
          <span>Visa</span>
        </div>

        <div className="dz-payment-method">
          <FaCcMastercard />
          <span>MasterCard</span>
        </div>

        <div className="dz-delivery-note">
          <FaTruck />
          <span>Delivery to all 69 wilayas</span>
        </div>

      </div>

      <div className="dz-footer-bottom">

        <p>
          © {new Date().getFullYear()} DZShop. All rights reserved.
        </p>

        <div className="dz-footer-bottom-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookies</a>
        </div>

        <span className="dz-footer-country">
          🇩🇿 Algeria
        </span>

      </div>

    </footer>
  )
}

export default Footer ;