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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/patient/home" element={<PatientHomePage />} />
        <Route path="/patient/map" element={<PatientMapPage />} />
        <Route path="/patient/profile" element={<PatientProfilePage />} />
        <Route path="/patient/dispensary/:id" element={<DispensaryDetailsPage />} />
        <Route path="/patient/queue/:id" element={<ActiveQueuePage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
