import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dispensaryPlaceholder from '../../assets/dispensary-placeholder.svg'

const dispensaryData = [
  {
    id: '1',
    name: 'Green Valley Dispensary',
    doctor: 'Dr. Amina Abebe',
    address: '15 Spring Road, East Legon, Accra',
    openingTimes: 'Mon - Sat, 8:00 AM - 6:00 PM',
    facilities: ['X-ray', 'ECG', 'Wheelchair'],
    queueNumber: 12,
    averageWait: '18 mins',
  },
  {
    id: '2',
    name: 'Ridgeview Medical Point',
    doctor: 'Dr. Kojo Mensah',
    address: '22 Ridgeview Ave, Airport, Accra',
    openingTimes: 'Mon - Fri, 9:00 AM - 5:00 PM',
    facilities: ['ECG', 'Wheelchair'],
    queueNumber: 7,
    averageWait: '25 mins',
  },
]

const facilityIcons = {
  'X-ray': '🩻',
  ECG: '❤️',
  Wheelchair: '♿',
}

export default function DispensaryDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isInAnotherQueue] = useState(false)

  const dispensary = useMemo(
    () => dispensaryData.find((item) => item.id === id) ?? dispensaryData[0],
    [id]
  )

  const handleJoinQueue = () => {
    if (isInAnotherQueue) return
    navigate(`/patient/queue/${dispensary.id}`)
  }

  return (
    <section className="dispensary-details">
      <div className="details-header">
        <img src={dispensaryPlaceholder} alt={dispensary.name} />
        <div>
          <h2>{dispensary.name}</h2>
          <p>{dispensary.doctor}</p>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Information</h3>
          <div className="details-list">
            <div>
              <span>Address</span>
              <strong>{dispensary.address}</strong>
            </div>
            <div>
              <span>Opening Times</span>
              <strong>{dispensary.openingTimes}</strong>
            </div>
          </div>
          <div className="facility-list">
            {dispensary.facilities.map((facility) => (
              <span key={facility} className="facility-pill">
                {facilityIcons[facility] ?? '🏥'} {facility}
              </span>
            ))}
          </div>
        </div>

        <div className="details-card">
          <h3>Live Stats</h3>
          <div className="details-stats">
            <div>
              <span>Current Queue</span>
              <strong>#{dispensary.queueNumber}</strong>
            </div>
            <div>
              <span>Average Wait</span>
              <strong>{dispensary.averageWait}</strong>
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
        </div>
      </div>
    </section>
  )
}
