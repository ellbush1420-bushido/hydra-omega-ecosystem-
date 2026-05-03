const commercialModules = [
  {
    name: 'Product Access Gate',
    icon: '🔐',
    desc: 'Whop product ID → permission tier mapping',
    status: 'Active',
    metrics: { gated: 247, verified: 241, rejected: 6 },
    color: 'border-violet-700',
  },
  {
    name: 'Webhook Validator',
    icon: '📡',
    desc: 'Real-time webhook signature verification',
    status: 'Active',
    metrics: { received: 1243, validated: 1241, failed: 2 },
    color: 'border-emerald-700',
  },
  {
    name: 'Delivery Ledger',
    icon: '📋',
    desc: 'Manifest delivery log and audit trail',
    status: 'Active',
    metrics: { delivered: 234, pending: 7, failed: 0 },
    color: 'border-amber-700',
  },
];

const tacticalModules = [
  {
    name: 'Member Sync',
    icon: '🔄',
    desc: 'Bi-directional member state synchronization',
    status: 'Active',
    lastSync: '2 minutes ago',
    color: 'border-blue-700',
  },
  {
    name: 'Tier Manager',
    icon: '⬆️',
    desc: 'Permission tier escalation and demotion',
    status: 'Active',
    lastAction: 'Upgraded 3 members to Premium',
    color: 'border-violet-600',
  },
  {
    name: 'Content Gating',
    icon: '🚪',
    desc: 'Dynamic content access control by tier',
    status: 'Active',
    lastAction: 'Gated 12 SFW posts, 8 18+ posts',
    color: 'border-red-700',
  },
];

const optimizationMetrics = [
  { label: 'Active Members', value: '247', icon: '👥', accent: 'violet' },
  { label: 'Monthly Revenue', value: '$1,847', icon: '💰', accent: 'gold' },
  { label: 'Conversion Rate', value: '12.4%', icon: '📈', accent: 'emerald' },
  { label: 'Avg Lifetime Value', value: '$94', icon: '⭐', accent: 'violet' },
  { label: 'Churn Rate', value: '4.2%', icon: '📉', accent: 'crimson' },
  { label: 'Webhook Uptime', value: '99.8%', icon: '✅', accent: 'emerald' },
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

export default function WhopBridge() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🌉 Whop Commercial Bridge</h1>
        <p className="section-subtitle">Enterprise membership gateway for Omega Hydra ecosystem</p>
      </div>

      <div className="card bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-700">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h2 className="text-lg font-bold text-white">Commercial Layer Status</h2>
            <p className="text-xs text-gray-400">Real-time Whop integration health</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {optimizationMetrics.map((m) => (
            <div key={m.label} className={`bg-[#0d0d14] rounded-lg p-3 border ${accentMap[m.accent]}`}>
              <div className="text-lg mb-1">{m.icon}</div>
              <div className={`text-base font-bold ${textAccentMap[m.accent]}`}>{m.value}</div>
              <div className="text-[10px] text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-white mb-4">📦 Commercial Modules</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {commercialModules.map((m) => (
            <div key={m.name} className={`card border ${m.color} space-y-3 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-sm font-bold text-white">{m.name}</span>
                </div>
                <span className="badge-green text-[10px]">● Active</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
              <div className="bg-[#0a0a0f] rounded p-2 space-y-1">
                {Object.entries(m.metrics).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{key}</span>
                    <span className="text-xs text-gray-300 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-white mb-4">⚙️ Tactical Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tacticalModules.map((m) => (
            <div key={m.name} className={`card border ${m.color} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-sm font-bold text-white">{m.name}</span>
                </div>
                <span className="badge-green text-[10px]">● Active</span>
              </div>
              <p className="text-xs text-gray-400">{m.desc}</p>
              <div className="bg-[#0a0a0f] rounded p-2">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                  {m.lastSync ? 'Last Sync' : 'Last Action'}
                </div>
                <div className="text-xs text-gray-300">{m.lastSync || m.lastAction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-700 bg-amber-900/10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-400 mb-2">Integration Setup</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Whop webhooks are configured to POST to <code className="text-violet-400 bg-[#0a0a0f] px-1 py-0.5 rounded text-[10px]">/api/whop/webhook</code>.
              Signature validation uses HMAC-SHA256 with stored secret key.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary text-xs">🔧 Configure</button>
              <button className="btn-secondary text-xs">📖 Docs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
