import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dispensaryPlaceholder from '../../assets/dispensary-placeholder.svg'

export default function PatientHomePage() {
  const [dispensaries, setDispensaries] = useState([])

  useEffect(() => {
    fetch('/api/dispensaries/with-wait')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setDispensaries(data))
      .catch(() => setDispensaries([]))
  }, [])

  return (
    <section className="patient-home">
      <div className="patient-home__header">
        <div>
          <h2>Nearby Dispensaries</h2>
          <p>Choose a dispensary to view details and join the queue.</p>
        </div>
      </div>

      <div className="dispensary-grid">
        {dispensaries.map((entry) => (
          <Link
            key={entry.dispensary.id}
            to={`/patient/dispensary/${entry.dispensary.id}`}
            className="dispensary-card"
          >
            <img
              src={entry.dispensary.imageUrl || dispensaryPlaceholder}
              alt={entry.dispensary.name}
              className="dispensary-card__image"
            />
            <div className="dispensary-card__body">
              <div className="dispensary-card__title">
                <h3>{entry.dispensary.name}</h3>
                <span
                  className={`status-pill ${
                    entry.dispensary.availabilityStatus === 'UNAVAILABLE'
                      ? 'status-closed'
                      : 'status-open'
                  }`}
                >
                  {entry.dispensary.availabilityStatus === 'UNAVAILABLE' ? 'Closed' : 'Open'}
                </span>
              </div>
              <p className="dispensary-card__doctor">{entry.dispensary.doctorName}</p>
              <p className="dispensary-card__wait">
                Avg wait: {entry.averageWaitMinutes ?? '-'} mins
              </p>
            </div>
          </Link>
        ))}
      </div>

      {dispensaries.length === 0 && (
        <p className="empty-note">No dispensaries found yet.</p>
      )}
    </section>
  )
}
