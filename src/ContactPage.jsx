import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ContactPage() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5">
          <p className="text-muted mb-2">DZSHOP</p>

          <h1 className="fw-bold display-5 mb-3">
            Contact Us
          </h1>

          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Have a question, an order inquiry, or need help?
            Contact us directly on your preferred platform.
          </p>
        </div>

        <Row className="g-4 align-items-stretch">
          <Col lg={5}>
            <div
              className="bg-dark text-white rounded-4 p-4 p-md-5 h-100 shadow"
            >
              <p className="text-white-50 mb-2">
                NEED HELP?
              </p>

              <h2 className="fw-bold mb-4">
                Let&apos;s talk.
              </h2>

              <p className="text-white-50 mb-5">
                We are available to answer your questions about products,
                orders, and delivery.
              </p>

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
                      Chat with us directly
                    </small>
                  </div>

                  <div className="ms-auto fs-4">
                    →
                  </div>
                </div>
              </a>

              <div className="row g-3">
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

          <Col lg={7}>
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 h-100">
              <div className="mb-4">
                <p className="text-muted mb-1">
                  MESSAGE
                </p>

                <h2 className="fw-bold mb-2">
                  Send Us a Message
                </h2>

                <p className="text-muted">
                  Fill out the form and we will get back to you as soon as possible.
                </p>
              </div>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Name</Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Your name"
                        className="py-3"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Email</Form.Label>

                      <Form.Control
                        type="email"
                        placeholder="Your email"
                        className="py-3"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Subject</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="What would you like to talk about?"
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={7}
                    placeholder="Write your message..."
                    className="py-3"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="dark"
                  className="w-100 py-3 fw-semibold"
                >
                  Send Message →
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