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

// Le style du pied de page est écrit ICI, dans ce fichier : plus besoin de footer.css.
// (Avant, la ligne  import './Footer.css'  cassait le site en ligne : le fichier
// s'appelle footer.css, avec un f minuscule, et Netlify fait la différence.)
const STYLE_FOOTER = `
.dz-footer {
  width: 100%;
  margin-top: 70px;
  background: #1c1c1e;
  color: #faf9f7;
  overflow: hidden;
}

.dz-footer-main {
  width: 100%;
  padding: 58px 6% 52px;
  display: grid;
  grid-template-columns: 1.55fr 1fr 1fr 1fr 1.2fr;
  gap: 42px;
  background: #1c1c1e;
}

.dz-footer-brand {
  min-width: 0;
}

.dz-footer-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  width: fit-content;
  margin-bottom: 20px;
  text-decoration: none;
}

.dz-footer-logo-mark {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #8b1e2d;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.4px;
  box-shadow: 0 6px 16px rgba(139, 30, 45, 0.18);
}

.dz-footer-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.dz-footer-shop-name {
  color: #ffffff;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.7px;
}

.dz-footer-shop-name span {
  color: #8b1e2d;
}

.dz-footer-tagline {
  margin-top: 5px;
  color: #888683;
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 1.35px;
}

.dz-footer-description {
  max-width: 300px;
  margin: 0 0 22px;
  color: rgba(250, 249, 247, 0.48);
  font-size: 11px;
  line-height: 1.8;
}

.dz-footer-socials {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dz-footer-socials a {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(250, 249, 247, 0.13);
  border-radius: 50% !important;
  background: transparent;
  color: rgba(250, 249, 247, 0.55);
  font-size: 12px;
  line-height: 1;
  text-decoration: none;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.dz-footer-socials a:hover {
  background: rgba(139, 30, 45, 0.3);
  border-color: rgba(139, 30, 45, 0.7);
  color: #ffffff;
  box-shadow: 0 0 14px rgba(139, 30, 45, 0.2);
  transform: translateY(-2px);
}

.dz-footer-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dz-footer-column h3 {
  margin: 0 0 20px;
  color: #faf9f7;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.dz-footer-column h3::after {
  content: "";
  display: block;
  width: 20px;
  height: 1px;
  margin-top: 8px;
  background: #8b1e2d;
}

.dz-footer-column > a {
  margin-bottom: 11px;
  color: rgba(250, 249, 247, 0.46);
  font-size: 11px;
  line-height: 1.5;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dz-footer-column > a:hover {
  color: #faf9f7;
}

.dz-footer-contact {
  padding-left: 4px;
}

.dz-contact-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: rgba(250, 249, 247, 0.5);
  font-size: 11px;
}

.dz-contact-item svg {
  min-width: 14px;
  color: #8b1e2d;
  font-size: 12px;
}

.dz-contact-item a {
  color: rgba(250, 249, 247, 0.5);
  text-decoration: none;
  transition: color 0.2s ease;
}

.dz-contact-item a:hover {
  color: #faf9f7;
}

.dz-contact-note {
  margin-top: 1px;
  color: rgba(250, 249, 247, 0.3);
  font-size: 9px;
}

.dz-footer-payment {
  width: 100%;
  min-height: 68px;
  padding: 14px 6%;
  display: flex;
  align-items: center;
  gap: 24px;
  background: #242426;
  border-top: 1px solid rgba(250, 249, 247, 0.06);
  border-bottom: 1px solid rgba(250, 249, 247, 0.06);
}

.dz-payment-title {
  margin-right: 6px;
  color: rgba(250, 249, 247, 0.72);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.dz-payment-item {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 40px;
}

.dz-payment-logo {
  width: 40px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(250, 249, 247, 0.1);
  border-radius: 7px;
  background: #1c1c1e;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.dz-payment-logo:hover {
  transform: translateY(-2px);
  border-color: rgba(250, 249, 247, 0.28);
  background: #202022;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.18);
}

.dz-payment-logo:active {
  transform: translateY(0);
}

.dz-payment-cash-logo {
  color: #c9364c;
}

.dz-payment-cash-logo svg {
  display: block;
  font-size: 17px;
}

.dz-payment-visa-logo {
  width: 40px;
  height: 30px;
  padding: 0;
  background: transparent;
  border-color: transparent;
}

.dz-payment-visa-logo:hover {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.dz-payment-visa-logo svg {
  display: block;
  color: #1a1f71;
  font-size: 24px;
}

.dz-payment-mastercard-logo {
  width: 40px;
  height: 30px;
  background: transparent;
  border-color: transparent;
}

.dz-payment-mastercard-logo:hover {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.dz-mastercard-mark {
  position: relative;
  width: 28px;
  height: 19px;
  display: block;
}

.dz-mastercard-circle {
  position: absolute;
  top: 0;
  width: 19px;
  height: 19px;
  border-radius: 50%;
}

.dz-mastercard-red {
  left: 0;
  background: #eb001b;
}

.dz-mastercard-yellow {
  right: 0;
  background: #f79e1b;
}

.dz-payment-name {
  color: rgba(250, 249, 247, 0.68);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.dz-footer-bottom {
  width: 100%;
  min-height: 58px;
  padding: 0 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  background: #171719;
}

.dz-footer-bottom p {
  margin: 0;
  color: rgba(250, 249, 247, 0.28);
  font-size: 9px;
}

.dz-footer-bottom-links {
  display: flex;
  align-items: center;
  gap: 22px;
}

.dz-footer-bottom-links a {
  color: rgba(250, 249, 247, 0.3);
  font-size: 9px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dz-footer-bottom-links a:hover {
  color: #b62c40;
}

.dz-footer-country {
  color: rgba(250, 249, 247, 0.3);
  font-size: 9px;
  white-space: nowrap;
}

@media (max-width: 1150px) {
  .dz-footer-main {
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 32px;
  }

  .dz-footer-contact {
    grid-column: span 2;
    padding-left: 0;
  }
}

@media (max-width: 850px) {
  .dz-footer-main {
    grid-template-columns: 1fr 1fr;
    padding: 45px 7%;
    gap: 40px 30px;
  }

  .dz-footer-brand {
    grid-column: span 2;
  }

  .dz-footer-contact {
    grid-column: span 2;
  }

  .dz-footer-payment {
    padding: 18px 7%;
    flex-wrap: wrap;
    gap: 14px 22px;
  }

  .dz-payment-title {
    width: 100%;
    margin-right: 0;
  }

  .dz-footer-bottom {
    min-height: auto;
    padding: 20px 7%;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  }
}

@media (max-width: 500px) {
  .dz-footer-main {
    grid-template-columns: 1fr;
    padding: 40px 7%;
  }

  .dz-footer-brand,
  .dz-footer-contact {
    grid-column: span 1;
  }

  .dz-footer-logo-mark {
    width: 36px;
    height: 36px;
    font-size: 11px;
  }

  .dz-footer-shop-name {
    font-size: 19px;
  }

  .dz-footer-tagline {
    font-size: 6.5px;
    letter-spacing: 1.2px;
  }

  .dz-footer-payment {
    padding: 18px 7%;
    align-items: center;
    gap: 14px 18px;
  }

  .dz-payment-item {
    width: auto;
  }

  .dz-payment-name {
    font-size: 9px;
  }

  .dz-payment-logo {
    width: 38px;
    height: 28px;
  }

  .dz-payment-visa-logo,
  .dz-payment-mastercard-logo {
    width: 38px;
    height: 28px;
  }

  .dz-payment-visa-logo svg {
    font-size: 22px;
  }

  .dz-footer-bottom {
    flex-direction: column;
    gap: 14px;
  }

  .dz-footer-bottom-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 18px;
  }
}
`

function Footer() {
  return (
    <footer className="dz-footer">
      <style>{STYLE_FOOTER}</style>

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
