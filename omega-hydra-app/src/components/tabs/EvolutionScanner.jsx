import { useState, useRef, useEffect } from 'react';

const metrics = [
  { label: 'Faction Coverage Score', value: 87, max: 100, unit: '%', color: 'bg-violet-500' },
  { label: 'Content Velocity', value: 4, max: 10, unit: ' drops/day', color: 'bg-amber-500' },
  { label: 'Affiliate Link Health', value: 100, max: 100, unit: '% active', color: 'bg-emerald-500' },
  { label: 'Compliance Score', value: 94, max: 100, unit: '/100', color: 'bg-emerald-500' },
  { label: 'Character Model Coverage', value: 12, max: 27, unit: ' characters', color: 'bg-violet-400' },
  { label: 'Book Forge Output', value: 6, max: 10, unit: ' products', color: 'bg-amber-400' },
  { label: 'Discord Growth', value: 23, max: 100, unit: ' this week', color: 'bg-blue-500' },
  { label: 'Revenue Trajectory', value: 12, max: 100, unit: '% WoW ↑', color: 'bg-emerald-400' },
];

const recommendations = [
  { icon: '🎯', title: 'Add Moon Covenant character', desc: 'Faction coverage missing 2 active characters. Create Lunara persona to complete the Moon Covenant arc.' },
  { icon: '📈', title: 'A/B test scarlet-temple CTA', desc: 'Scarlet Temple CTR is 4.2% vs empire average 6.8%. Test "Rule with me" vs "Obey the temple" hooks.' },
  { icon: '🔗', title: 'Expand Discord onboarding', desc: 'Discord join rate (23/wk) can grow with a pinned "Choose Your Faction" channel and role selection flow.' },
];

export default function EvolutionScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleScan = () => {
    setScanning(true);
    setScanDone(false);
    timerRef.current = setTimeout(() => {
      setScanning(false);
      setScanDone(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title">📡 Evolution Scanner</h1>
          <p className="section-subtitle">System health and empire optimization analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-primary flex items-center gap-2"
            onClick={handleScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <span className="animate-spin">⟳</span>
                Scanning...
              </>
            ) : (
              <>📡 Run Full Scan</>
            )}
          </button>
          {scanDone && (
            <span className="badge-green text-sm">✅ Scan Complete</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => {
          const pct = Math.round((m.value / m.max) * 100);
          return (
            <div key={m.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">{m.label}</span>
                <span className="text-sm font-bold text-white">{m.value}{m.unit}</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${m.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-600 mt-1">{pct}% of target</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">💡 Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map((r) => (
            <div key={r.title} className="flex gap-4 p-3 bg-[#0a0a0f] rounded-lg border border-[#1a1a2e]">
              <span className="text-2xl flex-shrink-0">{r.icon}</span>
              <div>
                <div className="text-sm font-bold text-white mb-1">{r.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
