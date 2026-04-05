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
    <div className="page-container quote-page">
      {/* Header */}
      <div className="quote-header">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2563eb" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h1 className="quote-ready-title">Quote Ready!</h1>
      </div>

      {/* Certificate Card */}
      <div className="certificate-card">
        <div className="certificate-inner">
          {/* Pine tree icon + header */}
          <div className="certificate-logo">
            <svg viewBox="0 0 48 48" width="36" height="36">
              <g transform="translate(24, 20)" fill="#2563eb">
                <polygon points="0,-16 -7.2,-2 -4.8,-2 -10,10 -3.2,10 -3.2,15 3.2,15 3.2,10 10,10 4.8,-2 7.2,-2"/>
              </g>
            </svg>
            <div>
              <p className="certificate-brand">RV CAMPING</p>
              <p className="certificate-type">INSURANCE QUOTE</p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="certificate-divider">
            <span className="divider-line" />
            <span className="divider-diamond">&#9670;</span>
            <span className="divider-line" />
          </div>

          {/* Quote ID */}
          <p className="quote-id">
            Quote ID: <span className="mono">{data.quoteId}</span>
          </p>

          {/* Premium highlight */}
          <div className="premium-highlight">
            <span className="premium-big">${data.premium}</span>
            <span className="premium-period">/month</span>
          </div>

          {/* Details */}
          <div className="quote-details">
            <div className="detail-row">
              <span className="detail-label">Policyholder</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Vehicle</span>
              <span className="detail-value">{data.vehicleNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">VIN</span>
              <span className="detail-value">{data.vin || 'Not provided (optional)'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mileage</span>
              <span className="detail-value">{Number(data.mileage).toLocaleString()} mi</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Deductible</span>
              <span className="detail-value">${data.deductible}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date</span>
              <span className="detail-value">{data.date || new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Validity note */}
          <p className="validity-note">
            <em>This quote is valid for 30 days from the date of issue.</em>
          </p>

          {/* Decorative divider */}
          <div className="certificate-divider">
            <span className="divider-line" />
            <span className="divider-diamond">&#9670;</span>
            <span className="divider-line" />
          </div>

          {/* Footer */}
          <p className="certificate-footer">ADVENTURE INSURED</p>
        </div>
      </div>

      {/* Actions */}
      <button className="btn-primary download-btn" onClick={handleDownload}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        DOWNLOAD PDF
      </button>

      <button className="link-btn" onClick={handleNewQuote}>
        Start New Quote
      </button>
    </div>
  )
}
