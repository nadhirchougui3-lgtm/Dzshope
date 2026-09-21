import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ContactPage() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>

        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-muted mb-2">DZSHOP</p>

          <h1 className="fw-bold display-5 mb-3">
            Contactez-nous
          </h1>

          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Une question, une commande ou besoin d'aide ?
            Contactez-nous directement sur votre plateforme préférée.
          </p>
        </div>

        <Row className="g-4 align-items-stretch">

          {/* LEFT SIDE */}
          <Col lg={5}>
            <div
              className="bg-dark text-white rounded-4 p-4 p-md-5 h-100 shadow"
            >
              <p className="text-white-50 mb-2">
                BESOIN D'AIDE ?
              </p>

              <h2 className="fw-bold mb-4">
                Parlons ensemble.
              </h2>

              <p className="text-white-50 mb-5">
                Nous sommes disponibles pour répondre à vos questions
                concernant les produits, les commandes et la livraison.
              </p>

              {/* WhatsApp */}
              <a
                href="https://wa.me/213562997237"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                <div
                  className="bg-white text-dark rounded-4 p-3 mb-4 d-flex align-items-center"
                  style={{ transition: "0.2s" }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "52px",
                      height: "52px",
                      backgroundColor: "#25D366",
                      color: "white",
                      fontSize: "24px"
                    }}
                  >
                    W
                  </div>

                  <div>
                    <div className="fw-bold">WhatsApp</div>
                    <small className="text-muted">
                      Chattez avec nous directement
                    </small>
                  </div>

                  <div className="ms-auto fs-4">
                    →
                  </div>
                </div>
              </a>

              {/* Socials */}
              <div className="row g-3">

                {/* Instagram */}
                <div className="col-6">
                  <a
                    href="#"
                    className="text-decoration-none text-white"
                  >
                    <div className="border border-secondary rounded-4 p-3 h-100">
                      <div className="fs-3 mb-2">◎</div>
                      <div className="fw-semibold">Instagram</div>
                      <small className="text-white-50">
                        @dzshop
                      </small>
                    </div>
                  </a>
                </div>

                {/* Facebook */}
                <div className="col-6">
                  <a
                    href="#"
                    className="text-decoration-none text-white"
                  >
                    <div className="border border-secondary rounded-4 p-3 h-100">
                      <div className="fs-3 mb-2">f</div>
                      <div className="fw-semibold">Facebook</div>
                      <small className="text-white-50">
                        DZShop
                      </small>
                    </div>
                  </a>
                </div>

                {/* TikTok */}
                <div className="col-6">
                  <a
                    href="#"
                    className="text-decoration-none text-white"
                  >
                    <div className="border border-secondary rounded-4 p-3 h-100">
                      <div className="fs-3 mb-2">♪</div>
                      <div className="fw-semibold">TikTok</div>
                      <small className="text-white-50">
                        @dzshop
                      </small>
                    </div>
                  </a>
                </div>

                {/* Telegram */}
                <div className="col-6">
                  <a
                    href="#"
                    className="text-decoration-none text-white"
                  >
                    <div className="border border-secondary rounded-4 p-3 h-100">
                      <div className="fs-3 mb-2">➤</div>
                      <div className="fw-semibold">Telegram</div>
                      <small className="text-white-50">
                        DZShop
                      </small>
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </Col>

          {/* RIGHT SIDE */}
          <Col lg={7}>
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 h-100">

              <div className="mb-4">
                <p className="text-muted mb-1">
                  MESSAGE
                </p>

                <h2 className="fw-bold mb-2">
                  Envoyez-nous un message
                </h2>

                <p className="text-muted">
                  Remplissez le formulaire et nous vous répondrons
                  dès que possible.
                </p>
              </div>

              <Form>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Nom</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Votre nom"
                        className="py-3"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email</Form.Label>

                      <Form.Control
                        type="email"
                        placeholder="Votre email"
                        className="py-3"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Sujet</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="De quoi souhaitez-vous parler ?"
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={7}
                    placeholder="Écrivez votre message..."
                    className="py-3"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 py-3 fw-semibold"
                >
                  Envoyer le message →
                </Button>

              </Form>
            </div>
          </Col>

        </Row>

      </Container>
    </div>
  );
}

export default ContactPage;
