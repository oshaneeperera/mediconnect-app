import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import defaultAvatar from '../assets/patient-avatar.svg'

export default function PatientLayout() {
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('mc_user_email')
    if (!email) return

    fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  return (
    <div className="patient-layout">
      <header className="patient-navbar">
        <div className="patient-navbar__left">
          <p className="patient-navbar__name">{user?.name ?? 'Patient'}</p>
          <p className="patient-navbar__address">{user?.address ?? 'Address not set'}</p>
        </div>

        <div className="patient-navbar__center">
          <input
            className="patient-search"
            type="search"
            placeholder="Search dispensaries or doctors"
            aria-label="Search dispensaries or doctors"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="patient-navbar__right">
          <Link className="icon-button" to="/patient/map" aria-label="Open map">
            🗺️
          </Link>
          <Link className="avatar-button" to="/patient/profile" aria-label="Open profile">
            <img src={user?.profilePictureUrl || defaultAvatar} alt="Patient profile" />
          </Link>
        </div>
      </header>

      <main className="patient-content">
        <Outlet context={{ searchTerm }} />
      </main>
    </div>
  )
}
