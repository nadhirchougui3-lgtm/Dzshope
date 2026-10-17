
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'
import { useAuth } from './AuthContext'
import GoogleSignInButton from './GoogleSignInButton'
import './auth.css'

function LoginPage() {
  const { login, loginGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const destination =
    (location.state && location.state.from) || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      await login(telephone, motDePasse)
      navigate(destination, { replace: true })
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  async function connexionGoogle(credential) {
    setErreur('')
    setEnvoi(true)

    try {
      await loginGoogle(credential)
      navigate(destination, { replace: true })
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="dz-auth-page">
      <div className="dz-auth-card">
        <div className="dz-auth-heading">
          <span className="dz-auth-kicker">DZSHOP</span>
          <h1>Welcome back</h1>
          <p>Sign in to your account and continue shopping.</p>
        </div>

        {erreur && (
          <div className="dz-auth-error" role="alert">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="dz-auth-field">
            <label htmlFor="login-telephone">Phone Number</label>
            <input
              id="login-telephone"
              type="tel"
              autoComplete="tel"
              className="dz-auth-input"
              placeholder="Your number"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
              disabled={envoi}
            />
          </div>

          <div className="dz-auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="dz-auth-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="dz-auth-input dz-auth-input-password"
                placeholder="Your password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                disabled={envoi}
              />

              <button
                type="button"
                className="dz-auth-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
                disabled={envoi}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '8px'
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: '#8B1E2D',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="dz-auth-submit"
            disabled={envoi}
          >
            <span>{envoi ? 'Signing In...' : 'Sign In'}</span>
            {!envoi && <FaArrowRight />}
          </button>
        </form>

        <div className="dz-auth-divider">
          <span />
          <strong>OR</strong>
          <span />
        </div>

        <div className="dz-auth-google">
          <GoogleSignInButton onCredential={connexionGoogle} />
        </div>

        <p className="dz-auth-bottom">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
