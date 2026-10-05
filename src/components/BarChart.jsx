import { formatPrix } from '../utils/format'

function BarChart(props) {
  const data = props.data || []

  const max = Math.max(1, ...data.map(function (d) {
    return d.ventes
  }))

  return (
    <div className="d-flex align-items-end justify-content-between gap-2" style={{ height: '200px' }}>
      {data.map(function (d, index) {
        const hauteur = Math.round((d.ventes / max) * 100)

        return (
          <div className="flex-fill text-center d-flex flex-column justify-content-end h-100" key={index}>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              {d.ventes > 0 ? formatPrix(d.ventes) : ''}
            </small>

            <div
              className="rounded-top"
              title={d.jour + ' : ' + formatPrix(d.ventes)}
              style={{ height: hauteur + '%', minHeight: '3px', background: '#1d4ed8' }}
            ></div>

            <small className="fw-semibold">{d.jour}</small>
          </div>
        )
      })}
    </div>
  )
}

export default BarChart
