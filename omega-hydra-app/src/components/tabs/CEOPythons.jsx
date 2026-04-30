const pythons = [
  {
    name: 'Content Python',
    icon: '🔥',
    desc: 'Daily drops, SFW pipeline management, platform scheduling',
    status: 'Active',
    lastAction: 'Generated 4 drops for Shadow Monastery',
    color: 'border-violet-700',
  },
  {
    name: 'Affiliate Python',
    icon: '🔗',
    desc: 'OurDreamAI / CelebMakerAI tracking, SubID management',
    status: 'Active',
    lastAction: 'Tracked 156 OurDream clicks via velrya-tiktok',
    color: 'border-amber-700',
  },
  {
    name: 'Book Forge Python',
    icon: '📖',
    desc: 'Mature gothic fantasy writing funnel, product ladder management',
    status: 'Active',
    lastAction: 'Generated Chapter 3 teaser for Velvet Gate',
    color: 'border-red-700',
  },
  {
    name: 'Compliance Python',
    icon: '🛡',
    desc: 'SFW vs 18+ separation, platform risk monitoring',
    status: 'Active',
    lastAction: 'Flagged 1 item for review in Den Mother content',
    color: 'border-emerald-700',
  },
  {
    name: 'Community Python',
    icon: '💬',
    desc: 'Discord roles and faction onboarding',
    status: 'Idle',
    lastAction: 'Onboarded 23 new Discord members this week',
    color: 'border-blue-700',
  },
  {
    name: 'Analytics Python',
    icon: '📈',
    desc: 'EPC, CTR, sales, conversion tracking',
    status: 'Active',
    lastAction: 'Weekly growth score: 87/100',
    color: 'border-violet-600',
  },
  {
    name: 'Lore Python',
    icon: '📜',
    desc: 'Canon continuity, faction lore consistency',
    status: 'Idle',
    lastAction: 'Verified Shadow Monastery doctrine consistency',
    color: 'border-gray-600',
  },
  {
    name: 'Character Python',
    icon: '👁',
    desc: 'Persona consistency, visual prompt management',
    status: 'Active',
    lastAction: 'Updated Velrya CelebMaker prompt v3',
    color: 'border-red-700',
  },
  {
    name: 'Growth Python',
    icon: '🚀',
    desc: 'Weekly optimization, A/B testing',
    status: 'Active',
    lastAction: 'Running A/B test on Scarlet Temple CTA',
    color: 'border-teal-700',
  },
];

export default function CEOPythons() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🖤 CEO Black Grin Python Heads</h1>
        <p className="section-subtitle">9 department pythons — the Hydra's operational intelligence layer</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pythons.map((p) => (
          <div key={p.name} className={`card border ${p.color} space-y-3 hover:shadow-lg transition-shadow`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.icon}</span>
                <span className="text-base font-bold text-white">{p.name}</span>
              </div>
              <span className={p.status === 'Active' ? 'badge-green' : 'badge-amber'}>
                {p.status === 'Active' ? '● Active' : '○ Idle'}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>

            <div className="bg-[#0a0a0f] rounded p-2">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Last Action</div>
              <div className="text-xs text-gray-300">{p.lastAction}</div>
            </div>

            <button className="btn-primary w-full text-xs">⚡ Activate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
