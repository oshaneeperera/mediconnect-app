import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const greenMarkerIcon = new L.Icon({
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const blueMarkerIcon = new L.Icon({
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const defaultCenter = [5.6037, -0.187]

function RecenterMap({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    if (!center) return
    map.setView(center, zoom ?? map.getZoom(), { animate: true })
  }, [center, map, zoom])

  return null
}

export default function PatientMapPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const focusDispensaryId = searchParams.get('dispensaryId')
  const [dispensaries, setDispensaries] = useState([])
  const [center, setCenter] = useState(defaultCenter)
  const [userLocation, setUserLocation] = useState(null)
  const [manualCenter, setManualCenter] = useState(null)

  useEffect(() => {
    fetch('/api/dispensaries')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setDispensaries(data))
      .catch(() => setDispensaries([]))

    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        setCenter([lat, lon])
        setUserLocation([lat, lon])
      },
      () => null
    )
  }, [])

  useEffect(() => {
    setManualCenter(null)
  }, [focusDispensaryId])

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

  const focusTarget = useMemo(() => {
    if (focusDispensaryId) {
      return markers.find((marker) => marker.id === focusDispensaryId) || null
    }
    return null
  }, [focusDispensaryId, markers])

  const focusCenter = manualCenter ?? focusTarget?.position ?? userLocation
  const focusZoom = manualCenter ? 13 : focusTarget ? 15 : null

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
        <div className="patient-map__actions">
          <button
            className="secondary-button map-focus-button"
            type="button"
            onClick={() => userLocation && setManualCenter(userLocation)}
            disabled={!userLocation}
          >
            Focus my location
          </button>
        </div>
      </div>

      <div className="map-card">
        <MapContainer center={center} zoom={13} className="patient-map__container">
          <RecenterMap center={focusCenter} zoom={focusZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={userLocation} icon={blueMarkerIcon}>
              <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent>
                You are here
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <p className="map-popup__title">Your Location</p>
                </div>
              </Popup>
            </Marker>
          )}
          {markers.map((dispensary) => (
            <Marker
              key={dispensary.id}
              position={dispensary.position}
              icon={greenMarkerIcon}
            >
              <Tooltip direction="top" offset={[0, -24]} opacity={1} permanent>
                {dispensary.name}
              </Tooltip>
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
