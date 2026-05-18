const exampleStages = [
  { label: 'Draft', hint: 'Raw experiment' },
  { label: 'In Review', hint: 'Safety + rights check' },
  { label: 'Approved', hint: 'Eligible to vault' },
  { label: 'Vaulted', hint: 'Stored in Black Lotus' },
  { label: 'Productized', hint: 'Packaged for monetization' },
  { label: 'Conclave Released', hint: 'Routed for community' },
]

export function TransfersView() {
  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Shadow Vault Transfer Queue</div>
        <div className="muted">Govern what moves forward</div>
      </div>
      <div className="panelBody">
        <div className="grid3">
          {exampleStages.map((s) => (
            <div key={s.label} className="card">
              <div className="cardTitle">{s.label}</div>
              <div className="cardValue">0</div>
              <div className="muted">{s.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

