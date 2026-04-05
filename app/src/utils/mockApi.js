export async function fetchInsuranceQuote({ vehicleNumber, vin, mileage, deductible }) {
  // Simulate API latency
  await new Promise(r => setTimeout(r, 1500))

  // Simple premium calculation based on mileage and deductible
  const basePremium = 200
  const mileageFactor = 1 + (mileage / 200000)
  const deductibleDiscount = deductible / 1000
  const monthlyPremium = Math.round((basePremium * mileageFactor - basePremium * deductibleDiscount) * 100) / 100

  return {
    quoteId: crypto.randomUUID(),
    monthlyPremium: Math.max(monthlyPremium, 45), // minimum $45
    vehicleNumber,
    vin: vin || null,
    mileage,
    deductible,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }
}
