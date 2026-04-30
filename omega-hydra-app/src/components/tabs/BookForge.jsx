import { useState } from 'react';

const products = [
  { price: '$9', title: 'Starter Scenes Pack', desc: '3 scenes, 500 words each', tier: 'starter', badge: 'badge-violet' },
  { price: '$15', title: 'Character Identity Prompt Pack', desc: '10 prompts', tier: 'prompt', badge: 'badge-blue' },
  { price: '$29', title: 'Faction Novella', desc: '15,000 words', tier: 'novella', badge: 'badge-amber' },
  { price: '$49', title: 'Mature Gothic Codex', desc: '50,000 words — age-gated', tier: 'codex', badge: 'badge-red', gated: true },
  { price: '$99', title: 'Collector Anthology', desc: 'Complete works', tier: 'anthology', badge: 'badge-amber' },
  { price: '$29/mo', title: 'Velvet Vault Membership', desc: 'Serial chapters, monthly', tier: 'membership', badge: 'badge-green' },
];

const chapters = [
  "1. The Ninth Veil Opens",
  "2. The Confession Room",
  "3. The Den Mother's Web",
  "4. The Scarlet Commander's Vow",
  "5. The Serpent Sun Banquet",
];

export default function BookForge() {
  const [showGated, setShowGated] = useState(false);
  const [genForm, setGenForm] = useState({ tier: 'starter', faction: 'Shadow Monastery', character: 'Velrya' });
  const [generated, setGenerated] = useState(null);

  const setGen = (k, v) => setGenForm(f => ({ ...f, [k]: v }));

  const handleGenerate = () => {
    setGenerated({
      title: `${genForm.character} of the ${genForm.faction}: ${genForm.tier === 'starter' ? 'A Scene Collection' : genForm.tier === 'novella' ? 'Faction Chronicles' : 'Complete Codex'}`,
      teaser: `In the shadow of the ${genForm.faction}, ${genForm.character} walks the razor edge between revelation and ruin. Some veils are meant to be lifted. Others are meant to bind.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">📖 Book Forge</h1>
        <p className="section-subtitle">Gothic fantasy product ladder — from starter scenes to collector anthologies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.title} className={`card hover:border-violet-600 transition-colors ${p.gated ? 'border border-red-800' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="text-2xl font-bold text-amber-400">{p.price}</div>
              <span className={p.badge}>{p.tier}</span>
            </div>
            <div className="text-base font-bold text-white mb-1">{p.title}</div>
            <div className="text-xs text-gray-500">{p.desc}</div>
            {p.gated && <span className="badge-red mt-2 inline-block">🔒 Age-Gated</span>}
            <button className="btn-outline w-full mt-4 text-xs">View Details</button>
          </div>
        ))}
      </div>

      <div className="card border border-violet-700">
        <h2 className="text-base font-bold text-white mb-1">📚 Sample Book</h2>
        <div className="text-lg font-bold text-violet-300 mb-2 italic">The Velvet Gate of the Shadow Monastery</div>

        <div className="bg-[#0a0a0f] rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Public Teaser</div>
          <p className="text-gray-300 text-sm italic">
            "The Monastery does not forbid desire. It teaches you how long you can survive it."
          </p>
        </div>

        <div className="bg-red-950/20 border border-red-800/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-red-400 font-bold uppercase tracking-widest">🔒 Gated Synopsis — 18+ Only</div>
            <button
              className="btn-crimson text-xs py-1"
              onClick={() => setShowGated(!showGated)}
            >
              {showGated ? 'Hide' : 'View Gated Synopsis'}
            </button>
          </div>
          {showGated ? (
            <p className="text-gray-300 text-sm leading-relaxed">
              Behind the Ninth Veil, initiates are tested through confession, proximity, vows, restraint, and forbidden emotional exposure. Every faction believes it can control desire. The Shadow Monastery knows desire is not controlled — it is revealed.
            </p>
          ) : (
            <p className="text-gray-600 text-xs">Age verification required to view mature synopsis.</p>
          )}
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Chapter List</div>
          <div className="space-y-2">
            {chapters.map((ch) => (
              <div key={ch} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-violet-500">▸</span>
                {ch}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">⚙ Content Generator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Product Tier</label>
            <select className="select-field" value={genForm.tier} onChange={e => setGen('tier', e.target.value)}>
              {products.map(p => <option key={p.tier} value={p.tier}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Faction</label>
            <select className="select-field" value={genForm.faction} onChange={e => setGen('faction', e.target.value)}>
              {['Shadow Monastery','Black Spider Lotus','Serpent Sun','Scarlet Temple','Moon Covenant','Order of the Black Sun','Cult of Ophiuchus','Knights of St. Lazarus','Hydra Ascendant'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Character</label>
            <input className="input-field" value={genForm.character} onChange={e => setGen('character', e.target.value)} placeholder="Velrya" />
          </div>
        </div>
        <button className="btn-primary" onClick={handleGenerate}>✨ Generate Title & Teaser</button>

        {generated && (
          <div className="mt-4 bg-[#0a0a0f] rounded-lg p-4 border border-violet-700/50">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Generated Title</div>
            <div className="text-white font-bold mb-3">{generated.title}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Generated Teaser</div>
            <div className="text-gray-300 text-sm italic">{generated.teaser}</div>
          </div>
        )}
      </div>
    </div>
  );
}
