import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const destination = (location.state && location.state.from) || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)
    try {
      await login(telephone, motDePasse)
      navigate(destination, { replace: true })
    } catch (err) {
      setErreur(err.message)
    }
    setEnvoi(false)
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: 'calc(100vh - 70px)', background: '#ffffff', padding: '50px 20px' }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: '100%', maxWidth: '450px', background: '#ffffff', border: 'none', borderRadius: '18px' }}
      >
        <h2 className="text-center mb-4">Connexion</h2>

        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="Votre mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100" disabled={envoi}>
            {envoi ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Pas de compte ? <Link to="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage