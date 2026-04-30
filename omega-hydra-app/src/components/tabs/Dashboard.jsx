const metrics = [
  { label: "Today's Drops", value: "4", icon: "🔥", accent: "violet" },
  { label: "Revenue", value: "$847", icon: "💰", accent: "gold" },
  { label: "EPC", value: "$2.43", icon: "📈", accent: "emerald" },
  { label: "CTR", value: "6.8%", icon: "🎯", accent: "violet" },
  { label: "Top SubID", value: "velrya-tiktok", icon: "🔗", accent: "crimson" },
  { label: "Recurring Rev", value: "$294/mo", icon: "🔄", accent: "gold" },
  { label: "Product Sales", value: "12", icon: "📦", accent: "emerald" },
  { label: "OurDream Clicks", value: "156", icon: "✨", accent: "violet" },
  { label: "CelebMaker Clicks", value: "89", icon: "⭐", accent: "crimson" },
  { label: "Discord Joins", value: "23", icon: "💬", accent: "gold" },
  { label: "Age-Gate Conv.", value: "34%", icon: "🔐", accent: "violet" },
  { label: "Compliance Risk", value: "Low", icon: "🛡", accent: "emerald" },
  { label: "Growth Score", value: "87/100", icon: "🚀", accent: "gold" },
];

const accentMap = {
  violet: "border-violet-700 shadow-[0_0_15px_rgba(124,58,237,0.2)]",
  gold: "border-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.2)]",
  emerald: "border-emerald-700 shadow-[0_0_15px_rgba(5,150,105,0.2)]",
  crimson: "border-red-700 shadow-[0_0_15px_rgba(220,38,38,0.2)]",
};

const textAccentMap = {
  violet: "text-violet-400",
  gold: "text-amber-400",
  emerald: "text-emerald-400",
  crimson: "text-red-400",
};

const funnelSteps = [
  { label: "Public Post", color: "bg-violet-700" },
  { label: "Curiosity", color: "bg-violet-600" },
  { label: "Link Hub", color: "bg-violet-500" },
  { label: "Age Gate", color: "bg-red-700" },
  { label: "OurDream / Prompt Pack / Book", color: "bg-amber-600" },
  { label: "Discord Vault", color: "bg-emerald-700" },
  { label: "Monthly Membership", color: "bg-emerald-600" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">⬡ Hydra Command Center</h1>
        <p className="section-subtitle">Real-time empire performance metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`metric-card border ${accentMap[m.accent]} transition-shadow`}
          >
            <div className="text-xl mb-2">{m.icon}</div>
            <div className={`text-lg font-bold ${textAccentMap[m.accent]}`}>{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">⬇ Revenue Funnel</h2>
        <div className="space-y-2">
          {funnelSteps.map((step, i) => {
            const width = 100 - i * 10;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className={`${step.color} rounded px-3 py-2 text-xs font-semibold text-white text-center transition-all`}
                  style={{ width: `${width}%` }}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Conversion funnel from public discovery → paid membership
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-3">🐍 Core CTA</h2>
        <div className="text-lg font-bold text-amber-400 italic">
          "Build characters like this."
        </div>
        <div className="text-xs text-gray-500 mt-2">Primary affiliate call-to-action — used across all posts and content</div>
      </div>
    </div>
  );
}
