import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ActiveQueuePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [assignedNumber, setAssignedNumber] = useState(null)
  const [queueStats, setQueueStats] = useState(null)
  const [anonymousPatients, setAnonymousPatients] = useState([])
  const [availabilityStatus, setAvailabilityStatus] = useState(null)

  useEffect(() => {
    const email = localStorage.getItem('mc_user_email')
    if (!email) return
    fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.id) return
        return fetch(`/api/queue/patient/${data.id}`)
      })
      .then((response) => (response && response.ok ? response.json() : null))
      .then((entry) => setAssignedNumber(entry?.tokenNumber ?? null))
      .catch(() => setAssignedNumber(null))
  }, [])

  useEffect(() => {
    if (!id) return
    fetch(`/api/queue/status/${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setQueueStats(data)
        setAnonymousPatients(data?.anonymousPatients ?? [])
      })
      .catch(() => setQueueStats(null))

    fetch(`/api/dispensaries/${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setAvailabilityStatus(data?.availabilityStatus ?? null))
      .catch(() => setAvailabilityStatus(null))
  }, [id])

  return (
    <section className="queue-room">
      <div className="queue-card">
        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <header>
          <h2>Your Queue Number</h2>
          <p className="queue-number">{assignedNumber ? `#${assignedNumber}` : '-'}</p>
          <p className="queue-status">
            Current Token Serving:{' '}
            {queueStats?.currentServingToken ? `#${queueStats.currentServingToken}` : '-'}
          </p>
        </header>

        <div className="queue-section">
          <h3>People Ahead of You</h3>
          <ul className="queue-list">
            {anonymousPatients.map((token) => (
              <li key={token}>
                {token} - Waiting
              </li>
            ))}
          </ul>
        </div>

        {availabilityStatus !== 'UNAVAILABLE' && (
          <div className="queue-section">
            <h3>Estimated Waiting Time</h3>
            <p className="queue-wait">
              {queueStats?.totalWaiting != null
                ? `${queueStats.totalWaiting * 5} mins`
                : '-'}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
