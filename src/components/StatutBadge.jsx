import { STATUTS } from '../utils/format'

function StatutBadge(props) {
  const statut = STATUTS.find(function (s) {
    return s.valeur === props.statut
  })

  if (!statut) {
    return <span className="badge text-bg-secondary">{props.statut}</span>
  }

  return <span className={'badge text-bg-' + statut.couleur}>{statut.libelle}</span>
}

export default StatutBadge
