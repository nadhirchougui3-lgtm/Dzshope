import { useState, useEffect } from 'react'
import { apiFetch, lireJson } from '../../api'
import Chargement from '../../components/Chargement'
import { formatPrix, IMAGE_SECOURS } from '../../utils/format'

const VIDE = { nom: '', prix: '', categorie: '', stock: '', description: '', image: '' }

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
      .catch(function () { setErreur('Impossible de charger les produits') })
      .finally(function () { setChargement(false) })
  }, [])

  function changer(champ, valeur) {
    setForm({ ...form, [champ]: valeur })
  }

  async function envoyerImage(e) {
    const fichier = e.target.files[0]
    if (!fichier) return

    const donnees = new FormData()
    donnees.append('image', fichier)

    setEnvoiImage(true)
    setErreur('')

    try {
      const reponse = await apiFetch('/api/upload', { method: 'POST', body: donnees })
      const data = await lireJson(reponse)
      changer('image', data.imageUrl)
    } catch (err) {
      setErreur(err.message || "Impossible d'envoyer l'image")
    }

    setEnvoiImage(false)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function annuler() {
    setEditionId(null)
    setForm(VIDE)
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
          body: JSON.stringify(corps)
        })

        const produit = await lireJson(reponse)

        setProduits(function (anciens) {
          return anciens.map(function (p) {
            return p._id === editionId ? produit : p
          })
        })

        setMessage('Produit modifié ✅')
      } else {
        const reponse = await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(corps)
        })

        const produit = await lireJson(reponse)

        setProduits(function (anciens) {
          return [...anciens, produit]
        })

        setMessage('Produit ajouté ✅')
      }

      annuler()
    } catch (err) {
      setErreur(err.message || 'Erreur, réessaie')
    }
  }

  async function supprimer(produit) {
    if (!window.confirm('Supprimer « ' + produit.nom + ' » ?')) return

    try {
      await apiFetch('/api/products/' + produit._id, { method: 'DELETE' })

      setProduits(function (anciens) {
        return anciens.filter(function (p) {
          return p._id !== produit._id
        })
      })

      setMessage('Produit supprimé')
    } catch (err) {
      setErreur('Impossible de supprimer')
    }
  }

  if (chargement) return <Chargement />

  return (
    <>
      <h1 className="h3 mb-4">Produits ({produits.length})</h1>

      <form className="bg-white rounded-3 shadow-sm p-4 mb-4" onSubmit={enregistrer}>
        <h5 className="mb-3">
          {editionId ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}
        </h5>

        {message && <div className="alert alert-success py-2">{message}</div>}
        {erreur && <div className="alert alert-danger py-2">{erreur}</div>}

        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Nom du produit"
              required
              value={form.nom}
              onChange={function (e) { changer('nom', e.target.value) }}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Prix (DA)"
              required
              value={form.prix}
              onChange={function (e) { changer('prix', e.target.value) }}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              type="number"
              min="0"
              placeholder="Stock"
              value={form.stock}
              onChange={function (e) { changer('stock', e.target.value) }}
            />
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Catégorie"
              value={form.categorie}
              onChange={function (e) { changer('categorie', e.target.value) }}
            />
          </div>

          <div className="col-12">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Description"
              value={form.description}
              onChange={function (e) { changer('description', e.target.value) }}
            ></textarea>
          </div>

          <div className="col-md-6">
            <label className="form-label small mb-1">Photo (fichier)</label>
            <input
              className="form-control"
              type="file"
              accept="image/*"
              onChange={envoyerImage}
            />
            {envoiImage && <small className="text-muted">Envoi de l'image...</small>}
          </div>

          <div className="col-md-6">
            <label className="form-label small mb-1">…ou adresse de l'image</label>
            <input
              className="form-control"
              placeholder="https://..."
              value={form.image}
              onChange={function (e) { changer('image', e.target.value) }}
            />
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary">
            {editionId ? 'Enregistrer les modifications' : 'Ajouter le produit'}
          </button>

          {editionId && (
            <button type="button" className="btn btn-outline-secondary" onClick={annuler}>
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th></th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {produits.map(function (p) {
              return (
                <tr key={p._id}>
                  <td style={{ width: '70px' }}>
                    <img
                      src={p.image}
                      alt=""
                      width="56"
                      height="42"
                      style={{ objectFit: 'cover', borderRadius: '6px' }}
                      onError={function (e) { e.target.src = IMAGE_SECOURS }}
                    />
                  </td>

                  <td className="fw-semibold">{p.nom}</td>
                  <td>{p.categorie}</td>
                  <td>{formatPrix(p.prix)}</td>

                  <td>
                    <span
                      className={
                        'badge text-bg-' +
                        (p.stock === 0 ? 'danger' : p.stock <= 5 ? 'warning' : 'success')
                      }
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={function () { commencerModification(p) }}
                    >
                      Modifier
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={function () { supprimer(p) }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminProducts
