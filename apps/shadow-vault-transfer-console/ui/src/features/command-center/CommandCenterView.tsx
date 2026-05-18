export function CommandCenterView() {
  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Obsidian Grin Command Layer</div>
        <div className="muted">Campaign 001 · Choose Your Crown</div>
      </div>
      <div className="panelBody">
        <div className="grid3">
          <div className="card">
            <div className="cardTitle">Vault Transfer Queue</div>
            <div className="cardValue">0</div>
            <div className="muted">Draft → Review → Approved</div>
          </div>
          <div className="card">
            <div className="cardTitle">Product Routing</div>
            <div className="cardValue">0</div>
            <div className="muted">Prompt packs · Reel templates</div>
          </div>
          <div className="card">
            <div className="cardTitle">Conclave Releases</div>
            <div className="cardValue">0</div>
            <div className="muted">Faction drops · Calendared</div>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="grid2">
          <div className="card">
            <div className="cardTitle">Next action</div>
            <div className="cardValue" style={{ fontSize: 18 }}>
              Forge a character → Motion brief → Vaulted transfer
            </div>
            <div className="muted">This UI is an integration anchor; wire up data next.</div>
          </div>
          <div className="card">
            <div className="cardTitle">System status</div>
            <div className="cardValue" style={{ fontSize: 18 }}>
              Operational
            </div>
            <div className="muted">Canvas warp background + command shell online.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

