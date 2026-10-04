import { useEffect, useRef, useState } from 'react'

const ADRESSE_SCRIPT = 'https://accounts.google.com/gsi/client'

function GoogleSignInButton({
  onCredential,
  disabled = false,
  onError
}) {
  const dernierCallback = useRef(onCredential)
  const dernierErreur = useRef(onError)
  const [pret, setPret] = useState(false)

  dernierCallback.current = onCredential
  dernierErreur.current = onError

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(
    function () {
      if (!clientId) {
        return
      }

      function initialiserGoogle() {
        if (!window.google || !window.google.accounts?.id) {
          return
        }

        if (!window.google.accounts.id.__dzshopInitialized) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: function (response) {
              if (response?.credential) {
                dernierCallback.current(response.credential)
              }
            }
          })

          window.google.accounts.id.__dzshopInitialized = true
        }

        setPret(true)
      }

      if (window.google?.accounts?.id) {
        initialiserGoogle()
        return
      }

      let script = document.querySelector(
        'script[src="' + ADRESSE_SCRIPT + '"]'
      )

      if (!script) {
        script = document.createElement('script')
        script.src = ADRESSE_SCRIPT
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }

      script.addEventListener('load', initialiserGoogle)

      return function () {
        script.removeEventListener('load', initialiserGoogle)
      }
    },
    [clientId]
  )

  function ouvrirGoogle() {
    if (disabled) {
      return
    }

    if (!clientId) {
      dernierErreur.current?.(
        'Google Sign In is not configured.'
      )
      return
    }

    if (!window.google?.accounts?.id || !pret) {
      dernierErreur.current?.(
        'Google Sign In is not available.'
      )
      return
    }

    window.google.accounts.id.prompt(function (notification) {
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment()
      ) {
        dernierErreur.current?.(
          'Unable to open Google Sign In.'
        )
      }
    })
  }

  if (!clientId) {
    return null
  }

  return (
    <button
      type="button"
      className="dz-auth-google-custom"
      onClick={ouvrirGoogle}
      disabled={disabled || !pret}
    >
      <svg
        width="18"
        height="18"
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

      <span>Continue with Google</span>
    </button>
  )
}

export default GoogleSignInButton