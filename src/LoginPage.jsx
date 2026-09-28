import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'
import { useAuth } from './AuthContext'
import GoogleSignInButton from './GoogleSignInButton'

function LoginPage() {
  const { login, loginGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [telephone, setTelephone] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

  async function connexionGoogle(credential) {
    setErreur('')

    try {
      await loginGoogle(credential)
      navigate(destination, { replace: true })
    } catch (err) {
      setErreur(err.message)
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f8f8f8 0%, #ffffff 50%, #fff5f5 100%)',
        padding: '60px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1050px',
          minHeight: '610px',
          background: '#ffffff',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.10)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #111111 0%, #1c1c1c 60%, #b40000 100%)',
            color: '#ffffff',
            padding: '55px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'rgba(255, 0, 0, 0.12)',
              top: '-80px',
              right: '-80px'
            }}
          />

          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              bottom: '-60px',
              left: '-60px'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '3px',
                color: '#ff3b3b',
                marginBottom: '18px'
              }}
            >
              DZSHOP
            </div>

            <h1
              style={{
                fontSize: '44px',
                fontWeight: '800',
                lineHeight: '1.1',
                marginBottom: '20px'
              }}
            >
              Welcome
              <br />
              Back.
            </h1>

            <p
              style={{
                color: '#d5d5d5',
                fontSize: '16px',
                lineHeight: '1.7',
                maxWidth: '380px',
                margin: 0
              }}
            >
              Sign in to your account and continue shopping with DZShop.
            </p>

            <div
              style={{
                marginTop: '45px',
                width: '55px',
                height: '4px',
                borderRadius: '10px',
                background: '#e00000'
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '55px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '30px',
                fontWeight: '800',
                color: '#111111',
                marginBottom: '8px'
              }}
            >
              Sign In
            </h2>

            <p
              style={{
                color: '#777777',
                margin: 0,
                fontSize: '14px'
              }}
            >
              Enter your details to access your account.
            </p>
          </div>

          {erreur && (
            <div
              style={{
                background: '#fff1f1',
                border: '1px solid #ffcaca',
                color: '#c00000',
                borderRadius: '12px',
                padding: '12px 15px',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            >
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '22px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#222222',
                  marginBottom: '8px'
                }}
              >
                Phone number
              </label>

              <input
                type="tel"
                placeholder="Your number"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '52px',
                  border: '1px solid #dddddd',
                  borderRadius: '12px',
                  padding: '0 16px',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#fafafa',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '26px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#222222',
                  marginBottom: '8px'
                }}
              >
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '52px',
                    border: '1px solid #dddddd',
                    borderRadius: '12px',
                    padding: '0 50px 0 16px',
                    fontSize: '14px',
                    outline: 'none',
                    background: '#fafafa',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    border: 'none',
                    background: 'transparent',
                    color: '#777777',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={envoi}
              style={{
                width: '100%',
                height: '52px',
                border: 'none',
                borderRadius: '12px',
                background: '#111111',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: envoi ? 'not-allowed' : 'pointer',
                opacity: envoi ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: '0.2s ease'
              }}
            >
              {envoi ? 'Connexion...' : 'Sign In'}
              {!envoi && <FaArrowRight size={13} />}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                margin: '27px 0'
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#e5e5e5'
                }}
              />

              <span
                style={{
                  color: '#999999',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                OR
              </span>

              <div
                style={{
                  flex: 1,
                  height: '1px',
                  background: '#e5e5e5'
                }}
              />
            </div>

            <GoogleSignInButton onCredential={connexionGoogle} />

            <p
              style={{
                textAlign: 'center',
                marginTop: '25px',
                marginBottom: 0,
                color: '#777777',
                fontSize: '14px'
              }}
            >
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#c00000',
                  fontWeight: '700',
                  textDecoration: 'none'
                }}
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .login-page-layout {
              grid-template-columns: 1fr !important;
            }
          }

          input:focus {
            border-color: #c00000 !important;
            box-shadow: 0 0 0 3px rgba(192, 0, 0, 0.08);
          }
        `}
      </style>
    </div>
  )
}

export default LoginPage
