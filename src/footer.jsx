import { Link } from 'react-router-dom'
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCcVisa,
  FaMoneyBillWave
} from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="dz-footer">

      <div className="dz-footer-main">

        <div className="dz-footer-brand">

          <Link to="/" className="dz-footer-logo">
            <span className="dz-footer-logo-mark">DZ</span>

            <span className="dz-footer-logo-text">
              <span className="dz-footer-shop-name">
                DZ<span>Shop</span>
              </span>

              <span className="dz-footer-tagline">
                Quality · Price · Trust
              </span>
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
          Payment Methods
        </div>

        <div className="dz-payment-item">
          <a
            href=""
            className="dz-payment-logo dz-payment-cash-logo"
            aria-label="Cash on Delivery"
          >
            <FaMoneyBillWave />
          </a>

          <span className="dz-payment-name">
            Cash on Delivery
          </span>
        </div>

        <div className="dz-payment-item">
          <a
            href=""
            className="dz-payment-logo dz-payment-visa-logo"
            aria-label="Visa"
          >
            <FaCcVisa />
          </a>

          <span className="dz-payment-name">
            Visa
          </span>
        </div>

        <div className="dz-payment-item">
          <a
            href=""
            className="dz-payment-logo dz-payment-mastercard-logo"
            aria-label="Mastercard"
          >
            <span className="dz-mastercard-mark" aria-hidden="true">
              <span className="dz-mastercard-circle dz-mastercard-red"></span>
              <span className="dz-mastercard-circle dz-mastercard-yellow"></span>
            </span>
          </a>

          <span className="dz-payment-name">
            Mastercard
          </span>
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

export default Footer
