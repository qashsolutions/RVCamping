import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchInsuranceQuote } from '../utils/mockApi.js'

const MILEAGE_CHIPS = [
  { label: '10k', value: 10000 },
  { label: '25k', value: 25000 },
  { label: '50k', value: 50000 },
  { label: '100k', value: 100000 },
]

export default function Wizard({ user, onQuote }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vin, setVin] = useState('')
  const [mileage, setMileage] = useState('')
  const [deductible, setDeductible] = useState(150)
  const [loading, setLoading] = useState(false)
  const [offlineMsg, setOfflineMsg] = useState('')

  const mileageNum = parseInt(mileage, 10) || 0
  const estimatedPremium = Math.max(200 * (1 + mileageNum / 200000) - 200 * (deductible / 1000), 45).toFixed(2)

  const canNext = () => {
    if (step === 1) return vehicleNumber.trim().length > 0
    if (step === 2) return true
    if (step === 3) return mileageNum > 0
    return true
  }

  const handleBack = () => {
    if (step === 1) window.location.reload()
    else setStep(step - 1)
  }

  const handleNext = async () => {
    if (step < 4) { setStep(step + 1); return }
    setLoading(true)
    setOfflineMsg('')
    try {
      const result = await fetchInsuranceQuote({ vehicleNumber, vin: vin || null, mileage: mileageNum, deductible })
      onQuote(result)
      navigate('/quote')
    } catch {
      setOfflineMsg("You're offline. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-overlay">
          <div className="spinner" />
          <p className="loading-text">Generating your quote...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header-bar">
        <button className="back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
        <span className="header-title">Vehicle Details</span>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
      </div>
      <p className="step-label">Step {step} of 4</p>

      {/* Card */}
      <div className="card">
        {/* Step 1: Vehicle Number */}
        {step === 1 && (
          <>
            <h3 className="step-question">What's your Vehicle Number?</h3>
            <p className="step-hint">Enter your RV registration or plate number</p>
            <input
              className="input-field no-icon"
              type="text"
              placeholder="e.g. RV-20241"
              value={vehicleNumber}
              onChange={e => setVehicleNumber(e.target.value)}
              autoFocus
            />
          </>
        )}

        {/* Step 2: VIN (optional) */}
        {step === 2 && (
          <>
            <h3 className="step-question">
              What's your VIN? <span className="badge-optional">OPTIONAL</span>
            </h3>
            <p className="step-hint">Vehicle Identification Number (17 characters)</p>
            <input
              className="input-field no-icon"
              type="text"
              placeholder="e.g. 1HGBH41JXMN109186"
              value={vin}
              onChange={e => setVin(e.target.value)}
              maxLength={17}
              style={{ fontFamily: 'monospace' }}
            />
            <div className="info-box" style={{ marginTop: 16 }}>
              You can add your VIN later. Skip to continue without it.
            </div>
          </>
        )}

        {/* Step 3: Mileage */}
        {step === 3 && (
          <>
            <h3 className="step-question">Current Mileage?</h3>
            <p className="step-hint">Approximate odometer reading in miles</p>
            <input
              className="mileage-input"
              type="number"
              placeholder="45000"
              value={mileage}
              onChange={e => setMileage(e.target.value)}
              autoFocus
            />
            <p className="mileage-unit">miles</p>
            <div className="chips">
              {MILEAGE_CHIPS.map(c => (
                <button
                  key={c.value}
                  className={`chip ${mileageNum === c.value ? 'active' : ''}`}
                  onClick={() => setMileage(String(c.value))}
                  type="button"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 4: Deductible */}
        {step === 4 && (
          <>
            <h3 className="step-question">Choose Your Deductible</h3>
            <p className="step-hint">Higher deductible = lower monthly premium</p>
            <div style={{ textAlign: 'center' }}>
              <span className="deductible-value">${deductible}</span>
            </div>
            <input
              type="range"
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
            <div className="premium-estimate">
              <p className="label">Estimated monthly premium</p>
              <p className="value">~${estimatedPremium}/mo</p>
            </div>
          </>
        )}
      </div>

      {offlineMsg && <p className="error-msg" style={{ marginTop: 16 }}>{offlineMsg}</p>}

      {/* Buttons */}
      <div className="btn-row">
        <button className="btn-secondary" onClick={handleBack}>BACK</button>
        <button className="btn-primary" onClick={handleNext} disabled={!canNext()}>
          {step === 2 && !vin.trim() ? 'SKIP' : step === 4 ? 'GET MY QUOTE' : 'NEXT'}
        </button>
      </div>
    </div>
  )
}
