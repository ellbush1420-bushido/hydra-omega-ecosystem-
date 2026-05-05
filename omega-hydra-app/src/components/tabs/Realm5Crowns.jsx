import { useState, useReducer, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const FACTIONS = [
  { id: 'shadow_serpent', name: 'Shadow Serpent Monastery', short: 'SERPENT', emoji: '🐍', color: 'border-violet-600', accent: 'text-violet-400', bg: 'bg-violet-900/10', lore: 'Perception, restraint, shadow wisdom.', xpBonus: '2× Labyrinth XP' },
  { id: 'scarlet_temple', name: 'Crimson Coil Cathedral', short: 'SCARLET', emoji: '🔴', color: 'border-red-600', accent: 'text-red-400', bg: 'bg-red-900/10', lore: 'Command, discipline, sacred force.', xpBonus: '2× Kingdom Raid XP' },
  { id: 'ophiuchus', name: 'Cult of Ophiuchus', short: 'WEB', emoji: '🌀', color: 'border-emerald-600', accent: 'text-emerald-400', bg: 'bg-emerald-900/10', lore: 'Serpent prophecy, transformation, Void Hydra influence.', xpBonus: '2× Arena XP' },
  { id: 'black_sun', name: 'Order of the Black Sun', short: 'SUN', emoji: '☀️', color: 'border-gray-500', accent: 'text-gray-300', bg: 'bg-gray-900/20', lore: 'Judgment, containment, sacred law.', xpBonus: '2× Scale Score' },
  { id: 'lazarus', name: 'Radiant Guardian Knight Society', short: 'LAZARUS', emoji: '⚔️', color: 'border-teal-500', accent: 'text-teal-400', bg: 'bg-teal-900/10', lore: 'Healing, restoration, guardian intervention.', xpBonus: '2× Join Bonus XP' },
];

const SCENARIOS = {
  shadowArena: [
    { id: 'sa_01', title: 'The Veil Trial', desc: 'A masked opponent challenges you.', choices: [{ id: 'sa_01_a', text: 'Strike from darkness', xp: 40, score: 5, outcome: 'Shadow reputation grows.' }, { id: 'sa_01_b', text: 'Fight with honour', xp: 35, score: 4, outcome: 'Join bonus unlocked.', joins: 1 }, { id: 'sa_01_c', text: 'Negotiate an alliance', xp: 50, score: 6, outcome: 'Prophecy scroll found.', codex: 'prophecy_i' }] },
    { id: 'sa_02', title: 'The Black Tiger Gauntlet', desc: 'Three shadow challengers. One promotion contract.', choices: [{ id: 'sa_02_a', text: 'Accept the gauntlet', xp: 80, score: 10, tiger: 'Black Tiger I', outcome: 'Black Tiger I achieved.', revenue: 0 }, { id: 'sa_02_b', text: 'Train further', xp: 30, score: 3, outcome: 'Training XP applied.' }] },
    { id: 'sa_03', title: 'The Cipher Duel', desc: 'Your opponent carries a forbidden codex.', choices: [{ id: 'sa_03_a', text: 'Challenge for the codex', xp: 60, score: 7, codex: 'cipher_vol_ii', outcome: 'Cipher Codex Vol. II unlocked.' }, { id: 'sa_03_b', text: 'Observe their style', xp: 45, score: 4, outcome: 'Bonus XP for next scenario.' }] },
  ],
  kingdomRaid: [
    { id: 'kr_01', title: 'The First Gate', desc: 'Choose your kingdom entry strategy.', choices: [{ id: 'kr_01_a', text: 'Breach the northern gate', xp: 55, score: 6, revenue: 47, outcome: 'Revenue vault captured: +$47.' }, { id: 'kr_01_b', text: 'Infiltrate via merchant quarter', xp: 65, score: 8, codex: 'merchant_scroll_i', outcome: 'Codex fragment recovered.' }, { id: 'kr_01_c', text: 'Send a parley', xp: 70, score: 9, joins: 3, outcome: 'Join count +3.' }] },
    { id: 'kr_02', title: 'The Treasure Vault', desc: 'The faction treasury is guarded.', choices: [{ id: 'kr_02_a', text: 'Fight the guardian', xp: 75, score: 8, revenue: 120, outcome: 'Full vault looted: +$120.' }, { id: 'kr_02_b', text: 'Unlock via Cipher Codex', xp: 90, score: 10, revenue: 90, codex: 'vault_fragment_i', outcome: 'Vault opened silently: +$90.' }] },
  ],
  hydraLabyrinth: [
    { id: 'hl_01', title: "The Hydra's First Eye", desc: 'The Crown Eye activates. Answer to proceed.', choices: [{ id: 'hl_01_a', text: 'I seek power through discipline', xp: 45, score: 5, outcome: 'Scarlet alignment bonus.' }, { id: 'hl_01_b', text: 'I seek power through shadow', xp: 45, score: 5, outcome: 'Serpent alignment bonus.' }, { id: 'hl_01_c', text: 'I seek transformation beyond power', xp: 50, score: 6, outcome: 'Void alignment detected.' }] },
    { id: 'hl_02', title: 'The Commerce Eye', desc: 'Choose a product ladder item to carry forward.', choices: [{ id: 'hl_02_a', text: 'Shadow Moon Prompt Pack ($9)', xp: 30, score: 3, revenue: 9, sales: 1, outcome: 'Mock sale: +$9.' }, { id: 'hl_02_b', text: 'Initiate Founders Pack ($27)', xp: 50, score: 6, revenue: 27, sales: 1, outcome: 'Mock sale: +$27.' }, { id: 'hl_02_c', text: 'Codex Vault Membership ($47/mo)', xp: 80, score: 10, revenue: 47, sales: 1, codex: 'vault_membership', outcome: 'Vault access granted: +$47/mo.' }] },
    { id: 'hl_03', title: 'The White Tiger Gate', desc: 'The White Tiger spirit appears at the final gate.', choices: [{ id: 'hl_03_a', text: 'Bow and request passage', xp: 100, score: 12, tiger: 'White Tiger I', outcome: 'White Tiger I rank granted.' }, { id: 'hl_03_b', text: 'Challenge the Tiger', xp: 150, score: 15, tiger: 'White Tiger II', outcome: 'White Tiger II granted to the worthy.' }] },
  ],
};

const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

function getLevel(xp) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) lvl = i + 1;
    else break;
  }
  return Math.min(lvl, 10);
}

function calcRecommendation(state) {
  if (!state.faction) return null;
  if (state.tigerRank?.includes('White Tiger')) return '🐅 White Tiger Path — You are ready for the Hydra Founders Council.';
  if (state.revenue > 100) return '💰 Commerce Eye Active — Focus on the Codex Vault conversion path.';
  if (state.scaleScore > 30) return '📡 Scale Score Elevated — Shadow Arena expansion recommended.';
  if (getLevel(state.xp) >= 5) return '⬆️ Mid-Rank — Kingdom Raid campaigns now available.';
  return '🐍 Initiate Path — Complete Shadow Arena trials to unlock your next rank.';
}

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_FACTION': return { ...state, faction: action.faction };
    case 'APPLY_CHOICE': {
      const c = action.choice;
      const newXp = state.xp + (c.xp || 0);
      const ns = {
        ...state,
        xp: newXp,
        scaleScore: state.scaleScore + (c.score || 0),
        revenue: state.revenue + (c.revenue || 0),
        joins: state.joins + (c.joins || 0),
        sales: state.sales + (c.sales || 0),
        clicks: state.clicks + 1,
        codexUnlocks: c.codex && !state.codexUnlocks.includes(c.codex) ? [...state.codexUnlocks, c.codex] : state.codexUnlocks,
        tigerRank: c.tiger || state.tigerRank,
        choiceHistory: [{ scenarioId: action.scenarioId, choiceId: c.id, xp: c.xp, outcome: c.outcome }, ...state.choiceHistory].slice(0, 50),
      };
      return { ...ns, recommendation: calcRecommendation(ns) };
    }
    default: return state;
  }
}

const initialPlayerState = {
  faction: null,
  xp: 0,
  scaleScore: 0,
  revenue: 0,
  joins: 0,
  sales: 0,
  clicks: 0,
  tigerRank: null,
  codexUnlocks: [],
  choiceHistory: [],
  recommendation: null,
};

// ─── Event Log ────────────────────────────────────────────────────────────────

function useEventLog() {
  const [events, setEvents] = useState([]);
  const log = useCallback((type, payload = {}) => {
    setEvents(prev => [{ id: `e${Date.now()}`, type, ts: new Date().toLocaleTimeString(), ...payload }, ...prev].slice(0, 80));
  }, []);
  return { events, log };
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function XPBar({ xp }) {
  const lvl = getLevel(xp);
  const current = LEVEL_XP[lvl - 1] || 0;
  const next = LEVEL_XP[lvl] || xp;
  const pct = next > current ? Math.round(((xp - current) / (next - current)) * 100) : 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Lv {lvl}</span>
        <span>{xp} XP</span>
        {lvl < 10 && <span>{next - xp} to next</span>}
      </div>
      <div className="progress-bar"><div className="progress-fill bg-violet-600" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function TigerTrack({ rank }) {
  const RANKS = ['Black Tiger I', 'Black Tiger II', 'White Tiger I', 'White Tiger II'];
  const idx = rank ? RANKS.indexOf(rank) : -1;
  return (
    <div className="flex gap-2 flex-wrap">
      {RANKS.map((r, i) => (
        <span key={r} className={`text-xs px-2 py-1 rounded-full border ${i <= idx ? 'border-amber-500 text-amber-400 bg-amber-900/20' : 'border-gray-700 text-gray-600'}`}>
          {i <= 1 ? '🐯' : '🐅'} {r}
        </span>
      ))}
    </div>
  );
}

function FactionGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FACTIONS.map(f => (
        <button
          key={f.id}
          onClick={() => onSelect(f)}
          className={`card border ${f.color} ${f.bg} text-left space-y-2 hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{f.emoji}</span>
            <div>
              <div className={`text-sm font-bold tracking-widest ${f.accent}`}>{f.short}</div>
              <div className="text-xs text-gray-400">{f.name}</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{f.lore}</p>
          <div className={`text-xs font-semibold ${f.accent}`}>⚡ {f.xpBonus}</div>
        </button>
      ))}
    </div>
  );
}

function ScenarioPanel({ scenarios, label, emoji, color, onChoice, completedIds }) {
  const [active, setActive] = useState(null);
  const [chosen, setChosen] = useState({});

  const handleChoice = (scenario, choice) => {
    setChosen(prev => ({ ...prev, [scenario.id]: choice.id }));
    onChoice(scenario.id, choice);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold flex items-center gap-2 ${color}`}>{emoji} {label}</h3>
      {scenarios.map(s => {
        const done = completedIds.has(s.id);
        const isOpen = active === s.id;
        return (
          <div key={s.id} className={`card border ${done ? 'border-emerald-700/50' : 'border-[#1a1a2e]'} space-y-2`}>
            <button
              className="w-full text-left flex items-center justify-between"
              onClick={() => setActive(isOpen ? null : s.id)}
            >
              <div>
                <span className="text-sm font-semibold text-white">{s.title}</span>
                {done && <span className="ml-2 text-xs text-emerald-400">✓ Complete</span>}
              </div>
              <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="space-y-2 pt-2 border-t border-[#1a1a2e]">
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                <div className="space-y-2">
                  {s.choices.map(c => {
                    const picked = chosen[s.id] === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleChoice(s, c)}
                        disabled={!!chosen[s.id]}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                          picked
                            ? 'border-violet-500 bg-violet-900/20'
                            : chosen[s.id]
                              ? 'border-gray-800 opacity-40'
                              : 'border-[#1a1a2e] hover:border-violet-700 hover:bg-violet-900/10'
                        }`}
                      >
                        <div className="text-gray-200 mb-1">{c.text}</div>
                        {picked && (
                          <div className="space-y-1">
                            <div className="text-emerald-400">{c.outcome}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="badge-violet">+{c.xp} XP</span>
                              <span className="badge-blue">+{c.score} Score</span>
                              {c.revenue != null && c.revenue > 0 && <span className="badge-amber">+${c.revenue}</span>}
                              {(c.joins || 0) > 0 && <span className="badge-green">+{c.joins} Join</span>}
                              {c.tiger && <span className="badge-amber">🐯 {c.tiger}</span>}
                              {c.codex && <span className="badge-green">📜 Codex</span>}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Realm5Crowns() {
  const [player, dispatch] = useReducer(playerReducer, initialPlayerState);
  const { events, log } = useEventLog();
  const [activeTab, setActiveTab] = useState('faction');

  const completedScenarioIds = new Set(player.choiceHistory.map(h => h.scenarioId));

  const handleFactionSelect = (faction) => {
    dispatch({ type: 'SET_FACTION', faction });
    log('faction_select', { faction: faction.id });
    setActiveTab('arenas');
  };

  const handleChoice = (scenarioId, choice) => {
    dispatch({ type: 'APPLY_CHOICE', scenarioId, choice });
    log('scenario_choice', { scenarioId, choiceId: choice.id, xp: choice.xp });
  };

  const TABS = [
    { id: 'faction', label: 'Crown', emoji: '👑' },
    { id: 'arenas', label: 'Arenas', emoji: '⚔️' },
    { id: 'codex', label: 'Codex', emoji: '📜' },
    { id: 'eyes', label: 'Hydra Eyes', emoji: '👁' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">👑 Realm of 5 Crowns</h1>
        <p className="section-subtitle">Playable faction game · Shadow Arena · Kingdom Raids · Hydra Labyrinth · Hydra Eyes tracking</p>
      </div>

      {/* Inner tab bar */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-violet-700 text-white'
                : 'bg-[#12121a] border border-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* ── Crown / Faction Select ── */}
      {activeTab === 'faction' && (
        <div className="space-y-4">
          <div className="card space-y-3">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Current Crown</div>
            {player.faction ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl">{player.faction.emoji}</span>
                <div>
                  <div className={`font-bold tracking-widest ${player.faction.accent}`}>{player.faction.short}</div>
                  <div className="text-xs text-gray-400">{player.faction.name}</div>
                </div>
                <button className="ml-auto btn-outline text-xs" onClick={() => dispatch({ type: 'SET_FACTION', faction: null })}>Change</button>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No crown chosen. Select your faction below.</p>
            )}
          </div>

          {player.faction && (
            <div className="card space-y-3">
              <XPBar xp={player.xp} />
              <TigerTrack rank={player.tigerRank} />
            </div>
          )}

          <div className="text-xs text-gray-500 uppercase tracking-widest mt-2">Five Crowns</div>
          <FactionGrid onSelect={handleFactionSelect} />
        </div>
      )}

      {/* ── Arenas ── */}
      {activeTab === 'arenas' && (
        <div className="space-y-6">
          {!player.faction && (
            <div className="card border border-amber-700/50 text-amber-400 text-sm">
              ⚠️ Choose your Crown first to begin arena trials.
            </div>
          )}

          {player.faction && (
            <div className="card flex items-center gap-3">
              <span className="text-2xl">{player.faction.emoji}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold ${player.faction.accent}`}>{player.faction.short}</div>
                <XPBar xp={player.xp} />
              </div>
              <TigerTrack rank={player.tigerRank} />
            </div>
          )}

          <ScenarioPanel
            scenarios={SCENARIOS.shadowArena}
            label="Shadow Arena"
            emoji="⚔️"
            color="text-violet-400"
            onChoice={handleChoice}
            completedIds={completedScenarioIds}
          />

          <ScenarioPanel
            scenarios={SCENARIOS.kingdomRaid}
            label="Kingdom Raid"
            emoji="🏰"
            color="text-red-400"
            onChoice={handleChoice}
            completedIds={completedScenarioIds}
          />

          <ScenarioPanel
            scenarios={SCENARIOS.hydraLabyrinth}
            label="Hydra Labyrinth"
            emoji="🌀"
            color="text-teal-400"
            onChoice={handleChoice}
            completedIds={completedScenarioIds}
          />
        </div>
      )}

      {/* ── Codex ── */}
      {activeTab === 'codex' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Unlocked Codex</div>
              {player.codexUnlocks.length === 0 ? (
                <p className="text-gray-600 text-xs">Complete scenarios to unlock codex entries.</p>
              ) : (
                <ul className="space-y-1">
                  {player.codexUnlocks.map(id => (
                    <li key={id} className="text-xs text-emerald-400 flex items-center gap-2">
                      <span>📜</span> {id.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Product Ladder</div>
              {[
                { tier: '$9', name: 'Shadow Moon Prompt Pack', desc: 'Faction codex entry' },
                { tier: '$27', name: 'Initiate Founders Pack', desc: 'Advanced codex + arena keys' },
                { tier: '$47/mo', name: 'Codex Vault Membership', desc: 'Full vault + all scenarios' },
              ].map(p => (
                <div key={p.tier} className="flex items-start gap-3 text-xs">
                  <span className="text-amber-400 font-bold w-14">{p.tier}</span>
                  <div>
                    <div className="text-gray-200">{p.name}</div>
                    <div className="text-gray-500">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Hydra Eyes ── */}
      {activeTab === 'eyes' && (
        <div className="space-y-4">
          {/* Recommendation */}
          {player.recommendation && (
            <div className="card border border-violet-700/50">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">👁 Hydra Recommendation</div>
              <p className="text-sm text-violet-300">{player.recommendation}</p>
            </div>
          )}

          {/* Metric grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Clicks', value: player.clicks, color: 'text-violet-400', icon: '🖱' },
              { label: 'Joins', value: player.joins, color: 'text-emerald-400', icon: '🤝' },
              { label: 'Sales', value: player.sales, color: 'text-amber-400', icon: '🛒' },
              { label: 'Revenue', value: `$${player.revenue}`, color: 'text-yellow-400', icon: '💰' },
              { label: 'Scale Score', value: player.scaleScore, color: 'text-blue-400', icon: '📈' },
              { label: 'Level', value: getLevel(player.xp), color: 'text-violet-400', icon: '⬆️' },
              { label: 'XP', value: player.xp, color: 'text-amber-300', icon: '⚡' },
              { label: 'Codex', value: player.codexUnlocks.length, color: 'text-emerald-400', icon: '📜' },
              { label: 'Scenarios Done', value: completedScenarioIds.size, color: 'text-teal-400', icon: '⚔️' },
              { label: 'Tiger Rank', value: player.tigerRank || '—', color: 'text-amber-400', icon: '🐯' },
            ].map(m => (
              <div key={m.label} className="metric-card border border-[#1a1a2e]">
                <div className="text-lg mb-1">{m.icon}</div>
                <div className={`text-base font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Faction tracking */}
          <div className="card space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Faction Activity</div>
            {player.faction ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{player.faction.emoji}</span>
                <div>
                  <div className={`text-sm font-bold ${player.faction.accent}`}>{player.faction.short}</div>
                  <div className="text-xs text-gray-400">Active Crown • {completedScenarioIds.size} trials completed</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-xs">No faction selected.</p>
            )}
          </div>

          {/* Event log */}
          <div className="card space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Live Event Log</div>
            {events.length === 0 ? (
              <p className="text-gray-600 text-xs">No events yet. Start playing to see tracking data.</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {events.slice(0, 20).map(e => (
                  <div key={e.id} className="flex items-center justify-between text-xs py-1 border-b border-[#1a1a2e]">
                    <span className="text-violet-400">{e.type}</span>
                    {(e.xp || 0) > 0 && <span className="text-amber-400">+{e.xp} XP</span>}
                    <span className="text-gray-600">{e.ts}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supabase integration note */}
          <div className="card border border-[#1a1a2e] space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-widest">Supabase Integration</div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The mobile app at <code className="text-violet-400">apps/realm-5-crowns-mobile/</code> writes all
              events to the <code className="text-violet-400">hydra_events</code> table when Supabase env vars are configured.
              Run <code className="text-violet-400">supabase/schema.sql</code> to bootstrap live tracking.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {['faction_select', 'scenario_choice', 'codex_unlock', 'join', 'sale', 'xp_gain', 'tiger_promotion', 'click'].map(t => (
                <span key={t} className="badge-violet">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
