import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaTelegramPlane,
  FaArrowRight,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa'
import './ContactPage.css'

function ContactPage() {
  return (
    <main className="dz-contact-page">
      <section className="dz-contact-hero">
        <span>DZSHOP SUPPORT</span>

        <h1>
          How can <span>we help?</span>
        </h1>

        <p>
          Questions about products, orders, delivery or
          payment? Our team is here to help.
        </p>
      </section>

      <section className="dz-contact-layout">
        <div className="dz-contact-info">
          <div className="dz-contact-info-inner">
            <span className="dz-contact-kicker">
              GET IN TOUCH
            </span>

            <h2>
              Let&apos;s talk<span>.</span>
            </h2>

            <p>
              Choose the channel that works best for
              you and contact DZShop directly.
            </p>

            <a
              href="https://wa.me/213562997237"
              target="_blank"
              rel="noreferrer"
              className="dz-contact-whatsapp"
            >
              <div className="dz-contact-social-icon">
                <FaWhatsapp />
              </div>

              <div>
                <strong>WhatsApp</strong>
                <span>Chat with us directly</span>
              </div>

              <FaArrowRight />
            </a>

            <div className="dz-contact-social-grid">
              <a href="#" className="dz-contact-social-card">
                <FaInstagram />

                <div>
                  <strong>Instagram</strong>
                  <span>@dzshop</span>
                </div>
              </a>

              <a href="#" className="dz-contact-social-card">
                <FaFacebookF />

                <div>
                  <strong>Facebook</strong>
                  <span>DZShop</span>
                </div>
              </a>

              <a href="#" className="dz-contact-social-card">
                <FaTiktok />

                <div>
                  <strong>TikTok</strong>
                  <span>@dzshop</span>
                </div>
              </a>

              <a href="#" className="dz-contact-social-card">
                <FaTelegramPlane />

                <div>
                  <strong>Telegram</strong>
                  <span>DZShop</span>
                </div>
              </a>
            </div>

            <div className="dz-contact-direct">
              <a href="tel:0562997237">
                <FaPhone />
                <span>0562 99 72 37</span>
              </a>

              <a href="mailto:dzshop@gmail.com">
                <FaEnvelope />
                <span>dzshop@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="dz-contact-form-card">
          <div className="dz-contact-form-header">
            <span className="dz-contact-kicker">
              MESSAGE
            </span>

            <h2>Send us a message</h2>

            <p className="dz-contact-form-description">
              Fill in the form and we&apos;ll get back to
              you as soon as possible.
            </p>
          </div>

          <form className="dz-contact-form">
            <div className="dz-contact-row">
              <div className="dz-contact-field">
                <label>Name</label>

                <input
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="dz-contact-field">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>

            <div className="dz-contact-field">
              <label>Subject</label>

              <input
                type="text"
                placeholder="What would you like to talk about?"
                required
              />
            </div>

            <div className="dz-contact-field">
              <label>Message</label>

              <textarea
                rows="6"
                placeholder="Write your message..."
                required
              />
            </div>

            <button type="submit">
              <span>Send Message</span>
              <FaArrowRight />
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ContactPage 