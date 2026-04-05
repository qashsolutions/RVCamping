import { useState } from 'react'
import { authenticateUser } from '../data/users.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const hasLength = password.length >= 8
  const hasAlphanumeric = /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
  const hasSpecial = (password.match(/[^a-zA-Z0-9]/g) || []).length >= 2
  const isPasswordValid = hasLength && hasAlphanumeric && hasSpecial
  const isFormValid = email.includes('@') && isPasswordValid

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const user = authenticateUser(email, password)
    if (user) {
      onLogin(user)
    } else {
      setError('Invalid email or password. Try ramanac+1@gmail.com with Abc1234$$')
    }
  }

  return (
    <div className="page-container">
      {/* Logo */}
      <div className="logo-area">
        <svg viewBox="0 0 48 48" className="logo-icon">
          <g transform="translate(24, 20)" fill="#60a5fa">
            <polygon points="0,-16 -7.2,-2 -4.8,-2 -10,10 -3.2,10 -3.2,15 3.2,15 3.2,10 10,10 4.8,-2 7.2,-2"/>
          </g>
        </svg>
        <h1 className="app-title">RV Camping</h1>
        <p className="app-subtitle">Insurance</p>
      </div>

      {/* Card */}
      <div className="card">
        <h2 className="card-title">Welcome Back</h2>
        <p className="card-subtitle">Sign in to get your RV insured</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label">EMAIL</label>
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 20 16" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <rect x="1" y="1" width="18" height="14" rx="2"/>
              <polyline points="1,1 10,9 19,1"/>
            </svg>
            <input
              className="input-field"
              type="email"
              placeholder="camper@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <label className="field-label">PASSWORD</label>
          <div className="input-group">
            <svg className="input-icon" viewBox="0 0 16 20" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <rect x="1" y="9" width="14" height="10" rx="2"/>
              <path d="M4,9 V6 a4,4 0 0,1 8,0 V9"/>
            </svg>
            <input
              className="input-field"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" width="22" height="22">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" width="22" height="22">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          <p className="password-hint">8 chars min, alphanumeric + 2 special characters</p>
          <div className="validation-dots">
            <span className={`vdot ${hasLength ? 'active' : ''}`}>8+ chars</span>
            <span className={`vdot ${hasAlphanumeric ? 'active' : ''}`}>Alphanumeric</span>
            <span className={`vdot ${hasSpecial ? 'active' : ''}`}>2 special</span>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary" disabled={!isFormValid}>
            SIGN IN
          </button>
        </form>
      </div>

      <div className="offline-badge">
        <span className="offline-dot" />
        Works Offline
      </div>
    </div>
  )
}
