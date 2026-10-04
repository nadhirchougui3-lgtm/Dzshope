import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from './AuthContext'
import GoogleSignInButton from './GoogleSignInButton'
import './auth.css'

function SignUp() {
  const { register, loginGoogle } = useAuth()
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    if (motDePasse.length < 6) {
      setErreur(
        'Password must be at least 6 characters long.'
      )
      return
    }

    if (motDePasse !== confirmation) {
      setErreur('Passwords do not match.')
      return
    }

    setEnvoi(true)

    try {
      await register(nom, telephone, motDePasse)
      navigate('/')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  async function handleGoogleCredential(credential) {
    setErreur('')
    setEnvoi(true)

    try {
      await loginGoogle(credential)
      navigate('/')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="dz-auth-page">
      <div className="dz-auth-card dz-signup-card">

        <div className="dz-auth-heading">
          <span className="dz-auth-kicker">
            DZSHOP
          </span>

          <h1>
            Create your account
          </h1>

          <p>
            Create an account and start shopping with DZShop.
          </p>
        </div>

        {erreur && (
          <div className="dz-auth-error">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="dz-auth-field">
            <label>Name</label>

            <input
              type="text"
              className="dz-auth-input"
              placeholder="Your name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

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
                  showPassword
                    ? 'text'
                    : 'password'
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

          <div className="dz-auth-field">
            <label>
              Confirm Password
            </label>

            <div className="dz-auth-input-wrapper">
              <input
                type={
                  showConfirmation
                    ? 'text'
                    : 'password'
                }
                className="dz-auth-input dz-auth-input-password"
                placeholder="Confirm your password"
                value={confirmation}
                onChange={(e) =>
                  setConfirmation(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="dz-auth-eye"
                onClick={() =>
                  setShowConfirmation(
                    !showConfirmation
                  )
                }
                aria-label={
                  showConfirmation
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmation ? (
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
              {envoi
                ? 'Creating Account...'
                : 'Create Account'}
            </span>
          </button>

        </form>

        <div className="dz-auth-divider">
          <span />
          <strong>OR</strong>
          <span />
        </div>

        <GoogleSignInButton
          onCredential={handleGoogleCredential}
          disabled={envoi}
          onError={setErreur}
        />

        <p className="dz-auth-bottom">
          Already have an account?{' '}

          <button
            type="button"
            className="dz-auth-inline-link"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  )
}

export default SignUp