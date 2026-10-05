// Petites fonctions utiles, réutilisées partout dans le site.

// 2500 devient "2 500 DA"
export function formatPrix(montant) {
  return Number(montant).toLocaleString('fr-DZ') + ' DA'
}

// "2026-09-25T13:55:27Z" devient "25/09/2026"
export function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Un numéro de commande lisible, tiré de l'identifiant MongoDB : "CMD-4F2A9C"
export function referenceCommande(id) {
  return 'CMD-' + String(id).slice(-6).toUpperCase()
}

// Image de secours si une photo ne se charge pas (dessin SVG intégré)
export const IMAGE_SECOURS =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" font-size="48" text-anchor="middle" fill="#64748b">🛍️ DZShop</text></svg>'
  )

// Les 5 statuts d'une commande : la "valeur" est celle enregistrée dans MongoDB
// (sans accent, comme dans dzshop-api/models/Order.js), le "libelle" est le texte affiché.
export const STATUTS = [
  { valeur: 'en attente', libelle: 'En attente', couleur: 'warning' },
  { valeur: 'confirmee', libelle: 'Confirmée', couleur: 'primary' },
  { valeur: 'expediee', libelle: 'Expédiée', couleur: 'info' },
  { valeur: 'livree', libelle: 'Livrée', couleur: 'success' },
  { valeur: 'annulee', libelle: 'Annulée', couleur: 'danger' }
]
