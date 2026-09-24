import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

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

  function handleGoogleSignUp() {
    alert('Google Sign Up sera configuré prochainement.')
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#ffffff',
        padding: '50px 20px'
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#ffffff',
          border: 'none',
          borderRadius: '18px'
        }}
      >
        <h2 className="text-center mb-4">Create an account</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Your name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Your number"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>

            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Your password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm password</label>

            <div className="position-relative">
              <input
                type={showConfirmation ? 'text' : 'password'}
                className="form-control pe-5"
                placeholder="Confirm your password"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />

              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y border-0"
                onClick={() => setShowConfirmation(!showConfirmation)}
              >
                {showConfirmation ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100">
            Sign Up
          </button>

          <div className="d-flex align-items-center gap-3 my-4">
            <div className="flex-grow-1 border-top"></div>
            <span className="text-muted small fw-semibold">OR</span>
            <div className="flex-grow-1 border-top"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-100 d-flex align-items-center justify-content-center gap-3 bg-white border rounded-3 py-2"
            style={{
              minHeight: '48px',
              fontWeight: '600',
              color: '#202124',
              borderColor: '#dadce0',
              transition: '0.2s ease'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.26z"
              />
              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.5z"
              />
              <path
                fill="#FBBC05"
                d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.59V7.88H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.12l3.24-2.53z"
              />
              <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.49 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38z"
              />
            </svg>

            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp ;