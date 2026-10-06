import { formatPrix } from '../utils/format'

function BarChart(props) {
  const data = props.data || []

  const max = Math.max(1, ...data.map(function (d) {
    return d.ventes
  }))

  return (
    <div className="admin-chart">
      <div className="admin-chart-bars">
        {data.map(function (d, index) {
          const hauteur = Math.round((d.ventes / max) * 100)

          return (
            <div className="admin-chart-bar-wrapper" key={index}>
              <div className="w-100 h-100 d-flex flex-column justify-content-end align-items-center">
                <small className="text-muted mb-1">
                  {d.ventes > 0 ? formatPrix(d.ventes) : ''}
                </small>

                <div
                  className="admin-chart-bar"
                  title={d.jour + ' : ' + formatPrix(d.ventes)}
                  style={{ height: hauteur + '%' }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="admin-chart-labels">
        {data.map(function (d, index) {
          return (
            <div className="admin-chart-label" key={index}>
              {d.jour}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BarChart