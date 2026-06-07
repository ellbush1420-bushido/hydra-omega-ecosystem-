import { useState } from 'react';

const samplePosts = [
  { title: "Velrya's First Vow", faction: "Shadow Monastery", platform: "TikTok", status: "Live", clicks: 312 },
  { title: "The Velvet Web Awakens", faction: "Black Spider Lotus", platform: "Instagram", status: "Live", clicks: 198 },
  { title: "Crown of the Serpent Sun", faction: "Serpent Sun", platform: "Twitter", status: "Scheduled", clicks: 0 },
  { title: "Scarlet Order's Decree", faction: "Scarlet Temple", platform: "YouTube", status: "Draft", clicks: 0 },
  { title: "The Lazarus Protocol", faction: "Knights of St. Lazarus", platform: "TikTok", status: "Live", clicks: 87 },
];

const statusColor = {
  Live: "badge-green",
  Scheduled: "badge-amber",
  Draft: "badge-violet",
};

export default function SFWPipeline() {
  const [form, setForm] = useState({
    title: '',
    faction: 'Shadow Monastery',
    contentType: 'Character Spotlight',
    platform: 'TikTok',
    status: 'Draft',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="section-title">🌿 SFW Discovery Pipeline</h1>
          <span className="badge-green">PUBLIC SAFE — No age-gate required</span>
        </div>
        <p className="section-subtitle">Create and manage public-safe content for all platforms</p>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">➕ New SFW Content</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Enter content title..."
            />
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
            <label className="text-xs text-gray-400 block mb-1">Content Type</label>
            <select className="select-field" value={form.contentType} onChange={e => set('contentType', e.target.value)}>
              {['Character Spotlight','Faction Identity','Moral Choice','CTA'].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Platform</label>
            <select className="select-field" value={form.platform} onChange={e => set('platform', e.target.value)}>
              {['TikTok','Instagram','Twitter','YouTube'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select className="select-field" value={form.status} onChange={e => set('status', e.target.value)}>
              {['Draft','Scheduled','Live'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">Create Post</button>
          <button className="btn-outline">Preview</button>
        </div>
        <div className="mt-3 text-xs text-amber-400 italic">"Build characters like this."</div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">📋 SFW Content Library</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Faction</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {samplePosts.map((p) => (
                <tr key={p.title}>
                  <td>
                    <div>{p.title}</div>
                    <div className="text-[10px] text-amber-500 italic mt-0.5">"Build characters like this."</div>
                  </td>
                  <td><span className="badge-violet">{p.faction}</span></td>
                  <td className="text-gray-400">{p.platform}</td>
                  <td><span className={statusColor[p.status]}>{p.status}</span></td>
                  <td className="text-emerald-400 font-medium">{p.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
