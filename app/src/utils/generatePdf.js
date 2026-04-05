import { jsPDF } from 'jspdf'

export function generateQuotePdf(quote, userEmail) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(15, 27, 45) // #0f1b2d
  doc.rect(0, 0, w, 45, 'F')
  doc.setTextColor(224, 234, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('RV CAMPING', w / 2, 22, { align: 'center' })
  doc.setFontSize(12)
  doc.text('INSURANCE QUOTE', w / 2, 32, { align: 'center' })

  // Dashed border box
  doc.setDrawColor(203, 213, 225)
  doc.setLineDashPattern([3, 2], 0)
  doc.rect(15, 55, w - 30, 190)
  doc.setLineDashPattern([], 0)

  // Quote ID
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(9)
  doc.setFont('courier', 'normal')
  doc.text(`Quote ID: ${quote.quoteId}`, w / 2, 65, { align: 'center' })

  // Premium box
  doc.setFillColor(219, 234, 254) // #dbeafe
  doc.roundedRect(30, 72, w - 60, 35, 5, 5, 'F')
  doc.setTextColor(100, 116, 139)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('MONTHLY PREMIUM', w / 2, 82, { align: 'center' })
  doc.setTextColor(30, 58, 95)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(`$${quote.monthlyPremium.toFixed(2)}`, w / 2, 100, { align: 'center' })

  // Details
  let y = 125
  const addRow = (label, value) => {
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(label, 25, y)
    doc.setTextColor(15, 27, 45)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 25, y + 8)
    doc.setDrawColor(226, 232, 240)
    doc.line(25, y + 13, w - 25, y + 13)
    y += 22
  }

  addRow('POLICYHOLDER', userEmail)
  addRow('VEHICLE', quote.vehicleNumber)
  addRow('VIN', quote.vin || 'Not provided')
  addRow('MILEAGE', `${quote.mileage.toLocaleString()} miles`)
  addRow('DEDUCTIBLE', `$${quote.deductible.toFixed(2)}`)
  addRow('DATE', quote.date)

  // Footer text
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('This quote is valid for 30 days from the date of issue.', w / 2, y + 5, { align: 'center' })
  doc.text('Coverage subject to terms and conditions.', w / 2, y + 11, { align: 'center' })

  // Bottom line
  doc.setDrawColor(30, 58, 95)
  doc.line(25, y + 18, w - 25, y + 18)
  doc.setTextColor(30, 58, 95)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('ADVENTURE INSURED', w / 2, y + 25, { align: 'center' })

  doc.save(`rv-insurance-quote-${quote.quoteId.slice(0, 8)}.pdf`)
}
