
import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
  const buttonStyle = {
    width: '100%',
    minHeight: '48px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#8B1E2D',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  }

  return (
    <main
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: '#FAF9F7',
        boxSizing: 'border-box'
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'clamp(22px, 5vw, 36px)',
          background: '#FFFFFF',
          border: '1px solid #E9E8E6',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(28, 28, 30, 0.05)',
          boxSizing: 'border-box'
        }}
      >
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            marginBottom: '28px',
            color: '#8B1E2D',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Sign In
        </Link>

        <p
          style={{
            margin: '0 0 8px',
            color: '#8B1E2D',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px'
          }}
        >
          DZSHOP
        </p>

        <h1
          style={{
            margin: '0 0 14px',
            color: '#1C1C1E',
            fontSize: 'clamp(24px, 5vw, 30px)',
            lineHeight: 1.25
          }}
        >
          Forgot Password?
        </h1>

        <p
          style={{
            margin: '0 0 20px',
            color: '#666666',
            fontSize: '14px',
            lineHeight: 1.8
          }}
        >
          For your account security, password recovery is handled by the
          DZShop administrator.
        </p>

        <div
          role="status"
          style={{
            marginBottom: '24px',
            padding: '16px',
            border: '1px solid #E9E8E6',
            borderRadius: '8px',
            background: '#FAF9F7',
            color: '#1C1C1E',
            fontSize: '14px',
            lineHeight: 1.8
          }}
        >
          Please contact the store administrator to request a password
          reset. The administrator will verify your account before
          changing your password.
        </div>

        <Link to="/login" style={buttonStyle}>
          Back to Sign In
        </Link>

        <p
          style={{
            margin: '24px 0 0',
            color: '#777777',
            fontSize: '12px',
            lineHeight: 1.6,
            textAlign: 'center'
          }}
        >
          Never share your current password with anyone.
        </p>
      </section>
    </main>
  )
}

export default ForgotPasswordPage
