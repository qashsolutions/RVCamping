import { useNavigate } from 'react-router-dom'
import { generateQuotePdf } from '../utils/generatePdf.js'

export default function Quote({ data, user, onReset }) {
  const navigate = useNavigate()

  if (!data) {
    return (
      <div className="page-container">
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '4rem' }}>
          No quote data available.
        </p>
      </div>
    )
  }

  const handleDownload = () => {
    generateQuotePdf(data, user.email)
  }

  const handleNewQuote = () => {
    onReset()
    navigate('/')
  }

  return (
    <div className="page-container">
      <h1 className="quote-header">Quote Ready!</h1>

      <div className="certificate">
        <div className="certificate-inner">
          {/* Header */}
          <div className="cert-header">
            <svg viewBox="0 0 48 48" className="cert-logo">
              <g transform="translate(24, 20)" fill="#1e3a5f">
                <polygon points="0,-14 -6,-1 -4,-1 -9,9 -3,9 -3,13 3,13 3,9 9,9 4,-1 6,-1"/>
              </g>
            </svg>
            <p className="cert-company">RV CAMPING</p>
            <p className="cert-type">INSURANCE QUOTE</p>
          </div>

          <div className="cert-divider" />
          <div className="cert-divider-thin" />

          {/* Quote ID */}
          <p className="cert-quote-id">Quote ID: {data.quoteId}</p>

          {/* Premium */}
          <div className="cert-premium-box">
            <p className="cert-premium-label">MONTHLY PREMIUM</p>
            <p className="cert-premium-value">${data.monthlyPremium.toFixed(2)}</p>
          </div>

          {/* Details */}
          <div className="cert-row">
            <p className="cert-row-label">POLICYHOLDER</p>
            <p className="cert-row-value">{user.email}</p>
          </div>
          <div className="cert-row-divider" />

          <div className="cert-row">
            <p className="cert-row-label">VEHICLE</p>
            <p className="cert-row-value">{data.vehicleNumber}</p>
          </div>
          <div className="cert-row-divider" />

          <div className="cert-row">
            <p className="cert-row-label">VIN</p>
            <p className="cert-row-value" style={!data.vin ? { color: '#94a3b8', fontStyle: 'italic' } : {}}>
              {data.vin || 'Not provided (optional)'}
            </p>
          </div>
          <div className="cert-row-divider" />

          <div style={{ display: 'flex', gap: 16 }}>
            <div className="cert-row" style={{ flex: 1 }}>
              <p className="cert-row-label">MILEAGE</p>
              <p className="cert-row-value">{data.mileage.toLocaleString()} mi</p>
            </div>
            <div className="cert-row" style={{ flex: 1 }}>
              <p className="cert-row-label">DEDUCTIBLE</p>
              <p className="cert-row-value" style={{ fontWeight: 600 }}>${data.deductible.toFixed(2)}</p>
            </div>
          </div>
          <div className="cert-row-divider" />

          <div className="cert-row">
            <p className="cert-row-label">DATE</p>
            <p className="cert-row-value">{data.date}</p>
          </div>

          {/* Footer */}
          <p className="cert-footer-note">
            This quote is valid for 30 days from the date of issue.<br />
            Coverage subject to terms and conditions.
          </p>

          <p className="cert-footer-brand">ADVENTURE INSURED</p>
        </div>
      </div>

      {/* Actions */}
      <button className="btn-primary" onClick={handleDownload} style={{ marginTop: 20 }}>
        DOWNLOAD PDF
      </button>
      <button className="link-btn" onClick={handleNewQuote}>
        Start New Quote
      </button>
    </div>
  )
}
