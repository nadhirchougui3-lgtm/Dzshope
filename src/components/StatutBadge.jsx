import { STATUTS } from '../utils/format'

function StatutBadge(props) {
  const statut = STATUTS.find(function (s) {
    return s.valeur === props.statut
  })

  if (!statut) {
    return (
      <span className="admin-badge admin-badge-secondary">
        {props.statut}
      </span>
    )
  }

  return (
    <span className={'admin-badge admin-badge-' + statut.couleur}>
      {statut.libelle}
    </span>
  )
}

export default StatutBadge