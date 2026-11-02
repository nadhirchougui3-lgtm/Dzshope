
import { useEffect, useRef, useState } from 'react'

const ADRESSE_SCRIPT = 'https://accounts.google.com/gsi/client'

function GoogleSignInButton({
  onCredential,
  disabled = false,
  onError
}) {
  const dernierCallback = useRef(onCredential)
  const dernierErreur = useRef(onError)
  const conteneur = useRef(null)
  const [pret, setPret] = useState(false)

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    dernierCallback.current = onCredential
    dernierErreur.current = onError
  }, [onCredential, onError])

  useEffect(
    function () {
      if (!clientId) {
        return
      }

      let actif = true

      const gestionnaireCredential = function (credential) {
        if (credential) {
          dernierCallback.current(credential)
        }
      }

      window.__dzshopGoogleCredentialHandler =
        gestionnaireCredential

      function initialiserGoogle() {
        if (!actif) {
          return
        }

        if (!window.google?.accounts?.id || !conteneur.current) {
          return
        }

        if (!window.__dzshopGoogleInitialized) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: function (response) {
              window.__dzshopGoogleCredentialHandler?.(
                response?.credential
              )
            }
          })

          window.__dzshopGoogleInitialized = true
        }

        if (!conteneur.current) {
          return
        }

        conteneur.current.innerHTML = ''

        window.google.accounts.id.renderButton(
          conteneur.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 360
          }
        )

        setPret(true)
      }

      function traiterErreurScript() {
        dernierErreur.current?.(
          new Error('Unable to load Google Sign-In script')
        )
      }

      if (window.google?.accounts?.id) {
        initialiserGoogle()

        return function () {
          actif = false

          if (
            window.__dzshopGoogleCredentialHandler ===
            gestionnaireCredential
          ) {
            delete window.__dzshopGoogleCredentialHandler
          }
        }
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
      script.addEventListener('error', traiterErreurScript)

      return function () {
        actif = false
        script.removeEventListener('load', initialiserGoogle)
        script.removeEventListener('error', traiterErreurScript)

        if (
          window.__dzshopGoogleCredentialHandler ===
          gestionnaireCredential
        ) {
          delete window.__dzshopGoogleCredentialHandler
        }
      }
    },
    [clientId]
  )

  if (!clientId) {
    return null
  }

  return (
    <div
      ref={conteneur}
      className="dz-auth-google-container"
      aria-disabled={disabled || !pret}
      style={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        minHeight: '44px',
        display: 'flex',
        justifyContent: 'center'
      }}
    />
  )
}

export default GoogleSignInButton
