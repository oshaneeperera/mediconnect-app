import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dispensaryPlaceholder from '../../assets/dispensary-placeholder.svg'

const facilityIcons = {
  'X-ray': '🩻',
  ECG: '❤️',
  Wheelchair: '♿',
}

export default function DispensaryDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dispensary, setDispensary] = useState(null)
  const [queueStats, setQueueStats] = useState(null)
  const [isInAnotherQueue, setIsInAnotherQueue] = useState(false)
  const [userId, setUserId] = useState(null)
  const [joinError, setJoinError] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/dispensaries/${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setDispensary(data))
      .catch(() => setDispensary(null))

    fetch(`/api/queue/status/${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setQueueStats(data))
      .catch(() => setQueueStats(null))
  }, [id])

  useEffect(() => {
    const email = localStorage.getItem('mc_user_email')
    if (!email) return
    fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.id) return
        setUserId(data.id)
        return fetch(`/api/queue/patient/${data.id}`)
      })
      .then((response) => {
        if (!response) return
        setIsInAnotherQueue(response.ok)
      })
      .catch(() => setIsInAnotherQueue(false))
  }, [])

  const handleJoinQueue = () => {
    if (isInAnotherQueue || !userId || !dispensary?.id) {
      setJoinError('Please make sure you are logged in and not already in a queue.')
      return
    }
    setJoinError('')
    fetch('/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: userId, dispensaryId: dispensary.id }),
    })
      .then((response) => {
        if (!response.ok) {
          setIsInAnotherQueue(true)
          setJoinError('You are already in another queue.')
          return
        }
        navigate(`/patient/queue/${dispensary.id}`)
      })
      .catch(() => setJoinError('Unable to join queue. Please try again.'))
  }

  return (
    <section className="dispensary-details">
      <button className="back-button" type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="details-header">
        <img src={dispensary?.imageUrl || dispensaryPlaceholder} alt={dispensary?.name} />
        <div>
          <h2>{dispensary?.name ?? 'Dispensary'}</h2>
          <p>{dispensary?.doctorName ?? 'Doctor'}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Information</h3>
          <div className="details-list">
            <div>
              <span>Address</span>
              <strong>{dispensary?.address ?? '-'}</strong>
            </div>
            <div>
              <span>Opening Times</span>
              <strong>
                {dispensary?.openingTime && dispensary?.closingTime
                  ? `${dispensary.openingTime} - ${dispensary.closingTime}`
                  : '-'}
              </strong>
            </div>
          </div>
          <div className="facility-list">
            {(dispensary?.facilities ?? []).length > 0 ? (
              dispensary.facilities.map((facility) => (
                <span key={facility} className="facility-pill">
                  {facilityIcons[facility] ?? '🏥'} {facility}
                </span>
              ))
            ) : (
              <span className="facility-pill">No facilities listed</span>
            )}
          </div>
        </div>

        <div className="details-card">
          <h3>Live Stats</h3>
          <div className="details-stats">
            <div>
              <span>Current Queue</span>
              <strong>
                {queueStats?.currentServingToken ? `#${queueStats.currentServingToken}` : '-'}
              </strong>
            </div>
            <div>
              <span>Average Wait</span>
              <strong>
                {queueStats?.totalWaiting != null
                  ? `${queueStats.totalWaiting * 5} mins`
                  : '-'}
              </strong>
            </div>
          </div>
          <button
            className="primary-button join-queue-button"
            type="button"
            onClick={handleJoinQueue}
            disabled={isInAnotherQueue}
          >
            Join Queue
          </button>
          {isInAnotherQueue && (
            <p className="queue-warning">You are already in another queue.</p>
          )}
          {joinError && <p className="queue-warning">{joinError}</p>}
        </div>
      </div>
    </section>
  )
}
