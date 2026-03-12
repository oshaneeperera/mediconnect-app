import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import dispensaryPlaceholder from '../../assets/dispensary-placeholder.svg'

export default function PatientHomePage() {
  const [dispensaries, setDispensaries] = useState([])
  const outletContext = useOutletContext()
  const searchTerm = outletContext?.searchTerm ?? ''

  useEffect(() => {
    fetch('/api/dispensaries/with-wait')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setDispensaries(data))
      .catch(() => setDispensaries([]))
  }, [])

  const filteredDispensaries = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()
    if (!normalizedQuery) return dispensaries

    return dispensaries.filter((entry) => {
      const name = entry.dispensary?.name?.toLowerCase() ?? ''
      const doctor = entry.dispensary?.doctorName?.toLowerCase() ?? ''
      return name.includes(normalizedQuery) || doctor.includes(normalizedQuery)
    })
  }, [dispensaries, searchTerm])

  return (
    <section className="patient-home">
      <div className="patient-home__header">
        <div>
          <h2>Nearby Dispensaries</h2>
          <p>Choose a dispensary to view details and join the queue.</p>
        </div>
      </div>

      <div className="dispensary-grid">
        {filteredDispensaries.map((entry) => (
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
                      : entry.dispensary.availabilityStatus === 'BUSY'
                      ? 'status-busy'
                      : 'status-open'
                  }`}
                >
                  {entry.dispensary.availabilityStatus === 'UNAVAILABLE'
                    ? 'Unavailable'
                    : entry.dispensary.availabilityStatus === 'BUSY'
                    ? 'Busy'
                    : 'Available'}
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
      {dispensaries.length > 0 && filteredDispensaries.length === 0 && (
        <p className="empty-note">No matches for "{searchTerm}".</p>
      )}
    </section>
  )
}
