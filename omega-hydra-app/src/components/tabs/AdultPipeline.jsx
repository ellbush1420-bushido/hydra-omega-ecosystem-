import { useState } from 'react';

const gatedContent = [
  { title: "Velrya: The Ninth Veil", faction: "Shadow Monastery", gateStatus: "Gated", compliance: "Approved", revenue: "$143" },
  { title: "Black Spider Lotus: Silk Protocol", faction: "Black Spider Lotus", gateStatus: "Gated", compliance: "Approved", revenue: "$98" },
  { title: "Scarlet Commander's Inner Chamber", faction: "Scarlet Temple", gateStatus: "Gated", compliance: "Needs Review", revenue: "$67" },
  { title: "Ophiuchus Prophecy Files", faction: "Cult of Ophiuchus", gateStatus: "Gated", compliance: "Approved", revenue: "$52" },
  { title: "Den Mother's Web Initiation", faction: "Shadow Monastery", gateStatus: "Ungated", compliance: "Blocked", revenue: "$0" },
];

const complianceColor = {
  Approved: "badge-green",
  "Needs Review": "badge-amber",
  Blocked: "badge-red",
};

export default function AdultPipeline() {
  const [form, setForm] = useState({
    title: '',
    faction: 'Shadow Monastery',
    maturity: 'Suggestive',
    gateStatus: 'Gated',
    compliance: 'Pending',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🔒 18+ Age-Gated Pipeline</h1>
        <p className="section-subtitle">Manage mature content with full compliance controls</p>
      </div>

      <div className="bg-red-950/30 border border-red-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-2xl">🔞</span>
        <div>
          <div className="text-red-400 font-bold text-sm">18+ CONTENT — Age verification required before access</div>
          <div className="text-amber-400 text-xs mt-1">⚠️ Affiliate links may generate commissions. All mature content is age-gated.</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="badge-red">🔞 Age Gate Required</span>
        <span className="badge-green">✅ Affiliate Disclosure Present</span>
        <span className="badge-green">✅ No Minors</span>
        <span className="badge-green">✅ No Real Services</span>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">➕ New Gated Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Title</label>
            <input className="input-field" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Content title..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Faction</label>
            <select className="select-field" value={form.faction} onChange={e => set('faction', e.target.value)}>
              {['Shadow Monastery','Black Spider Lotus','Serpent Sun','Scarlet Temple','Moon Covenant','Order of the Black Sun','Cult of Ophiuchus','Knights of St. Lazarus','Hydra Ascendant'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Maturity Level</label>
            <select className="select-field" value={form.maturity} onChange={e => set('maturity', e.target.value)}>
              {['Suggestive','Mature','Explicit'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Age Gate Status</label>
            <select className="select-field" value={form.gateStatus} onChange={e => set('gateStatus', e.target.value)}>
              {['Gated','Ungated'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Compliance Check</label>
            <select className="select-field" value={form.compliance} onChange={e => set('compliance', e.target.value)}>
              {['Pending','Approved','Needs Review','Blocked'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-crimson">Create Gated Content</button>
          <button className="btn-outline">Run Compliance Check</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">📋 Gated Content Library</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Faction</th>
                <th>Gate Status</th>
                <th>Compliance</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {gatedContent.map((c) => (
                <tr key={c.title}>
                  <td className="font-medium">{c.title}</td>
                  <td><span className="badge-violet">{c.faction}</span></td>
                  <td>
                    <span className={c.gateStatus === 'Gated' ? 'badge-red' : 'badge-amber'}>
                      {c.gateStatus === 'Gated' ? '🔒 Gated' : '⚠️ Ungated'}
                    </span>
                  </td>
                  <td><span className={complianceColor[c.compliance]}>{c.compliance}</span></td>
                  <td className="text-emerald-400 font-medium">{c.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
