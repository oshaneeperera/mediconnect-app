import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [userType, setUserType] = useState('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        setError('Invalid email or password.')
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
      setError('Unable to login. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="brand">
          <h1>MediConnect</h1>
          <p>Secure access for patients and doctors</p>
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
          <div className="form-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              Login as {userType === 'doctor' ? 'Doctor' : 'Patient'}
            </button>
          </div>
        </form>

        <p className="brand" style={{ marginTop: '18px' }}>
          <span>New to MediConnect? </span>
          <Link className="auth-link" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
