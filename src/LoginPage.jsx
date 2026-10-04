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
    }

    setEnvoi(false)
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

          <p>
            Sign in to your account and continue shopping.
          </p>
        </div>

        {erreur && (
          <div className="dz-auth-error">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="dz-auth-field">
            <label>Phone Number</label>

            <input
              type="tel"
              className="dz-auth-input"
              placeholder="Your number"
              value={telephone}
              onChange={(e) =>
                setTelephone(e.target.value)
              }
              required
            />
          </div>

          <div className="dz-auth-field">
            <label>Password</label>

            <div className="dz-auth-input-wrapper">
              <input
                type={
                  showPassword ? 'text' : 'password'
                }
                className="dz-auth-input dz-auth-input-password"
                placeholder="Your password"
                value={motDePasse}
                onChange={(e) =>
                  setMotDePasse(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="dz-auth-eye"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="dz-auth-submit"
            disabled={envoi}
          >
            <span>
              {envoi ? 'Signing In...' : 'Sign In'}
            </span>

            {!envoi && <FaArrowRight />}
          </button>

        </form>

        <div className="dz-auth-divider">
          <span />
          <strong>OR</strong>
          <span />
        </div>

        <div className="dz-auth-google">
          <GoogleSignInButton
            onCredential={connexionGoogle}
          />
        </div>

        <p className="dz-auth-bottom">
          Don&apos;t have an account?{' '}
          <Link to="/signup">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage