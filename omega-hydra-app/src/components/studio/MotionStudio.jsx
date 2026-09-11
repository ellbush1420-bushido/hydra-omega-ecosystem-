import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const SHOTS = ['cinematic', 'portrait_motion', 'action', 'environment', 'loop', 'trailer', 'sequence'];

export default function MotionStudio() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [directive, setDirective] = useState('');
  const [shotType, setShotType] = useState('cinematic');
  const [duration, setDuration] = useState(5);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadProjects() {
    const { data, error } = await supabase
      .from('motion_projects')
      .select('id,title,shot_type,motion_directive,duration_seconds,status,privacy_tier,source_asset_id,output_asset_id,created_at,updated_at')
      .order('created_at', { ascending: false });
    if (error) setMessage(error.message);
    else setProjects(data || []);
  }

  useEffect(() => { loadProjects(); }, []);

  async function createProject(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage('Owner session expired.');
      setBusy(false);
      return;
    }

    const { error } = await supabase.from('motion_projects').insert({
      title,
      shot_type: shotType,
      motion_directive: directive,
      duration_seconds: Number(duration),
      privacy_tier: 'internal',
      created_by: user.id,
    });

    if (error) setMessage(error.message);
    else {
      setTitle('');
      setDirective('');
      setDuration(5);
      setMessage('Motion project saved to the private owner queue.');
      await loadProjects();
    }
    setBusy(false);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
      <section className="card">
        <div className="badge-violet inline-flex mb-3">OWNER-ONLY MOTION</div>
        <h2 className="text-xl font-bold text-white">Motion Studio</h2>
        <p className="text-sm text-gray-500 mt-2 mb-5">Plan animation, camera movement, character motion, loops, sequences, and trailer shots before rendering.</p>
        <form className="space-y-3" onSubmit={createProject}>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Shot / sequence title" required />
          <div className="grid grid-cols-2 gap-3">
            <select className="select-field" value={shotType} onChange={(e) => setShotType(e.target.value)}>
              {SHOTS.map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
            </select>
            <input className="input-field" type="number" min="0.5" max="600" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Duration seconds" />
          </div>
          <textarea className="input-field min-h-36" value={directive} onChange={(e) => setDirective(e.target.value)} placeholder="Camera move, subject motion, timing, beats, transition, environment motion, expression, continuity constraints…" required />
          <button className="btn-primary w-full" disabled={busy} type="submit">{busy ? 'Saving…' : 'Create Motion Project'}</button>
        </form>
        {message && <div className="text-xs text-amber-300 mt-3">{message}</div>}
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a2e] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500">Motion queue</div>
            <div className="text-sm text-gray-400 mt-1">Storyboard and render orchestration</div>
          </div>
          <span className="badge-green">{projects.length} projects</span>
        </div>
        <div className="max-h-[650px] overflow-y-auto divide-y divide-[#1a1a2e]">
          {projects.length === 0 && <div className="p-6 text-sm text-gray-500">No motion projects yet.</div>}
          {projects.map((project) => (
            <div key={project.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{project.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{project.shot_type.replaceAll('_', ' ')} · {project.duration_seconds}s</div>
                </div>
                <div className="flex gap-2"><span className="badge-violet">{project.privacy_tier}</span><span className="badge-amber">{project.status}</span></div>
              </div>
              <p className="text-sm text-gray-400 mt-3 whitespace-pre-wrap">{project.motion_directive}</p>
              <div className="text-[11px] text-gray-600 mt-3">Rendered outputs should return to Owner Private Studio as protected assets for review.</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
