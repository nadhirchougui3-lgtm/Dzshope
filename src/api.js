// Un SEUL endroit qui connaît l'adresse de l'API.
// En local : http://localhost:5000. En ligne : la variable VITE_API_URL (séance 18).
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// fetch() + envoi automatique du token de connexion
export async function apiFetch(chemin, options) {

  const opts = options || {}
  const token = localStorage.getItem('token')

  const headers = { ...(opts.headers || {}) }

  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  if (opts.body) {
    headers['Content-Type'] = 'application/json'
  }

  const reponse = await fetch(API_URL + chemin, { ...opts, headers: headers })

  // Token expiré ou invalide : on déconnecte et on renvoie vers la page de connexion
  // (sauf pour login/register, où 401 veut juste dire "mauvais mot de passe")
  const pageAuth = chemin.startsWith('/api/auth/')

  if (reponse.status === 401 && token && !pageAuth) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return reponse
}

// Lit la réponse JSON. Si le serveur a répondu par une erreur, on lance une
// Error avec SON message (ex. "Email ou mot de passe incorrect").
export async function lireJson(reponse) {

  const data = await reponse.json().catch(function () { return {} })

  if (!reponse.ok) {
    throw new Error(data.message || 'Erreur ' + reponse.status)
  }

  return data
}