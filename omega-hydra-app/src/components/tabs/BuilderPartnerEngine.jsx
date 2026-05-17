const metrics = [
  { label: 'Partner Rails', value: '4', icon: '🤝', accent: 'violet' },
  { label: 'Builder Briefs', value: '12', icon: '🧱', accent: 'gold' },
  { label: 'Offer Tests', value: '3', icon: '🧪', accent: 'emerald' },
  { label: 'Scale Queue', value: '2', icon: '🚀', accent: 'crimson' },
];

const accentMap = {
  violet: 'border-violet-700 shadow-[0_0_15px_rgba(124,58,237,0.2)]',
  gold: 'border-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.2)]',
  emerald: 'border-emerald-700 shadow-[0_0_15px_rgba(5,150,105,0.2)]',
  crimson: 'border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.2)]',
};

const textAccentMap = {
  violet: 'text-violet-400',
  gold: 'text-amber-400',
  emerald: 'text-emerald-400',
  crimson: 'text-red-400',
};

const partnerRows = [
  {
    partner: 'Base44-style Builder Rail',
    role: 'App Builder Affiliate',
    payout: 'Editable / verify terms',
    cookie: 'Editable',
    contentFit: 'Black Vault build logs',
    decision: 'Scale',
    badge: 'badge-green',
  },
  {
    partner: 'Hydra Dashboard Case Studies',
    role: 'Owned content asset',
    payout: 'Indirect EPC lift',
    cookie: 'N/A',
    contentFit: 'Creator infrastructure',
    decision: 'Scale',
    badge: 'badge-violet',
  },
  {
    partner: 'No-code Tool Comparisons',
    role: 'SEO support rail',
    payout: 'Partner-dependent',
    cookie: 'Partner-dependent',
    contentFit: 'Tutorial + review content',
    decision: 'Test',
    badge: 'badge-amber',
  },
];

const contentPlanner = [
  {
    title: 'How Black Vault became an owner-only command app',
    angle: 'Builder journey → affiliate CTA',
    channel: 'SEO / newsletter',
    status: 'Ready for brief',
  },
  {
    title: 'Build a private content intelligence dashboard without coding',
    angle: 'Operator pain → app-builder rail',
    channel: 'Long-form tutorial',
    status: 'Drafting',
  },
  {
    title: 'Hydra Character Forge case study',
    angle: 'Feature walkthrough → partner comparison',
    channel: 'Video + blog',
    status: 'Queued',
  },
];

const subidRows = [
  { key: 'sub1', meaning: 'Page or build-log slug', sample: 'black-vault-build-log' },
  { key: 'sub2', meaning: 'CTA placement', sample: 'cta-mid' },
  { key: 'sub3', meaning: 'Traffic source', sample: 'organic' },
  { key: 'sub4', meaning: 'Offer angle / test variant', sample: 'builder-story-a' },
  { key: 'sub5', meaning: 'Tracker or campaign ID', sample: 'foundry-001' },
];

export default function BuilderPartnerEngine() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🤝 Hydra Builder Partner Engine</h1>
        <p className="section-subtitle">Monetize the system-building journey with partner rails, case studies, and tracked builder content.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className={`metric-card border ${accentMap[metric.accent]}`}>
            <div className="text-xl mb-2">{metric.icon}</div>
            <div className={`text-lg font-bold ${textAccentMap[metric.accent]}`}>{metric.value}</div>
            <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="card border border-amber-700/40 bg-amber-950/10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-white mb-2">⚡ Proprietary doctrine</h2>
            <p className="text-sm text-gray-300 max-w-4xl">
              External app builders reveal the market. Hydra converts that pattern into a private partner registry, builder-story library, and decision board for Scale / Test / Await Clarification / Kill.
            </p>
          </div>
          <span className="badge-gold">Public-safe monetization rail</span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div>
            <h2 className="text-base font-bold text-white">📚 Partner Registry</h2>
            <p className="text-xs text-gray-500 mt-1">Editable structure for infrastructure affiliates and owned builder assets.</p>
          </div>
          <button className="btn-primary text-xs">+ Add Partner Rail</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Partner / Asset</th>
                <th>Role</th>
                <th>Economics</th>
                <th>Cookie</th>
                <th>Content Fit</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {partnerRows.map((row) => (
                <tr key={row.partner}>
                  <td className="font-semibold text-white">{row.partner}</td>
                  <td>{row.role}</td>
                  <td>{row.payout}</td>
                  <td>{row.cookie}</td>
                  <td>{row.contentFit}</td>
                  <td><span className={row.badge}>{row.decision}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-bold text-white mb-4">🧱 Build-Log Content Planner</h2>
          <div className="space-y-3">
            {contentPlanner.map((item) => (
              <div key={item.title} className="rounded-lg border border-[#1a1a2e] bg-[#0a0a0f] p-4">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="text-xs text-violet-400 mt-2">{item.angle}</div>
                <div className="flex items-center justify-between gap-3 mt-3 text-xs">
                  <span className="text-gray-500">{item.channel}</span>
                  <span className="badge-blue">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-bold text-white mb-4">🔗 Builder Attribution Template</h2>
          <div className="space-y-3">
            {subidRows.map((row) => (
              <div key={row.key} className="grid grid-cols-1 sm:grid-cols-[84px_1fr] gap-3 rounded-lg border border-[#1a1a2e] bg-[#0a0a0f] p-3">
                <div className="font-mono text-violet-400 text-sm">{row.key}</div>
                <div>
                  <div className="text-sm text-white">{row.meaning}</div>
                  <div className="text-xs text-gray-500 mt-1">Sample: {row.sample}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">⚖ Scale / Test / Kill Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            ['Scale', 'Case-study content and partner rails with verified economics', 'badge-green'],
            ['Test', 'No-code comparisons, referral tutorials, operator roundups', 'badge-amber'],
            ['Await Clarification', 'Programs with incomplete payout or attribution data', 'badge-violet'],
            ['Kill', 'Low-fit partners that distract from the Hydra build story', 'badge-red'],
          ].map(([title, body, badge]) => (
            <div key={title} className="rounded-xl border border-[#1a1a2e] bg-[#0a0a0f] p-4">
              <span className={badge}>{title}</span>
              <p className="text-sm text-gray-300 mt-3">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
