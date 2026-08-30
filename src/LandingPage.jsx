function LandingPage() {
  return(
    <>

<section className="py-5 bg-light">
  <div className="container py-5">
    <div className="row align-items-center g-5">

      {/* CONTENU */}
      <div className="col-lg-6">

        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
          ✨ Découvrez notre collection
        </span>

        <h1 className="display-3 fw-bold lh-1 mb-4">
          Trouvez ce qu'il vous faut,
          <span className="text-primary"> simplement.</span>
        </h1>

        <p className="lead text-secondary mb-4">
          Découvrez nos produits sélectionnés avec soin,
          profitez de prix avantageux et faites-vous livrer
          directement chez vous.
        </p>

        {/* BOUTONS */}
        <div className="d-flex flex-wrap gap-3 mb-5">
          <a
            href="#produits"
            className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-semibold"
          >
            🛍️ Nos produits
          </a>

          <a
            href="#categories"
            className="btn btn-outline-dark btn-lg px-4 py-3 rounded-pill"
          >
            Voir les catégories
          </a>
        </div>

        {/* AVANTAGES */}
        <div className="row g-3">

          {/* Livraison */}
          <div className="col-md-4">
            <div className="bg-white rounded-4 p-3 h-100 shadow-sm">
              <div className="fs-3 mb-2">🚚</div>

              <h6 className="fw-bold mb-1">
                Livraison 58 wilayas
              </h6>

              <small className="text-secondary">
                Recevez votre commande partout en Algérie.
              </small>
            </div>
          </div>

          {/* Paiement */}
          <div className="col-md-4">
            <div className="bg-white rounded-4 p-3 h-100 shadow-sm">
              <div className="fs-3 mb-2">💵</div>

              <h6 className="fw-bold mb-1">
                Paiement à la livraison
              </h6>

              <small className="text-secondary">
                Vous payez uniquement à la réception.
              </small>
            </div>
          </div>

          {/* Retour */}
          <div className="col-md-4">
            <div className="bg-white rounded-4 p-3 h-100 shadow-sm">
              <div className="fs-3 mb-2">↩️</div>

              <h6 className="fw-bold mb-1">
                Retour sous 7 jours
              </h6>

              <small className="text-secondary">
                Retournez votre commande sous 7 jours.
              </small>
            </div>
          </div>

        </div>

      </div>

      {/* IMAGE */}
      <div className="col-lg-6">
        <div className="position-relative">

          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"
            className="img-fluid rounded-5 shadow-lg"
            alt="Nos produits"
          />

          {/* Badge livraison */}
          <div className="position-absolute bottom-0 start-0 translate-middle-y ms-3">
            <div className="bg-white rounded-4 shadow p-3">

              <div className="d-flex align-items-center gap-3">
                <div className="fs-2">🚚</div>

                <div>
                  <div className="fw-bold">
                    Livraison partout
                  </div>

                  <small className="text-secondary">
                    58 wilayas 🇩🇿
                  </small>
                </div>
              </div>

            </div>
          </div>

          {/* Badge confiance */}
          <div className="position-absolute top-0 end-0 me-3 mt-3">
            <div className="bg-dark text-white rounded-4 shadow px-3 py-2">
              <span className="fw-semibold">
                ✓ Achat sécurisé
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

    </>
  )
}
export default LandingPage;





