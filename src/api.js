const API_URL_LOCAL = 'http://localhost:5000'
const API_URL_RESEAU = 'http://192.168.1.12:5000'

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === '192.168.1.12'
    ? API_URL_RESEAU
    : API_URL_LOCAL)

export async function apiFetch(chemin, options) {
  const opts = options || {}
  const token = localStorage.getItem('token')

  const headers = { ...(opts.headers || {}) }

  if (token) {
    headers.Authorization = 'Bearer ' + token
  }

  if (opts.body && typeof opts.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const reponse = await fetch(API_URL + chemin, {
    ...opts,
    headers: headers
  })

  const pageAuth = chemin.startsWith('/api/auth/')

  if (reponse.status === 401 && token && !pageAuth) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return reponse
}

export async function lireJson(reponse) {
  const data = await reponse.json().catch(function () {
    return {}
  })

  if (!reponse.ok) {
    throw new Error(data.message || 'Erreur ' + reponse.status)
  }

  return data
}