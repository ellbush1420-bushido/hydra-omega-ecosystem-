import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const TYPES = ['character', 'scene', 'world', 'codex', 'product', 'environment'];
const PRESETS = ['hydra_sovereign', 'ghost_sea', 'v3_monastery', 'black_lotus', 'cinematic_codex'];

export default function VisualizationEngine() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [type, setType] = useState('scene');
  const [preset, setPreset] = useState('hydra_sovereign');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadJobs() {
    const { data, error } = await supabase
      .from('visualization_jobs')
      .select('id,title,brief,visualization_type,style_preset,status,privacy_tier,output_asset_id,created_at,updated_at')
      .order('created_at', { ascending: false });
    if (error) setMessage(error.message);
    else setJobs(data || []);
  }

  useEffect(() => { loadJobs(); }, []);

  async function createJob(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Owner session expired.');
      setBusy(false);
      return;
    }

    const { error } = await supabase.from('visualization_jobs').insert({
      title,
      brief,
      visualization_type: type,
      style_preset: preset,
      privacy_tier: 'internal',
      created_by: user.id,
    });

    if (error) setMessage(error.message);
    else {
      setTitle('');
      setBrief('');
      setMessage('Visualization brief saved to the private owner queue.');
      await loadJobs();
    }
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
      <section className="card">
        <div className="badge-violet inline-flex mb-3">OWNER-ONLY ENGINE</div>
        <h2 className="text-xl font-bold text-white">Visualization Engine</h2>
        <p className="text-sm text-gray-500 mt-2 mb-5">Compose private character, world, codex, environment, and campaign visualization briefs before generation or release.</p>
        <form className="space-y-3" onSubmit={createJob}>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Visualization title" required />
          <div className="grid grid-cols-2 gap-3">
            <select className="select-field" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className="select-field" value={preset} onChange={(e) => setPreset(e.target.value)}>
              {PRESETS.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
          <textarea className="input-field min-h-36" value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Scene composition, subject, camera, lighting, wardrobe, environment, canon constraints, and visual intent…" required />
          <button className="btn-primary w-full" disabled={busy} type="submit">{busy ? 'Saving…' : 'Create Private Brief'}</button>
        </form>
        {message && <div className="text-xs text-amber-300 mt-3">{message}</div>}
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a2e] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500">Visualization queue</div>
            <div className="text-sm text-gray-400 mt-1">Private-by-default orchestration records</div>
          </div>
          <span className="badge-green">{jobs.length} briefs</span>
        </div>
        <div className="max-h-[650px] overflow-y-auto divide-y divide-[#1a1a2e]">
          {jobs.length === 0 && <div className="p-6 text-sm text-gray-500">No visualization briefs yet.</div>}
          {jobs.map((job) => (
            <div key={job.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{job.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{job.visualization_type} · {job.style_preset.replaceAll('_', ' ')}</div>
                </div>
                <div className="flex gap-2"><span className="badge-violet">{job.privacy_tier}</span><span className="badge-amber">{job.status}</span></div>
              </div>
              <p className="text-sm text-gray-400 mt-3 whitespace-pre-wrap">{job.brief}</p>
              <div className="text-[11px] text-gray-600 mt-3">Output remains in owner review until an asset is explicitly linked and approved.</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
