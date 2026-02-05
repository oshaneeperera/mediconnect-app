import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import PatientHomePage from './pages/patient/PatientHomePage.jsx'
import PatientMapPage from './pages/patient/PatientMapPage.jsx'
import PatientProfilePage from './pages/patient/PatientProfilePage.jsx'
import DispensaryDetailsPage from './pages/patient/DispensaryDetailsPage.jsx'
import ActiveQueuePage from './pages/patient/ActiveQueuePage.jsx'
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx'
import PatientLayout from './layouts/PatientLayout.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patient" element={<PatientLayout />}>
          <Route path="home" element={<PatientHomePage />} />
          <Route path="map" element={<PatientMapPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="dispensary/:id" element={<DispensaryDetailsPage />} />
          <Route path="queue/:id" element={<ActiveQueuePage />} />
        </Route>
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
