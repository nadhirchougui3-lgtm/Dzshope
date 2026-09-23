import { Link } from "react-router-dom";
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
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="dz-footer">
      <div className="dz-footer-services">
        <div className="dz-footer-service">
          <FaTruck aria-hidden="true" />
          <div>
            <strong>Fast delivery</strong>
            <span>Throughout Algeria</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <FaShieldAlt aria-hidden="true" />
          <div>
            <strong>Secure payment</strong>
            <span>Your data is protected</span>
          </div>
        </div>

        <div className="dz-footer-service">
          <FaHeadset aria-hidden="true" />
          <div>
            <strong>Shop with confidence</strong>
            <span>Customer service at your disposal</span>
          </div>
        </div>
      </div>

      <div className="dz-footer-main">
        <div className="dz-footer-inner">
          <div className="dz-footer-brand">
            <Link to="/" className="dz-footer-logo">
              DZ<span>Shop</span>
            </Link>

            <p>
              Your online store in Algeria. Discover a selection of products
              and enjoy a simple and pleasant shopping experience.
            </p>

            <div className="dz-footer-socials">
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>

              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>

              <a href="#" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
              </a>
            </div>
          </div>

          <div className="dz-footer-links">
            <h3>Shop</h3>

            <Link to="/">Home</Link>
            <Link to="/products">All products</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="dz-footer-contact">
            <h3>Contact</h3>

            <div>
              <FaMapMarkerAlt aria-hidden="true" />
              <span>Algeria</span>
            </div>

            <div>
              <FaPhone aria-hidden="true" />
              <a href="tel:0562997237">0562 99 72 37</a>
            </div>

            <div>
              <FaEnvelope aria-hidden="true" />
              <a href="mailto:contact@dzshop.com">contact@dzshop.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="dz-footer-bottom">
        <p>© {new Date().getFullYear()} DZShop. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer ;