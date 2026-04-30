import { useState } from 'react';

const sampleCharacters = [
  {
    name: "Velrya",
    faction: "Shadow Monastery",
    role: "Serpent High Priestess",
    safety: "Age-Gated",
    affiliateUrl: "https://ourdream.ai/?ref=hydra&sub1=velrya",
    color: "violet",
  },
  {
    name: "Kael Mordris",
    faction: "Black Spider Lotus",
    role: "Velvet Shadow Architect",
    safety: "Public Safe",
    affiliateUrl: "https://ourdream.ai/?ref=hydra&sub1=kael-mordris",
    color: "crimson",
  },
  {
    name: "Seraphyn",
    faction: "Scarlet Temple",
    role: "Crimson Commander",
    safety: "Public Safe",
    affiliateUrl: "https://ourdream.ai/?ref=hydra&sub1=seraphyn",
    color: "gold",
  },
];

const safetyBadge = {
  "Public Safe": "badge-green",
  "Age-Gated": "badge-red",
  "Blocked": "badge-amber",
};

const cardAccent = {
  violet: "border-violet-700",
  crimson: "border-red-700",
  gold: "border-amber-600",
};

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CharacterFactory() {
  const [form, setForm] = useState({
    name: '',
    faction: 'Shadow Monastery',
    celebPrompt: '',
    ourdreamPrompt: '',
    publicBio: '',
    gatedBio: '',
    affiliateUrl: '',
    safety: 'Public Safe',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [copied, setCopied] = useState(null);

  const handleCopy = (url, name) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(name);
        setTimeout(() => setCopied(null), 2000);
      },
      () => {
        setCopied(`${name}-error`);
        setTimeout(() => setCopied(null), 2000);
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">👁 Character Model Factory</h1>
        <p className="section-subtitle">Create and manage AI persona models for your faction empire</p>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">⚙ Build New Character</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Character Name</label>
            <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Velrya" />
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
            <label className="text-xs text-gray-400 block mb-1">CelebMakerAI Visual Prompt</label>
            <textarea className="textarea-field" rows={3} value={form.celebPrompt} onChange={e => set('celebPrompt', e.target.value)} placeholder="Cinematic portrait, gothic fantasy, obsidian robes..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">OurDreamAI Persona Prompt</label>
            <textarea className="textarea-field" rows={3} value={form.ourdreamPrompt} onChange={e => set('ourdreamPrompt', e.target.value)} placeholder="You are Velrya, high priestess of the Shadow Monastery..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Public Bio</label>
            <textarea className="textarea-field" rows={3} value={form.publicBio} onChange={e => set('publicBio', e.target.value)} placeholder="SFW public-facing bio..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Age-Gated Bio <span className="badge-red ml-1">18+ only</span></label>
            <textarea className="textarea-field" rows={3} value={form.gatedBio} onChange={e => set('gatedBio', e.target.value)} placeholder="Mature content bio — only visible after age verification..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Affiliate URL</label>
            <input className="input-field" value={form.affiliateUrl} onChange={e => set('affiliateUrl', e.target.value)} placeholder="https://ourdream.ai/?ref=hydra" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">SubID Slug (auto-generated)</label>
            <input className="input-field" readOnly value={form.name ? toSlug(form.name) : ''} placeholder="velrya" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Content Safety Classification</label>
            <select className="select-field" value={form.safety} onChange={e => set('safety', e.target.value)}>
              {['Public Safe','Age-Gated','Blocked'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">Save Character</button>
          <button className="btn-outline">Preview Card</button>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-white mb-4">🐉 Character Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sampleCharacters.map((char) => (
            <div key={char.name} className={`card border ${cardAccent[char.color]} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-bold text-white">{char.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 italic">{char.role}</div>
                </div>
                <span className={safetyBadge[char.safety]}>{char.safety}</span>
              </div>
              <div className="mb-3">
                <span className="badge-violet">{char.faction}</span>
              </div>
              <button
                className="btn-outline w-full text-xs"
                onClick={() => handleCopy(char.affiliateUrl, char.name)}
              >
                {copied === `${char.name}-error` ? '❌ Copy failed' : copied === char.name ? '✅ Copied!' : '📋 Copy Affiliate URL'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
