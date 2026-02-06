import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
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

const defaultCenter = [5.6037, -0.187]

export default function PatientMapPage() {
  const navigate = useNavigate()
  const [dispensaries, setDispensaries] = useState([])
  const [center, setCenter] = useState(defaultCenter)

  useEffect(() => {
    if (!navigator.geolocation) {
      fetch('/api/dispensaries')
        .then((response) => (response.ok ? response.json() : []))
        .then((data) => setDispensaries(data))
        .catch(() => setDispensaries([]))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setCenter([lat, lon])
        fetch(`/api/dispensaries/nearby?lat=${lat}&lon=${lon}`)
          .then((response) => (response.ok ? response.json() : []))
          .then((data) => setDispensaries(data))
          .catch(() => setDispensaries([]))
      },
      () => {
        fetch('/api/dispensaries')
          .then((response) => (response.ok ? response.json() : []))
          .then((data) => setDispensaries(data))
          .catch(() => setDispensaries([]))
      }
    )
  }, [])

  const markers = useMemo(
    () =>
      dispensaries
        .filter((dispensary) => dispensary.location?.coordinates?.length === 2)
        .map((dispensary) => ({
          id: dispensary.id,
          name: dispensary.name,
          position: [
            dispensary.location.coordinates[1],
            dispensary.location.coordinates[0],
          ],
        })),
    [dispensaries]
  )

  return (
    <section className="patient-map">
      <div className="patient-home__header">
        <div>
          <button className="back-button" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h2>Dispensaries Near You</h2>
          <p>Tap a marker to see details and open the dispensary page.</p>
        </div>
      </div>

      <div className="map-card">
        <MapContainer center={center} zoom={13} className="patient-map__container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((dispensary) => (
            <Marker key={dispensary.id} position={dispensary.position}>
              <Popup>
                <div className="map-popup">
                  <p className="map-popup__title">{dispensary.name}</p>
                  <Link className="map-popup__link" to={`/patient/dispensary/${dispensary.id}`}>
                    View
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
