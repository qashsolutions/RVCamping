import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInsuranceQuote } from '../utils/mockApi.js'

const MILEAGE_CHIPS = [
  { label: '10k', value: 10000 },
  { label: '25k', value: 25000 },
  { label: '50k', value: 50000 },
  { label: '100k', value: 100000 },
]

function StepIcon({ step }) {
  const color = '#60a5fa'
  if (step === 1) {
    // RV icon
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="2">
        <rect x="4" y="14" width="32" height="18" rx="3" />
        <rect x="36" y="20" width="8" height="12" rx="2" />
        <circle cx="14" cy="34" r="3" fill={color} />
        <circle cx="30" cy="34" r="3" fill={color} />
        <line x1="8" y1="22" x2="20" y2="22" />
        <rect x="10" y="18" width="8" height="6" rx="1" />
      </svg>
    )
  }
  if (step === 2) {
    // Barcode icon
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" fill={color}>
        <rect x="6" y="10" width="3" height="28" />
        <rect x="12" y="10" width="2" height="28" />
        <rect x="17" y="10" width="4" height="28" />
        <rect x="24" y="10" width="2" height="28" />
        <rect x="29" y="10" width="3" height="28" />
        <rect x="35" y="10" width="2" height="28" />
        <rect x="40" y="10" width="3" height="28" />
      </svg>
    )
  }
  if (step === 3) {
    // Odometer gauge icon
    return (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="2">
        <path d="M8 32a16 16 0 1 1 32 0" />
        <circle cx="24" cy="32" r="3" fill={color} />
        <line x1="24" y1="32" x2="18" y2="20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="28" x2="14" y2="28" />
        <line x1="16" y1="20" x2="17.5" y2="21.5" />
        <line x1="24" y1="17" x2="24" y2="19" />
        <line x1="32" y1="20" x2="30.5" y2="21.5" />
        <line x1="36" y1="28" x2="34" y2="28" />
      </svg>
    )
  }
  // Shield with $ icon
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="2">
      <path d="M24 4 L6 12 L6 24 C6 36 24 44 24 44 C24 44 42 36 42 24 L42 12 Z" />
      <text x="24" y="30" textAnchor="middle" fill={color} stroke="none" fontSize="18" fontWeight="bold">$</text>
    </svg>
  )
}

const STEP_QUESTIONS = [
  'What is your vehicle number?',
  'What is your VIN?',
  'What is your current mileage?',
  'Choose your deductible',
]

export default function Wizard({ user, onQuote }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vin, setVin] = useState('')
  const [mileage, setMileage] = useState('')
  const [deductible, setDeductible] = useState(250)
  const [loading, setLoading] = useState(false)
  const [offlineMsg, setOfflineMsg] = useState('')

  const progressPercent = (step / 4) * 100

  const mileageNum = parseInt(mileage, 10) || 0
  const basePremium = 200
  const factor = 1 + mileageNum / 200000
  const discount = deductible / 1000
  const estimatedPremium = Math.max(basePremium * factor - basePremium * discount, 45).toFixed(2)

  const canNext = () => {
    if (step === 1) return vehicleNumber.trim().length > 0
    if (step === 2) return true // VIN is optional
    if (step === 3) return mileageNum > 0
    if (step === 4) return true
    return false
  }

  const handleBack = () => {
    if (step === 1) {
      // Logout / go back
      window.location.reload()
    } else {
      setStep(step - 1)
    }
  }

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1)
      return
    }

    // Final step - submit
    setLoading(true)
    setOfflineMsg('')
    try {
      const result = await fetchInsuranceQuote({
        vehicleNumber,
        vin: vin || null,
        mileage: mileageNum,
        deductible,
        email: user.email,
      })
      onQuote(result)
      navigate('/quote')
    } catch (err) {
      setOfflineMsg("You're offline. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container wizard-page">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="step-label">Step {step} of 4</p>

      {/* Header */}
      <div className="wizard-header">
        <button className="back-arrow" onClick={handleBack} aria-label="Go back">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e2e8f0" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <h2 className="wizard-title">Vehicle Details</h2>
      </div>

      {/* Step Icon */}
      <div className="step-icon-area">
        <StepIcon step={step} />
      </div>

      {/* Question */}
      <h3 className="step-question">{STEP_QUESTIONS[step - 1]}</h3>

      {/* Step Content */}
      <div className="step-content">
        {step === 1 && (
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              placeholder="e.g. RV-2024-XL"
              value={vehicleNumber}
              onChange={e => setVehicleNumber(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <>
            <div className="input-group">
              <input
                className="input-field"
                type="text"
                placeholder="e.g. 1HGBH41JXMN109186"
                value={vin}
                onChange={e => setVin(e.target.value)}
              />
              <span className="optional-badge">OPTIONAL</span>
            </div>
            <div className="info-box">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="#60a5fa">
                <circle cx="10" cy="10" r="9" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
                <text x="10" y="14.5" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#60a5fa">i</text>
              </svg>
              <span>You can add your VIN later</span>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="input-group">
              <input
                className="input-field"
                type="number"
                placeholder="Enter mileage"
                value={mileage}
                onChange={e => setMileage(e.target.value)}
              />
            </div>
            <div className="chip-row">
              {MILEAGE_CHIPS.map(chip => (
                <button
                  key={chip.value}
                  className={`chip ${mileageNum === chip.value ? 'chip-active' : ''}`}
                  onClick={() => setMileage(String(chip.value))}
                  type="button"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="slider-area">
              <input
                type="range"
                className="range-slider"
                min="20"
                max="500"
                step="10"
                value={deductible}
                onChange={e => setDeductible(Number(e.target.value))}
              />
              <div className="slider-labels">
                <span>$20</span>
                <span>$500</span>
              </div>
              <div className="deductible-display">
                <span className="deductible-value">${deductible}</span>
                <span className="deductible-label">Deductible</span>
              </div>
            </div>
            <div className="premium-estimate">
              <span className="premium-label">Estimated Premium</span>
              <span className="premium-value">${estimatedPremium}/mo</span>
            </div>
          </>
        )}
      </div>

      {/* Offline message */}
      {offlineMsg && <p className="offline-msg">{offlineMsg}</p>}

      {/* Loading spinner */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}

      {/* Buttons */}
      {!loading && (
        <div className="wizard-buttons">
          <button className="btn-secondary" onClick={handleBack}>
            BACK
          </button>
          {step === 2 && !vin.trim() ? (
            <button className="btn-primary" onClick={handleNext}>
              SKIP
            </button>
          ) : step === 4 ? (
            <button className="btn-primary" onClick={handleNext} disabled={!canNext()}>
              GET MY QUOTE
            </button>
          ) : (
            <button className="btn-primary" onClick={handleNext} disabled={!canNext()}>
              NEXT
            </button>
          )}
        </div>
      )}
    </div>
  )
}
