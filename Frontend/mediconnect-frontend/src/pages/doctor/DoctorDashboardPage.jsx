import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DoctorDashboardPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Available')
  const [queue, setQueue] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [dispensary, setDispensary] = useState(null)

  const queueList = useMemo(() => queue, [queue])

  useEffect(() => {
    const email = localStorage.getItem('mc_user_email')
    if (!email) return

    fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setDoctor(data)
        if (!data?.id) return null
        return fetch(`/api/dispensaries/doctor/${data.id}`)
      })
      .then((response) => (response && response.ok ? response.json() : null))
      .then((dispensaryData) => {
        if (!dispensaryData) return
        setDispensary(dispensaryData)
        if (dispensaryData.availabilityStatus) {
          const readable = dispensaryData.availabilityStatus
            .toLowerCase()
            .replace('_', ' ')
          setStatus(readable.charAt(0).toUpperCase() + readable.slice(1))
        }
        return fetch(`/api/queue/doctor/list/${dispensaryData.id}`)
      })
      .then((response) => (response && response.ok ? response.json() : null))
      .then((queueData) => {
        if (!queueData) return
        setCurrentPatient(queueData.currentPatient)
        setQueue(queueData.waitingPatients ?? [])
      })
      .catch(() => null)
  }, [])

  const refreshQueue = () => {
    if (!dispensary?.id) return
    fetch(`/api/queue/doctor/list/${dispensary.id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((queueData) => {
        if (!queueData) return
        setCurrentPatient(queueData.currentPatient)
        setQueue(queueData.waitingPatients ?? [])
      })
      .catch(() => null)
  }

  const handleCallNext = () => {
    if (!dispensary?.id) return
    fetch('/api/queue/doctor/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispensaryId: dispensary.id }),
    }).finally(refreshQueue)
  }

  const handleReportAbsence = () => {
    if (!dispensary?.id) return
    fetch('/api/queue/doctor/next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dispensaryId: dispensary.id }),
    }).finally(refreshQueue)
  }

  const handleLogout = () => {
    localStorage.removeItem('mc_user_email')
    localStorage.removeItem('mc_user_role')
    navigate('/')
  }

  return (
    <section className="doctor-dashboard">
      <header className="doctor-header">
        <div>
          <h2>{doctor?.name ?? 'Doctor'}</h2>
          <p>{dispensary?.address ?? 'Dispensary address not set'}</p>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      <div className="doctor-grid">
        <div className="doctor-card">
          <h3>Availability</h3>
          <div className="status-controls">
            {['Available', 'Busy', 'Unavailable'].map((label) => (
              <button
                key={label}
                type="button"
                className={`status-button ${
                  status === label ? 'active' : ''
                } status-${label.toLowerCase()}`}
                onClick={() => {
                  if (!doctor?.id) return
                  setStatus(label)
                  fetch('/api/queue/doctor/update-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ doctorId: doctor.id, status: label }),
                  }).catch(() => null)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="status-note">Current status: {status}</p>
        </div>

        <div className="doctor-card">
          <h3>Current Patient</h3>
          <div className="current-patient">
            <div>
              <span>Name</span>
              <strong>{currentPatient?.name ?? 'No patient'}</strong>
            </div>
            <div>
              <span>Age</span>
              <strong>{currentPatient?.age ?? '-'}</strong>
            </div>
          </div>
          <div className="doctor-actions">
            <button className="primary-button" type="button" onClick={handleCallNext}>
              Call Next Patient
            </button>
            <button className="secondary-button" type="button" onClick={handleReportAbsence}>
              Report Absence
            </button>
          </div>
        </div>

        <div className="doctor-card doctor-queue">
          <h3>Queue List</h3>
          {queueList.length === 0 ? (
            <p className="empty-note">No patients waiting.</p>
          ) : (
            <ul className="doctor-queue-list">
              {queueList.map((patient) => (
                <li key={patient.tokenNumber}>
                  <span>{patient.name}</span>
                  <strong>#{patient.tokenNumber}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
