import { useState } from 'react';

const factions = [
  {
    name: 'Shadow Monastery',
    publicTone: 'Sacred hush, vows, veils, restraint. The silence between words carries the doctrine.',
    gatedTone: 'Initiates are tested through proximity, confession, and the slow dissolution of personal barriers within the sacred walls.',
    color: 'border-violet-700',
    accent: 'text-violet-400',
    bg: 'bg-violet-900/10',
    members: 847,
    characters: 4,
  },
  {
    name: 'Black Spider Lotus',
    publicTone: 'Seductive intelligence, secrets, velvet shadows. Knowledge is the most intimate currency.',
    gatedTone: 'The Lotus operates through calculated intimacy — each secret extracted becomes a bond that is nearly impossible to sever.',
    color: 'border-red-700',
    accent: 'text-red-400',
    bg: 'bg-red-900/10',
    members: 612,
    characters: 3,
  },
  {
    name: 'Enclave of the Serpent Sun',
    publicTone: 'Crowned temptation, radiant judgment. Gold and green serpents of ascension.',
    gatedTone: 'The Serpent Sun uses ritual feast and intoxicating ceremony to bind its members to the golden covenant.',
    color: 'border-amber-600',
    accent: 'text-amber-400',
    bg: 'bg-amber-900/10',
    members: 734,
    characters: 5,
  },
  {
    name: 'Scarlet Temple',
    publicTone: 'Authority, discipline, red-gold order. Commands are spoken once.',
    gatedTone: 'The Temple maintains control through structured power exchange — every relationship in the Temple has a clearly defined rank.',
    color: 'border-red-600',
    accent: 'text-red-300',
    bg: 'bg-red-900/10',
    members: 523,
    characters: 3,
  },
  {
    name: 'Moon Covenant',
    publicTone: 'Mercy, silver-blue healing, sacred restraint. The covenant protects and preserves.',
    gatedTone: 'Healers of the Covenant work in secrecy, binding wounds physical and emotional through vows spoken only under moonlight.',
    color: 'border-blue-600',
    accent: 'text-blue-400',
    bg: 'bg-blue-900/10',
    members: 389,
    characters: 2,
  },
  {
    name: 'Order of the Black Sun',
    publicTone: 'Judgment, custody, law. The Black Sun sees all transgression.',
    gatedTone: 'Inquisitors of the Order enforce compliance through psychological interrogation and the withholding of light itself.',
    color: 'border-gray-600',
    accent: 'text-gray-300',
    bg: 'bg-gray-900/20',
    members: 467,
    characters: 3,
  },
  {
    name: 'Cult of Ophiuchus',
    publicTone: 'Serpent prophecy, temptation, infection. The thirteenth sign devours the zodiac.',
    gatedTone: 'Ophiuchus spreads its doctrine like venom — through whispered prophecy, promised transformation, and addictive revelation.',
    color: 'border-emerald-600',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-900/10',
    members: 298,
    characters: 2,
  },
  {
    name: 'Knights of St. Lazarus',
    publicTone: 'Healing crusade, stabilization, silver-white-green Asclepian order.',
    gatedTone: 'The Knights operate mobile sanctuaries on the edge of factional war — offering sanctuary to those who can pay in secrets.',
    color: 'border-emerald-400',
    accent: 'text-emerald-300',
    bg: 'bg-emerald-900/10',
    members: 412,
    characters: 2,
  },
  {
    name: 'Hydra Ascendant',
    publicTone: 'Mutation, labyrinth, identity disruption. The Hydra has no fixed form.',
    gatedTone: 'Hydra Ascendant offers total identity dissolution — members surrender their names and emerge as something unrecognizable and powerful.',
    color: 'border-teal-600',
    accent: 'text-teal-400',
    bg: 'bg-teal-900/10',
    members: 563,
    characters: 4,
  },
];

export default function FactionMap() {
  const [revealed, setRevealed] = useState({});

  const toggle = (name) => setRevealed(r => ({ ...r, [name]: !r[name] }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🐍 Faction Empire Map</h1>
        <p className="section-subtitle">9 factions of the Hydra Omega Empire — public doctrine and inner sanctum</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {factions.map((f) => (
          <div key={f.name} className={`card border ${f.color} ${f.bg} space-y-3`}>
            <div className={`text-lg font-bold ${f.accent}`}>{f.name}</div>

            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Public Tone</div>
              <p className="text-gray-300 text-xs leading-relaxed">{f.publicTone}</p>
            </div>

            <div className="bg-[#0a0a0f]/60 rounded-lg p-3 border border-[#1a1a2e]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Gated Tone</div>
                <button
                  className="text-[10px] text-red-400 hover:text-red-300 border border-red-800 px-2 py-0.5 rounded transition-colors"
                  onClick={() => toggle(f.name)}
                >
                  {revealed[f.name] ? 'Hide' : 'View Gated Tone ⚠️ 18+'}
                </button>
              </div>
              {revealed[f.name] ? (
                <p className="text-gray-400 text-xs leading-relaxed">{f.gatedTone}</p>
              ) : (
                <p className="text-gray-600 text-[10px]">Age verification required.</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>👥 {f.members.toLocaleString()} members</span>
              <span>👁 {f.characters} characters</span>
            </div>

            <button className="btn-outline w-full text-xs">View Characters</button>
          </div>
        ))}
      </div>
    </div>
  );
}
