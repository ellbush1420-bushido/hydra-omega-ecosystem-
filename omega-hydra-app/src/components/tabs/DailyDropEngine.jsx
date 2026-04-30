import { useState } from 'react';

const dayFactions = [
  { day: 'Monday', faction: 'Shadow Monastery', color: 'text-violet-400' },
  { day: 'Tuesday', faction: 'Black Spider Lotus', color: 'text-red-400' },
  { day: 'Wednesday', faction: 'Serpent Sun', color: 'text-amber-400' },
  { day: 'Thursday', faction: 'Scarlet Temple', color: 'text-red-300' },
  { day: 'Friday', faction: 'Knights of St. Lazarus', color: 'text-emerald-400' },
  { day: 'Saturday', faction: 'Cult of Ophiuchus', color: 'text-violet-300' },
  { day: 'Sunday', faction: 'Black Sun / Hydra Labyrinth', color: 'text-gray-300' },
];

const postTemplates = [
  {
    category: 'Character Spotlight',
    icon: '👁',
    hook: "She doesn't speak until silence becomes unbearable.",
    visual: "Portrait: obsidian veil, violet shadows, serpent motif.",
    breakdown: "Velrya teaches through absence. Every vow she takes removes one comfort from her initiates.",
    tool: "OurDreamAI lets you explore this character's full lore.",
    linkLock: "Link in bio — age-gated inner sanctum awaits.",
    color: 'border-violet-700',
  },
  {
    category: 'Faction Identity',
    icon: '🐍',
    hook: "The Shadow Monastery doesn't forbid desire. It measures it.",
    visual: "Faction sigil: coiled serpent above monastery gate.",
    breakdown: "Six veils. Six tests. Six ways desire is used to reveal character.",
    tool: "CelebMakerAI for your own Shadow Monastery persona.",
    linkLock: "Discover the faction's full doctrine — link in bio.",
    color: 'border-emerald-700',
  },
  {
    category: 'Moral Choice',
    icon: '⚖',
    hook: "Would you take the vow if you knew what it costs?",
    visual: "Two figures at a monastery threshold — one entering, one leaving.",
    breakdown: "Every faction demands something. The Monastery demands honesty. Most fail.",
    tool: "Build your own faction character with OurDreamAI.",
    linkLock: "Take the test — link in bio.",
    color: 'border-amber-700',
  },
  {
    category: 'Affiliate CTA',
    icon: '🔗',
    hook: "You've seen the lore. Now live it.",
    visual: "Character montage — all 9 factions represented.",
    breakdown: "OurDreamAI lets you build, talk to, and evolve gothic fantasy characters.",
    tool: "CelebMakerAI for custom visual character portraits.",
    linkLock: "Build characters like this. — Link in bio.",
    color: 'border-red-700',
  },
];

export default function DailyDropEngine() {
  const [generated, setGenerated] = useState(false);
  const [copying, setCopying] = useState(false);

  const dayOfWeek = new Date().getDay();
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const today = dayFactions[todayIndex];

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleCopyAll = () => {
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🔥 Daily Drop Engine</h1>
        <p className="section-subtitle">Automated daily content drops by faction schedule</p>
      </div>

      <div className="card border border-violet-700 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Today's Faction</div>
            <div className={`text-2xl font-bold ${today.color}`}>{today.faction}</div>
            <div className="text-xs text-gray-500 mt-1">{today.day}</div>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary" onClick={handleGenerate}>⚡ Generate Drop</button>
            <button className="btn-outline" onClick={handleCopyAll}>
              {copying ? '✅ Copied!' : '📋 Copy All'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {postTemplates.map((post) => (
          <div key={post.category} className={`card border ${post.color} space-y-3`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{post.icon}</span>
              <span className="text-sm font-bold text-white">{post.category}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500 uppercase tracking-widest">Hook</span>
                <p className="text-gray-300 mt-0.5">{post.hook}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-widest">Visual Proof</span>
                <p className="text-gray-300 mt-0.5">{post.visual}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-widest">Breakdown</span>
                <p className="text-gray-300 mt-0.5">{post.breakdown}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-widest">Tool Mention</span>
                <p className="text-gray-300 mt-0.5">{post.tool}</p>
              </div>
              <div>
                <span className="text-gray-500 uppercase tracking-widest">Link Lock</span>
                <p className="text-amber-400 mt-0.5 italic font-medium">{post.linkLock}</p>
              </div>
            </div>
            {generated && (
              <div className="text-[10px] text-emerald-400">✅ Generated for {today.faction}</div>
            )}
            <div className="text-xs text-amber-400 italic font-semibold border-t border-[#2a2a3e] pt-2">
              "Build characters like this."
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">📅 Weekly Faction Schedule</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Faction</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dayFactions.map((d, i) => (
                <tr key={d.day}>
                  <td className="font-medium text-gray-300">{d.day}</td>
                  <td><span className={`font-semibold ${d.color}`}>{d.faction}</span></td>
                  <td>
                    <span className={i === todayIndex ? 'badge-green' : 'badge-violet'}>
                      {i === todayIndex ? '🔥 Today' : 'Scheduled'}
                    </span>
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
