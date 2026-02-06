import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LocationPicker({ value, onChange }) {
  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng])
    },
  })

  return value ? <Marker position={value} /> : null
}

export default function RegisterPage() {
  const [userType, setUserType] = useState('patient')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [patientForm, setPatientForm] = useState({
    name: '',
    address: '',
    age: '',
    phone: '',
    email: '',
    password: '',
  })

  const [doctorForm, setDoctorForm] = useState({
    doctorName: '',
    hospital: '',
    dispensaryName: '',
    address: '',
    location: null,
    email: '',
    password: '',
    facilities: {
      xray: false,
      ecg: false,
      wheelchair: false,
    },
  })

  const defaultCenter = [-1.286389, 36.817223]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const payload =
      userType === 'patient'
        ? {
            user: {
              name: patientForm.name,
              address: patientForm.address,
              age: patientForm.age ? Number(patientForm.age) : null,
              phoneNumber: patientForm.phone,
              email: patientForm.email,
              password: patientForm.password,
              role: 'PATIENT',
            },
          }
        : {
            user: {
              name: doctorForm.doctorName,
              address: doctorForm.address,
              phoneNumber: '',
              email: doctorForm.email,
              password: doctorForm.password,
              role: 'DOCTOR',
            },
            dispensary: {
              name: doctorForm.dispensaryName,
              doctorName: doctorForm.doctorName,
              address: doctorForm.address,
              openingTime: '08:00',
              closingTime: '17:00',
              facilities: [
                doctorForm.facilities.xray ? 'X-ray' : null,
                doctorForm.facilities.ecg ? 'ECG' : null,
                doctorForm.facilities.wheelchair ? 'Wheelchair' : null,
              ].filter(Boolean),
              availabilityStatus: 'AVAILABLE',
              location: {
                type: 'Point',
                coordinates: doctorForm.location
                  ? [doctorForm.location[1], doctorForm.location[0]]
                  : [0, 0],
              },
              imageUrl: '',
            },
          }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        setError('Registration failed. Please check your details.')
        return
      }

      const user = await response.json()
      localStorage.setItem('mc_user_email', user.email)
      localStorage.setItem('mc_user_role', user.role)
      if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard')
      } else {
        navigate('/patient/home')
      }
    } catch (err) {
      setError('Unable to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="brand">
          <h1>MediConnect</h1>
          <p>Create your secure MediConnect account</p>
        </header>

        <div className="toggle-group" role="group" aria-label="Select user type">
          <button
            type="button"
            className={`toggle-button ${userType === 'patient' ? 'active' : ''}`}
            onClick={() => setUserType('patient')}
          >
            Patient
          </button>
          <button
            type="button"
            className={`toggle-button ${userType === 'doctor' ? 'active' : ''}`}
            onClick={() => setUserType('doctor')}
          >
            Doctor
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {userType === 'patient' ? (
            <>
              <div className="section-title">Patient Details</div>
              <div className="form-grid two-col">
                <div className="form-field">
                  <label htmlFor="patient-name">Full Name</label>
                  <input
                    id="patient-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={patientForm.name}
                    onChange={(event) =>
                      setPatientForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="patient-age">Age</label>
                  <input
                    id="patient-age"
                    type="number"
                    min="0"
                    placeholder="34"
                    value={patientForm.age}
                    onChange={(event) =>
                      setPatientForm((prev) => ({ ...prev, age: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="patient-address">Address</label>
                <input
                  id="patient-address"
                  type="text"
                  placeholder="Street, City, State"
                  value={patientForm.address}
                  onChange={(event) =>
                    setPatientForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-grid two-col">
                <div className="form-field">
                  <label htmlFor="patient-phone">Phone</label>
                  <input
                    id="patient-phone"
                    type="tel"
                    placeholder="+1 555 010 2020"
                    value={patientForm.phone}
                    onChange={(event) =>
                      setPatientForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="patient-email">Email</label>
                  <input
                    id="patient-email"
                    type="email"
                    placeholder="name@example.com"
                    value={patientForm.email}
                    onChange={(event) =>
                      setPatientForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="patient-password">Password</label>
                <input
                  id="patient-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={patientForm.password}
                  onChange={(event) =>
                    setPatientForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="section-title">Doctor Details</div>
              <div className="form-grid two-col">
                <div className="form-field">
                  <label htmlFor="doctor-name">Doctor Name</label>
                  <input
                    id="doctor-name"
                    type="text"
                    placeholder="Dr. Alex Mensah"
                    value={doctorForm.doctorName}
                    onChange={(event) =>
                      setDoctorForm((prev) => ({ ...prev, doctorName: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="doctor-hospital">Government Hospital</label>
                  <input
                    id="doctor-hospital"
                    type="text"
                    placeholder="Central Hospital"
                    value={doctorForm.hospital}
                    onChange={(event) =>
                      setDoctorForm((prev) => ({ ...prev, hospital: event.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="dispensary-name">Dispensary Name</label>
                <input
                  id="dispensary-name"
                  type="text"
                  placeholder="MediConnect Dispensary"
                  value={doctorForm.dispensaryName}
                  onChange={(event) =>
                    setDoctorForm((prev) => ({ ...prev, dispensaryName: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label>Available Facilities</label>
                <div className="facility-options">
                  <label className="facility-option">
                    <input
                      type="checkbox"
                      checked={doctorForm.facilities.xray}
                      onChange={(event) =>
                        setDoctorForm((prev) => ({
                          ...prev,
                          facilities: { ...prev.facilities, xray: event.target.checked },
                        }))
                      }
                    />
                    X-ray
                  </label>
                  <label className="facility-option">
                    <input
                      type="checkbox"
                      checked={doctorForm.facilities.ecg}
                      onChange={(event) =>
                        setDoctorForm((prev) => ({
                          ...prev,
                          facilities: { ...prev.facilities, ecg: event.target.checked },
                        }))
                      }
                    />
                    ECG
                  </label>
                  <label className="facility-option">
                    <input
                      type="checkbox"
                      checked={doctorForm.facilities.wheelchair}
                      onChange={(event) =>
                        setDoctorForm((prev) => ({
                          ...prev,
                          facilities: { ...prev.facilities, wheelchair: event.target.checked },
                        }))
                      }
                    />
                    Wheelchair
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="doctor-address">Address</label>
                <input
                  id="doctor-address"
                  type="text"
                  placeholder="Street, City, State"
                  value={doctorForm.address}
                  onChange={(event) =>
                    setDoctorForm((prev) => ({ ...prev, address: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-grid two-col">
                <div className="form-field">
                  <label>Dispensary Location (tap on map)</label>
                  <div className="map-picker">
                    <MapContainer
                      center={doctorForm.location ?? defaultCenter}
                      zoom={13}
                      className="map-picker__container"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationPicker
                        value={doctorForm.location}
                        onChange={(coords) =>
                          setDoctorForm((prev) => ({ ...prev, location: coords }))
                        }
                      />
                    </MapContainer>
                  </div>
                  <p className="map-helper">
                    {doctorForm.location
                      ? `Selected: ${doctorForm.location[0].toFixed(5)}, ${doctorForm.location[1].toFixed(5)}`
                      : 'Click the map to drop a pin.'}
                  </p>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="dispensary-photo">Dispensary Picture</label>
                <input id="dispensary-photo" type="file" accept="image/*" />
              </div>
              <div className="form-field">
                <label htmlFor="doctor-email">Email</label>
                <input
                  id="doctor-email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={doctorForm.email}
                  onChange={(event) =>
                    setDoctorForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="doctor-password">Password</label>
                <input
                  id="doctor-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={doctorForm.password}
                  onChange={(event) =>
                    setDoctorForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </div>
            </>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              Create {userType === 'doctor' ? 'Doctor' : 'Patient'} Account
            </button>
          </div>
        </form>

        <p className="brand" style={{ marginTop: '18px' }}>
          <span>Already have an account? </span>
          <Link className="auth-link" to="/">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  )
}
