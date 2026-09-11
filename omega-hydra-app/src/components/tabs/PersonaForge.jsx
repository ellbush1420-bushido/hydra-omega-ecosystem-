import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import OwnerGate from '../studio/OwnerGate';

const domains = ['Identity','Appearance','Temperament','Motivation','Social Style','Competencies','Lore','Relationships','Presentation'];

function PersonaForgeBody() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [collection, setCollection] = useState('Hydra Core');
  const [error, setError] = useState('');

  async function load() {
    const { data, error: e } = await supabase.from('persona_registry').select('*').order('created_at', { ascending: false });
    if (e) setError(e.message); else setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function createPersona(event) {
    event.preventDefault();
    const personaId = `persona_${Date.now()}`;
    const { error: e } = await supabase.from('persona_registry').insert({
      persona_id: personaId,
      canon_name: name.trim(),
      collection_name: collection.trim() || 'Hydra Core',
      status: 'draft',
      privacy_tier: 'internal',
      release_approved: false,
    });
    if (e) setError(e.message); else { setName(''); await load(); }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2"><span className="badge-violet">OWNER ONLY</span><span className="badge-red">PRIVATE IP</span></div>
      <h1 className="section-title">Hydra Persona Forge Ω</h1>
      <p className="section-subtitle">Private character and persona registry for governed review.</p>

      {error && <div className="card border-red-900/70 text-sm text-red-300 mb-4">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        <section className="card">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Create private capsule</div>
          <form className="space-y-3" onSubmit={createPersona}>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Canon name" required />
            <input className="input-field" value={collection} onChange={(e) => setCollection(e.target.value)} placeholder="Collection" />
            <button className="btn-primary w-full" type="submit">Create capsule</button>
          </form>
        </section>

        <section className="card">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Nine persona domains</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {domains.map((domain, index) => <div className="metric-card" key={domain}><div className="text-xs text-violet-400">0{index + 1}</div><div className="text-sm font-semibold text-white mt-1">{domain}</div><div className="text-xs text-gray-500 mt-1">9 governed traits</div></div>)}
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Registry</div>
          <div className="space-y-2">
            {items.length === 0 && <div className="text-sm text-gray-500">No persona capsules yet.</div>}
            {items.map((item) => <div className="metric-card" key={item.id}><div className="flex justify-between gap-3"><div><div className="text-sm font-semibold text-white">{item.canon_name}</div><div className="text-xs text-gray-500 mt-1">{item.collection_name} · {item.persona_id}</div></div><div className="flex gap-2"><span className="badge-violet">{item.privacy_tier}</span><span className="badge-amber">{item.status}</span></div></div></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function PersonaForge() {
  return <OwnerGate><PersonaForgeBody /></OwnerGate>;
}
