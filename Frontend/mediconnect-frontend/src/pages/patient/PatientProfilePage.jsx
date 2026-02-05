import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../../assets/patient-avatar.svg'

export default function PatientProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const email = localStorage.getItem('mc_user_email')
    if (!email) return

    fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mc_user_email')
    localStorage.removeItem('mc_user_role')
    navigate('/')
  }

  return (
    <section className="patient-profile">
      <div className="profile-card">
        <div className="profile-card__header">
          <img
            className="profile-avatar"
            src={profile?.profilePictureUrl || defaultAvatar}
            alt="Patient profile"
          />
          <div>
            <h2>{profile?.name ?? 'Patient'}</h2>
            <p>{profile?.address ?? 'Address not set'}</p>
          </div>
        </div>

        <div className="profile-details">
          <div>
            <span>Age</span>
            <strong>{profile?.age ?? '-'}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{profile?.phoneNumber ?? '-'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{profile?.email ?? '-'}</strong>
          </div>
        </div>

        <button className="logout-button" type="button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </section>
  )
}
