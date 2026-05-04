import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

export default function HydraDashboard() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/scale')
      .then(res => res.json())
      .then(res => setData(res))
  }, [])

  const performance = data.performance || {}
  const decisions = data.decisions || {}

  return (
    <div style={{ padding: 20 }}>
      <h1>Hydra Command Dashboard</h1>

      <h2>Performance</h2>
      {Object.keys(performance).map(char => (
        <div key={char}>
          <h3>{char}</h3>
          <p>Clicks: {performance[char].clicks}</p>
          <p>Sales: {performance[char].sales}</p>
          <p>Revenue: ${performance[char].revenue}</p>
          <strong>Decision: {decisions[char]}</strong>
        </div>
      ))}

      <h2>Leaderboard</h2>
      {Object.keys(performance)
        .sort((a, b) => performance[b].revenue - performance[a].revenue)
        .map(char => (
          <div key={char}>
            {char} - ${performance[char].revenue}
          </div>
        ))}
    </div>
  )
}
