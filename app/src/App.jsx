import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login.jsx'
import Wizard from './pages/Wizard.jsx'
import Quote from './pages/Quote.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [quoteData, setQuoteData] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Routes>
      <Route path="/" element={<Wizard user={user} onQuote={setQuoteData} />} />
      <Route path="/quote" element={
        quoteData ? <Quote data={quoteData} user={user} onReset={() => setQuoteData(null)} /> : <Navigate to="/" />
      } />
    </Routes>
  )
}
