import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('backend not reachable'))
  }, [])

  return (
    <div>
      <h1>AlgoZoo</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default App