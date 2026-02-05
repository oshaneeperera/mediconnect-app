import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const queueData = {
  currentServing: 5,
  estimatedWait: '22 mins',
  patients: [6, 7, 8, 9, 10, 11],
}

export default function ActiveQueuePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const assignedNumber = useMemo(() => {
    const parsed = Number.parseInt(id ?? '0', 10)
    return Number.isNaN(parsed) ? 12 : parsed + 11
  }, [id])

  const handleLeaveQueue = () => {
    navigate('/patient/home')
  }

  return (
    <section className="queue-room">
      <div className="queue-card">
        <header>
          <h2>Your Queue Number</h2>
          <p className="queue-number">#{assignedNumber}</p>
          <p className="queue-status">Current Token Serving: #{queueData.currentServing}</p>
        </header>

        <div className="queue-section">
          <h3>People Ahead of You</h3>
          <ul className="queue-list">
            {queueData.patients.map((patientNumber) => (
              <li key={patientNumber}>
                Patient #{patientNumber} - Waiting
              </li>
            ))}
          </ul>
        </div>

        <div className="queue-section">
          <h3>Estimated Waiting Time</h3>
          <p className="queue-wait">{queueData.estimatedWait}</p>
        </div>

        <button className="leave-queue-button" type="button" onClick={handleLeaveQueue}>
          Leave Queue
        </button>
      </div>
    </section>
  )
}
