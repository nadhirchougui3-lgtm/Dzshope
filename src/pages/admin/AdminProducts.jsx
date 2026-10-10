import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import { formatPrix, IMAGE_SECOURS } from '../../utils/format'

const VIDE = {
  nom: '',
  prix: '',
  categorie: '',
  stock: '',
  description: '',
  image: '',
}

function AdminProducts() {
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [form, setForm] = useState(VIDE)
  const [editionId, setEditionId] = useState(null)
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoiImage, setEnvoiImage] = useState(false)

  useEffect(function () {
    apiFetch('/api/products')
      .then(lireJson)
      .then(setProduits)
      .catch(function () {
        setErreur('Impossible de charger les produits')
      })
      .finally(function () {
        setChargement(false)
      })
  }, [])

  function changer(champ, valeur) {
    setForm(function (ancienne) {
      return {
        ...ancienne,
        [champ]: valeur,
      }
    })
  }

  async function envoyerImage(e) {
    const fichier = e.target.files[0]

    if (!fichier) return

    const donnees = new FormData()
    donnees.append('image', fichier)

    setEnvoiImage(true)
    setErreur('')
    setMessage('')

    try {
      const reponse = await apiFetch('/api/upload', {
        method: 'POST',
        body: donnees,
      })

      const data = await lireJson(reponse)

      changer('image', data.imageUrl)
    } catch (err) {
      setErreur(err.message || "Impossible d'envoyer l'image")
    } finally {
      setEnvoiImage(false)
    }
  }

  function commencerModification(produit) {
    setEditionId(produit._id)

    setForm({
      nom: produit.nom,
      prix: produit.prix,
      categorie: produit.categorie,
      stock: produit.stock,
      description: produit.description || '',
      image: produit.image || '',
    })

    setMessage('')
    setErreur('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function annuler() {
    setEditionId(null)
    setForm(VIDE)
    setMessage('')
    setErreur('')
  }

  async function enregistrer(e) {
    e.preventDefault()

    setErreur('')
    setMessage('')

    const corps = {
      nom: form.nom,
      prix: Number(form.prix),
      categorie: form.categorie || 'Divers',
      stock: Number(form.stock || 0),
      description: form.description,
      image: form.image,
    }

    try {
      if (editionId) {
        const reponse = await apiFetch('/api/products/' + editionId, {
          method: 'PUT',
          body: JSON.stringify(corps),
        })

        const produit = await lireJson(reponse)

        setProduits(function (anciens) {
          return anciens.map(function (p) {
            return p._id === editionId ? produit : p
          })
        })

        setMessage('Produit modifié avec succès')
      } else {
        const reponse = await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(corps),
        })

        const produit = await lireJson(reponse)

        setProduits(function (anciens) {
          return [...anciens, produit]
        })

        setMessage('Produit ajouté avec succès')
      }

      setEditionId(null)
      setForm(VIDE)
    } catch (err) {
      setErreur(err.message || 'Erreur, réessaie')
    }
  }

  async function supprimer(produit) {
    if (!window.confirm('Supprimer « ' + produit.nom + ' » ?')) {
      return
    }

    setErreur('')
    setMessage('')

    try {
      await apiFetch('/api/products/' + produit._id, {
        method: 'DELETE',
      })

      setProduits(function (anciens) {
        return anciens.filter(function (p) {
          return p._id !== produit._id
        })
      })

      if (editionId === produit._id) {
        annuler()
      }

      setMessage('Produit supprimé avec succès')
    } catch (err) {
      setErreur(err.message || 'Impossible de supprimer')
    }
  }

  if (chargement) return <Chargement />

  return (
    <div className="admin-products-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">CATALOGUE</span>

          <h1 className="admin-page-title">
            Produits <span>({produits.length})</span>
          </h1>

          <p className="admin-page-description">
            Gérez les produits, les prix et les quantités de votre boutique.
          </p>
        </div>
      </header>

      {(message || erreur) && (
        <div
          className={
            'admin-alert ' +
            (erreur ? 'admin-alert-danger' : 'admin-alert-success')
          }
          role="alert"
        >
          {erreur || message}
        </div>
      )}

      <section className="admin-card admin-product-editor-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-section-eyebrow">
              {editionId ? 'MODIFICATION' : 'NOUVEAU PRODUIT'}
            </span>

            <h2 className="admin-card-title">
              {editionId ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>

            <p className="admin-card-subtitle">
              {editionId
                ? 'Mettez à jour les informations du produit sélectionné.'
                : 'Renseignez les informations pour enrichir votre catalogue.'}
            </p>
          </div>

          {editionId && (
            <span className="admin-editing-indicator">
              Mode modification
            </span>
          )}
        </div>

        <form className="admin-form" onSubmit={enregistrer}>
          <div className="admin-product-form">
            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-product-name">
                Nom du produit
              </label>

              <input
                id="admin-product-name"
                className="admin-form-input"
                type="text"
                placeholder="Ex. Montre élégante"
                required
                value={form.nom}
                onChange={function (e) {
                  changer('nom', e.target.value)
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-product-price">
                Prix
              </label>

              <div className="admin-input-with-suffix">
                <input
                  id="admin-product-price"
                  className="admin-form-input"
                  type="number"
                  min="0"
                  placeholder="0"
                  required
                  value={form.prix}
                  onChange={function (e) {
                    changer('prix', e.target.value)
                  }}
                />

                <span>DA</span>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-product-stock">
                Stock disponible
              </label>

              <input
                id="admin-product-stock"
                className="admin-form-input"
                type="number"
                min="0"
                placeholder="Quantité disponible"
                value={form.stock}
                onChange={function (e) {
                  changer('stock', e.target.value)
                }}
              />
            </div>

            <div className="admin-form-group">
              <label
                className="admin-form-label"
                htmlFor="admin-product-category"
              >
                Catégorie
              </label>

              <input
                id="admin-product-category"
                className="admin-form-input"
                type="text"
                placeholder="Ex. Vêtements"
                value={form.categorie}
                onChange={function (e) {
                  changer('categorie', e.target.value)
                }}
              />
            </div>

            <div className="admin-form-group admin-product-form-full">
              <label
                className="admin-form-label"
                htmlFor="admin-product-description"
              >
                Description du produit
              </label>

              <textarea
                id="admin-product-description"
                className="admin-form-textarea"
                placeholder="Décrivez le produit, ses caractéristiques et ses détails..."
                value={form.description}
                onChange={function (e) {
                  changer('description', e.target.value)
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label" htmlFor="admin-product-image">
                Photo du produit
              </label>

              <div className="admin-file-upload">
                <input
                  className="admin-file-input"
                  id="admin-product-image"
                  type="file"
                  accept="image/*"
                  onChange={envoyerImage}
                  disabled={envoiImage}
                />

                <label
                  className="admin-file-label"
                  htmlFor="admin-product-image"
                >
                  <span className="admin-file-label-main">
                    {envoiImage ? 'Envoi en cours...' : 'Choisir une image'}
                  </span>

                  <span className="admin-file-label-sub">
                    JPG, PNG ou WEBP
                  </span>
                </label>
              </div>

              {envoiImage && (
                <small className="admin-form-help">
                  Envoi de l'image en cours...
                </small>
              )}

              {!envoiImage && form.image && (
                <small className="admin-form-help admin-form-help-success">
                  Image renseignée avec succès.
                </small>
              )}
            </div>

            <div className="admin-form-group">
              <label
                className="admin-form-label"
                htmlFor="admin-product-image-url"
              >
                Adresse de l'image
              </label>

              <input
                id="admin-product-image-url"
                className="admin-form-input"
                type="text"
                placeholder="https://... ou chemin de l'image"
                value={form.image}
                onChange={function (e) {
                  changer('image', e.target.value)
                }}
              />

              <small className="admin-form-help">
                Vous pouvez également saisir directement le chemin de l'image.
              </small>
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-button admin-button-primary"
              disabled={envoiImage}
            >
              {editionId ? 'Enregistrer les modifications' : 'Ajouter le produit'}
            </button>

            {editionId && (
              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={annuler}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card admin-products-catalog-card">
        <div className="admin-card-header">
          <div>
            <span className="admin-section-eyebrow">INVENTAIRE</span>

            <h2 className="admin-card-title">Catalogue des produits</h2>

            <p className="admin-card-subtitle">
              {produits.length} produit{produits.length > 1 ? 's' : ''}
              {' · '}
              Faites défiler la liste pour consulter le catalogue.
            </p>
          </div>
        </div>

        {produits.length === 0 ? (
          <div className="admin-empty-state">
            Aucun produit dans le catalogue pour le moment.
          </div>
        ) : (
          <div className="admin-products-table-scroll">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Photo</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Prix</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {produits.map(function (p) {
                    return (
                      <tr key={p._id}>
                        <td>
                          <img
                            className="admin-product-image"
                            src={p.image || IMAGE_SECOURS}
                            alt={p.nom || 'Produit'}
                            loading="lazy"
                            onError={function (e) {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = IMAGE_SECOURS
                            }}
                          />
                        </td>

                        <td>
                          <strong className="admin-product-name">
                            {p.nom}
                          </strong>
                        </td>

                        <td>
                          <span className="admin-product-category">
                            {p.categorie || 'Divers'}
                          </span>
                        </td>

                        <td>
                          <strong className="admin-product-price">
                            {formatPrix(p.prix)}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={
                              'admin-badge ' +
                              (p.stock === 0
                                ? 'admin-badge-danger'
                                : p.stock <= 5
                                  ? 'admin-badge-warning'
                                  : 'admin-badge-success')
                            }
                          >
                            {p.stock ?? 0}
                          </span>
                        </td>

                        <td>
                          <div className="admin-product-actions">
                            <button
                              type="button"
                              className="admin-button admin-button-secondary"
                              onClick={function () {
                                commencerModification(p)
                              }}
                            >
                              Modifier
                            </button>

                            <button
                              type="button"
                              className="admin-button admin-button-danger"
                              onClick={function () {
                                supprimer(p)
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminProducts
