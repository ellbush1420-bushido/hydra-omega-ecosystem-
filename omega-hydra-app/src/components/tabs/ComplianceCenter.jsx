const checklist = [
  { icon: '✅', label: 'Public-safe content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'Age gate on all mature content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'Affiliate disclosure present', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No minors in any content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No explicit public claims', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No real-world sexual services', status: 'Pass', badge: 'badge-green' },
  { icon: '⚠️', label: 'Platform risk level', status: 'Medium', badge: 'badge-amber' },
  { icon: '✅', label: 'Approved for distribution', status: 'Approved', badge: 'badge-green' },
];

const reviewQueue = [
  { title: "Velrya's Vow — Public Teaser", type: "Character Spotlight", status: "Approved", risk: "Low" },
  { title: "The Ninth Veil — Full Scene", type: "18+ Content", status: "Needs Review", risk: "Medium" },
  { title: "Serpent Sun Banquet Scene", type: "18+ Content", status: "Approved", risk: "Low" },
  { title: "Hydra Labyrinth Manifesto", type: "Faction Identity", status: "Approved", risk: "Low" },
  { title: "Den Mother's Protocol — Gated", type: "18+ Content", status: "Blocked", risk: "High" },
];

const statusColor = {
  Approved: "badge-green",
  "Needs Review": "badge-amber",
  Blocked: "badge-red",
};

const riskColor = {
  Low: "badge-green",
  Medium: "badge-amber",
  High: "badge-red",
};

export default function ComplianceCenter() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">✅ Compliance Center</h1>
        <p className="section-subtitle">Platform risk monitoring and content compliance dashboard</p>
      </div>

      <div className="bg-amber-950/30 border border-amber-700 rounded-xl p-5">
        <div className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">Required Disclosure</div>
        <div className="text-amber-300 font-semibold">
          AI-generated fantasy characters. Affiliate links may generate commissions. 18+ destinations are age-gated.
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">🛡 Compliance Checklist</h2>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1a1a2e] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <span className={item.badge}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">📋 Content Review Queue</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.map((item) => (
                <tr key={item.title}>
                  <td className="font-medium text-gray-200">{item.title}</td>
                  <td className="text-gray-400 text-xs">{item.type}</td>
                  <td><span className={statusColor[item.status]}>{item.status}</span></td>
                  <td><span className={riskColor[item.risk]}>{item.risk}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-emerald text-xs py-1 px-2">Approve</button>
                      <button className="btn-crimson text-xs py-1 px-2">Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
