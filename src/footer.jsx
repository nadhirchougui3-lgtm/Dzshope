import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <Container className="py-5">
        <Row className="g-5">

          {/* À propos */}
          <Col md={5}>
            <h5 className="fw-bold mb-3">MonShop</h5>

            <p className="text-light mb-0" style={{ maxWidth: "420px" }}>
              Votre boutique en ligne en Algérie.
              Découvrez nos meilleurs produits au meilleur prix.
            </p>
          </Col>

          {/* Liens */}
          <Col md={3}>
            <h5 className="fw-bold mb-3">Liens utiles</h5>

            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="/" className="text-white text-decoration-none">
                  Accueil
                </a>
              </li>

              <li className="mb-2">
                <a href="/products" className="text-white text-decoration-none">
                  Produits
                </a>
              </li>

              <li className="mb-2">
                <a href="/about" className="text-white text-decoration-none">
                  À propos
                </a>
              </li>

              <li>
                <a href="/contact" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h5 className="fw-bold mb-3">Contact</h5>

            <p className="mb-2">📍 Algérie</p>
            <p className="mb-2">📞 0562 99 72 37</p>
            <p className="mb-0">✉️ contact@monshop.com</p>
          </Col>

        </Row>

        <hr className="border-secondary my-4" />

        <div className="text-center">
          <p className="mb-0 text-light">
            © 2026 MonShop. Tous droits réservés.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

