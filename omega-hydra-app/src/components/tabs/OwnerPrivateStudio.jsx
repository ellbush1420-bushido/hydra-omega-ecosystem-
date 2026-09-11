import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import OwnerGate from '../studio/OwnerGate';

const STATES = ['unreviewed', 'private_approved', 'vaulted', 'archived', 'release_candidate', 'rejected'];

function StudioBody() {
  const [assets, setAssets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('unreviewed');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  async function loadAssets() {
    setError('');
    const { data, error: loadError } = await supabase
      .from('owner_studio_assets')
      .select('id,asset_id,title,source_path,storage_path,asset_type,privacy_tier,review_state,release_approved,created_at,updated_at')
      .order('created_at', { ascending: false });

    if (loadError) {
      setError(loadError.message);
      return;
    }
    setAssets(data || []);
    if (!selectedId && data?.length) setSelectedId(data[0].id);
  }

  useEffect(() => { loadAssets(); }, []);

  const visibleAssets = useMemo(
    () => filter === 'all' ? assets : assets.filter((asset) => asset.review_state === filter),
    [assets, filter],
  );

  const selected = assets.find((asset) => asset.id === selectedId) || null;

  async function review(nextState) {
    if (!selected) return;
    setBusy(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Owner session expired.');
      setBusy(false);
      return;
    }

    const releaseApproved = nextState === 'release_candidate' ? false : selected.release_approved;

    const { error: updateError } = await supabase
      .from('owner_studio_assets')
      .update({
        review_state: nextState,
        release_approved: releaseApproved,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', selected.id);

    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    const { error: eventError } = await supabase
      .from('owner_studio_review_events')
      .insert({
        asset_id: selected.id,
        actor_user_id: user.id,
        action: 'state_changed',
        from_state: selected.review_state,
        to_state: nextState,
      });

    if (eventError) setError(eventError.message);
    await loadAssets();
    setBusy(false);
  }

  async function approveRelease() {
    if (!selected || selected.review_state !== 'release_candidate') return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Owner session expired.');
      setBusy(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('owner_studio_assets')
      .update({
        release_approved: true,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', selected.id);

    if (!updateError) {
      await supabase.from('owner_studio_review_events').insert({
        asset_id: selected.id,
        actor_user_id: user.id,
        action: 'release_approved',
        from_state: selected.review_state,
        to_state: selected.review_state,
      });
      await loadAssets();
    } else {
      setError(updateError.message);
    }
    setBusy(false);
  }

  async function openPreview() {
    if (!selected?.storage_path) return;
    setError('');
    setPreviewUrl('');
    const { data, error: signError } = await supabase
      .storage
      .from('owner-private-studio')
      .createSignedUrl(selected.storage_path, 60);

    if (signError) {
      setError(signError.message);
      return;
    }
    setPreviewUrl(data.signedUrl);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-red">OWNER ONLY</span>
            <span className="badge-violet">PRIVATE STORAGE</span>
          </div>
          <h1 className="section-title">Owner Private Asset Studio</h1>
          <p className="section-subtitle !mb-0">Review protected Hydra assets before any release decision.</p>
        </div>
        <button className="btn-outline" onClick={signOut}>Lock Studio</button>
      </div>

      {error && <div className="card border-red-900/70 text-sm text-red-300 mb-4">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        <section className="card p-0 overflow-hidden">
          <div className="p-4 border-b border-[#1a1a2e]">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Review queue</div>
            <select className="select-field" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All assets</option>
              {STATES.map((state) => <option key={state} value={state}>{state.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
          <div className="max-h-[650px] overflow-y-auto">
            {visibleAssets.length === 0 && <div className="p-5 text-sm text-gray-500">No assets in this queue.</div>}
            {visibleAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => { setSelectedId(asset.id); setPreviewUrl(''); }}
                className={`w-full text-left p-4 border-b border-[#1a1a2e] hover:bg-[#1a1a2e]/40 ${selectedId === asset.id ? 'bg-violet-950/30' : ''}`}
              >
                <div className="text-sm font-semibold text-white truncate">{asset.title || asset.asset_id}</div>
                <div className="text-xs text-gray-500 truncate mt-1">{asset.source_path}</div>
                <div className="flex gap-2 mt-2">
                  <span className="badge-violet">{asset.privacy_tier}</span>
                  <span className="badge-amber">{asset.review_state.replaceAll('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="card min-h-[520px]">
          {!selected ? (
            <div className="text-sm text-gray-500">Select an asset to begin review.</div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4 pb-5 border-b border-[#1a1a2e]">
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Asset</div>
                  <h2 className="text-lg font-bold text-white mt-1">{selected.title || selected.asset_id}</h2>
                  <div className="text-xs text-gray-500 mt-1 break-all">{selected.source_path}</div>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="badge-violet">{selected.privacy_tier}</span>
                  {selected.release_approved && <span className="badge-green">release approved</span>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 my-5 text-sm">
                <div className="metric-card"><div className="text-xs text-gray-500">Type</div><div className="text-white mt-1">{selected.asset_type}</div></div>
                <div className="metric-card"><div className="text-xs text-gray-500">Review state</div><div className="text-white mt-1">{selected.review_state.replaceAll('_', ' ')}</div></div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <button className="btn-outline" onClick={openPreview}>60s private preview</button>
                <button className="btn-emerald" disabled={busy} onClick={() => review('private_approved')}>Keep Private</button>
                <button className="btn-primary" disabled={busy} onClick={() => review('vaulted')}>Vault</button>
                <button className="btn-outline" disabled={busy} onClick={() => review('archived')}>Archive</button>
                <button className="btn-gold" disabled={busy} onClick={() => review('release_candidate')}>Release Candidate</button>
                <button className="btn-crimson" disabled={busy} onClick={() => review('rejected')}>Reject</button>
              </div>

              {selected.review_state === 'release_candidate' && !selected.release_approved && (
                <div className="card border-amber-800/60 mb-5">
                  <div className="font-semibold text-amber-300 text-sm">Second release gate</div>
                  <p className="text-xs text-gray-400 my-2">Release candidacy does not make the asset public. Explicit owner approval is still required.</p>
                  <button className="btn-gold" disabled={busy} onClick={approveRelease}>Explicitly approve release</button>
                </div>
              )}

              {previewUrl && (
                <div className="card">
                  <div className="text-xs text-gray-500 mb-3">Signed preview expires in approximately 60 seconds.</div>
                  {selected.asset_type === 'image' ? (
                    <img src={previewUrl} alt={selected.title || selected.asset_id} className="max-h-[480px] mx-auto rounded-lg" />
                  ) : selected.asset_type === 'video' ? (
                    <video src={previewUrl} controls className="max-h-[480px] w-full rounded-lg" />
                  ) : (
                    <a className="text-violet-400 underline text-sm" href={previewUrl} target="_blank" rel="noreferrer">Open protected asset</a>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function OwnerPrivateStudio() {
  return <OwnerGate><StudioBody /></OwnerGate>;
}
