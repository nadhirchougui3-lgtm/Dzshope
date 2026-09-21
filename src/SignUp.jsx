import { useState } from 'react'

function SignUp() {
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    if (motDePasse !== confirmation) {
      alert('Les mots de passe ne correspondent pas.')
      return
    }

    alert('Compte créé avec succès !')
  }

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div
        className="card shadow p-4"
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <h2 className="text-center mb-4">Créer un compte</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Numéro de téléphone</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Votre numéro"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>

            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Votre mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmer le mot de passe</label>

            <div className="position-relative">
              <input
                type={showConfirmation ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Confirmez votre mot de passe"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                onClick={() =>
                  setShowConfirmation(!showConfirmation)
                }
              >
                {showConfirmation ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Sign Up
          </button>

        </form>
      </div>
    </div>
  )
}
export default SignUp
