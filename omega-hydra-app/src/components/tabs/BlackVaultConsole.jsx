import { useEffect, useMemo, useState } from 'react';
import {
  vaultMetrics,
  commandCouncil,
  offerLadder,
  affiliateMatrix,
  warpRuns,
  visualizerTracks,
  pythonHeads,
} from '../../data/blackVaultConsole';
import {
  fetchBlackVaultDashboard,
  saveBlackVaultOffer,
  syncBlackVaultWarpRuns,
} from '../../services/blackVaultService';

const toneClasses = {
  violet: 'border-violet-700 text-violet-300',
  emerald: 'border-emerald-700 text-emerald-300',
  crimson: 'border-red-700 text-red-300',
  gold: 'border-amber-700 text-amber-300',
};

const decisionBadges = {
  Scale: 'badge-green',
  Refine: 'badge-amber',
  Monitor: 'badge-violet',
};

const statusBadges = {
  Running: 'badge-green',
  running: 'badge-green',
  Queued: 'badge-amber',
  queued: 'badge-amber',
  Review: 'badge-violet',
  review: 'badge-violet',
  Completed: 'badge-blue',
  completed: 'badge-blue',
};

const normalizeOffer = (offer, index) => ({
  id: offer.id || `offer-${index + 1}`,
  tier: offer.tier || offer.offer_tier || 'Tier',
  title: offer.title || 'Untitled Offer',
  price: offer.price || offer.price_label || 'TBD',
  purpose: offer.purpose || offer.description || '',
  status: offer.status || 'active',
  accessTier: offer.accessTier || offer.access_tier || 'age-gated',
  sortOrder: offer.sortOrder ?? offer.sort_order ?? index + 1,
});

const normalizeMatrixRow = (row, index) => ({
  id: row.id || `matrix-${index + 1}`,
  lane: row.lane || 'Tracker Route',
  source: row.source || 'unknown',
  cta: row.cta || 'Tracked CTA',
  ctr: row.ctr || row.ctr_label || '—',
  epc: row.epc || row.epc_label || '—',
  decision: row.decision || 'Monitor',
  trackingUrl: row.trackingUrl || row.tracking_url || '',
});

const normalizeRun = (run, index) => ({
  id: run.id || `run-${index + 1}`,
  run: run.run || run.run_id || `Warp-VA-${index + 1}`,
  task: run.task || 'Unlabeled run',
  status: run.status || 'Queued',
  progress: Number(run.progress || 0),
});

export default function BlackVaultConsole() {
  const [metrics, setMetrics] = useState(vaultMetrics);
  const [offers, setOffers] = useState(offerLadder.map(normalizeOffer));
  const [matrix, setMatrix] = useState(affiliateMatrix.map(normalizeMatrixRow));
  const [runs, setRuns] = useState(warpRuns.map(normalizeRun));
  const [dataSource, setDataSource] = useState('seed');
  const [isLoading, setIsLoading] = useState(true);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [offerDraft, setOfferDraft] = useState(null);
  const [saveState, setSaveState] = useState(null);
  const [warpSyncState, setWarpSyncState] = useState(null);
  const [isSyncingWarp, setIsSyncingWarp] = useState(false);

  const hydrate = async () => {
    setIsLoading(true);
    const dashboard = await fetchBlackVaultDashboard();
    setMetrics(dashboard.metrics?.length ? dashboard.metrics : vaultMetrics);
    setOffers((dashboard.offers?.length ? dashboard.offers : offerLadder).map(normalizeOffer));
    setMatrix((dashboard.matrix?.length ? dashboard.matrix : affiliateMatrix).map(normalizeMatrixRow));
    setRuns((dashboard.runs?.length ? dashboard.runs : warpRuns).map(normalizeRun));
    setDataSource(dashboard.source || 'unknown');
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const safeHydrate = async () => {
      if (!mounted) return;
      await hydrate();
    };

    safeHydrate();

    const refreshFromMatrixEvent = () => safeHydrate();
    window.addEventListener('hydra:black-vault:matrix-updated', refreshFromMatrixEvent);

    return () => {
      mounted = false;
      window.removeEventListener('hydra:black-vault:matrix-updated', refreshFromMatrixEvent);
    };
  }, []);

  const runningCount = useMemo(
    () => runs.filter((run) => String(run.status).toLowerCase() === 'running').length,
    [runs]
  );

  const beginOfferEdit = (offer) => {
    setEditingOfferId(offer.id);
    setOfferDraft({ ...offer });
    setSaveState(null);
  };

  const updateDraft = (key, value) => {
    setOfferDraft((draft) => ({ ...draft, [key]: value }));
  };

  const cancelOfferEdit = () => {
    setEditingOfferId(null);
    setOfferDraft(null);
    setSaveState(null);
  };

  const saveOffer = async () => {
    if (!offerDraft) return;
    const result = await saveBlackVaultOffer(offerDraft);
    setOffers((current) => current.map((offer) => offer.id === offerDraft.id ? { ...offer, ...result.offer } : offer));
    setSaveState(result.persisted ? 'Saved to API / storage' : 'Saved locally; API persistence pending');
    setEditingOfferId(null);
    setOfferDraft(null);
    await hydrate();
  };

  const syncWarpRuns = async () => {
    setIsSyncingWarp(true);
    setWarpSyncState(null);
    const sync = await syncBlackVaultWarpRuns();
    if (sync.runs?.length) {
      setRuns(sync.runs.map(normalizeRun));
    }
    setWarpSyncState(
      sync.error
        ? `Warp sync unavailable: ${sync.error}`
        : sync.persisted
          ? `Warp runs synced and persisted from ${sync.source}.`
          : `Warp sync returned ${sync.runs.length} run(s) from ${sync.source}; persistence pending.`
    );
    setIsSyncingWarp(false);
    await hydrate();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-red-900/80 bg-gradient-to-br from-[#161018] via-[#120d14] to-[#0a0a0f] p-5 sm:p-6 shadow-[0_0_40px_rgba(127,29,29,0.16)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-400">Private age-gated command branch</div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">🗝 Velvet Grin Black Vault Console</h1>
            <p className="mt-2 max-w-4xl text-sm text-gray-300 leading-relaxed">
              Warp.dev Limitless × Omega Hydra CEO operating surface for gated affiliate funnels, mature fictional media planning,
              Vault IP governance, revenue intelligence, and Den Mother review discipline.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={isLoading ? 'badge-amber' : 'badge-green'}>{isLoading ? 'Hydrating console' : 'Console hydrated'}</span>
              <span className="badge-violet">Source: {dataSource}</span>
              <span className="badge-blue">Live running jobs: {runningCount}</span>
              {saveState && <span className="badge-amber">{saveState}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:min-w-[280px]">
            <div className="rounded-xl border border-emerald-800/70 bg-emerald-950/20 p-3">
              <div className="text-gray-500 uppercase tracking-widest">Boundary</div>
              <div className="mt-1 font-bold text-emerald-300">Public / Private Split</div>
            </div>
            <div className="rounded-xl border border-amber-800/70 bg-amber-950/20 p-3">
              <div className="text-gray-500 uppercase tracking-widest">CEO Logic</div>
              <div className="mt-1 font-bold text-amber-300">Evidence Gate</div>
            </div>
            <div className="rounded-xl border border-red-800/70 bg-red-950/20 p-3">
              <div className="text-gray-500 uppercase tracking-widest">Access</div>
              <div className="mt-1 font-bold text-red-300">Age-Gated Only</div>
            </div>
            <div className="rounded-xl border border-violet-800/70 bg-violet-950/20 p-3">
              <div className="text-gray-500 uppercase tracking-widest">Mode</div>
              <div className="mt-1 font-bold text-violet-300">Affiliate Matrix</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
        {metrics.map((metric) => (
          <div key={metric.label} className={`metric-card border ${toneClasses[metric.tone] || toneClasses.violet}`}>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">{metric.label}</div>
            <div className="mt-2 text-xl font-black text-white">{metric.value}</div>
            <div className="mt-1 text-xs opacity-90">{metric.delta}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <div className="card border border-red-900/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">👑 Command Council</h2>
              <p className="text-xs text-gray-500">Jezebel Velvet, Black Grin, Den Mother, CEO Logic</p>
            </div>
            <span className="badge-red">Private Branch</span>
          </div>
          <div className="mt-4 space-y-3">
            {commandCouncil.map((leader) => (
              <div key={leader.name} className="rounded-xl border border-[#252031] bg-[#0a0a0f] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-white">{leader.name}</div>
                    <div className="text-xs uppercase tracking-widest text-violet-400">{leader.role}</div>
                  </div>
                  <span className="badge-green">{leader.status}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{leader.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card border border-amber-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-white">🪜 Offer Ladder / Black Vault Revenue Rail</h2>
              <p className="text-xs text-gray-500">Editable commercial objects with API/local fallback persistence</p>
            </div>
            <span className="badge-amber">Commercial Bridge</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
            {offers.map((offer) => {
              const editing = editingOfferId === offer.id;
              const draft = editing ? offerDraft : offer;
              return (
                <div key={offer.id} className="rounded-xl border border-amber-900/40 bg-[#0a0a0f] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-amber-400">{draft.tier}</div>
                  {editing ? (
                    <div className="mt-3 space-y-2">
                      <input className="input-field text-xs" value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} />
                      <input className="input-field text-xs" value={draft.price} onChange={(event) => updateDraft('price', event.target.value)} />
                      <textarea className="textarea-field text-xs" rows={4} value={draft.purpose} onChange={(event) => updateDraft('purpose', event.target.value)} />
                    </div>
                  ) : (
                    <>
                      <div className="mt-2 text-sm font-bold text-white">{draft.title}</div>
                      <div className="mt-2 text-lg font-black text-emerald-300">{draft.price}</div>
                      <p className="mt-3 text-xs leading-relaxed text-gray-400">{draft.purpose}</p>
                    </>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {editing ? (
                      <>
                        <button className="btn-emerald text-xs py-1 px-2" onClick={saveOffer}>Save</button>
                        <button className="btn-outline text-xs py-1 px-2" onClick={cancelOfferEdit}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn-outline text-xs py-1 px-2" onClick={() => beginOfferEdit(offer)}>Edit</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="card border border-violet-900/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">🧬 Velvet Affiliate Matrix</h2>
              <p className="text-xs text-gray-500">Tracker-linked rows appear here after route submission</p>
            </div>
            <span className="badge-violet">EPC / CTR / Decision</span>
          </div>
          <div className="table-container mt-4">
            <table>
              <thead>
                <tr>
                  <th>Lane</th>
                  <th>Source</th>
                  <th>CTA</th>
                  <th>CTR</th>
                  <th>EPC</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.id}>
                    <td className="font-medium text-white">{row.lane}</td>
                    <td className="text-gray-400">{row.source}</td>
                    <td className="text-gray-400">{row.cta}</td>
                    <td className="font-semibold text-amber-300">{row.ctr}</td>
                    <td className="font-semibold text-emerald-300">{row.epc}</td>
                    <td><span className={decisionBadges[row.decision] || 'badge-violet'}>{row.decision}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card border border-emerald-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-white">⚡ Warp Limitless Run Center</h2>
              <p className="text-xs text-gray-500">Hydrates from run API, accepts run-event intake, and can sync from a configured Warp runs endpoint</p>
            </div>
            <button className="btn-emerald text-xs" onClick={syncWarpRuns} disabled={isSyncingWarp}>
              {isSyncingWarp ? 'Syncing...' : 'Sync Warp Runs'}
            </button>
          </div>
          {warpSyncState && (
            <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-200">
              {warpSyncState}
            </div>
          )}
          <div className="mt-4 space-y-3">
            {runs.map((run) => (
              <div key={run.id} className="rounded-xl border border-[#1a1a2e] bg-[#0a0a0f] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-violet-300">{run.run}</div>
                    <div className="mt-1 text-sm font-semibold text-white">{run.task}</div>
                  </div>
                  <span className={statusBadges[run.status] || 'badge-violet'}>{run.status}</span>
                </div>
                <div className="progress-bar mt-3">
                  <div className="progress-fill bg-emerald-600" style={{ width: `${run.progress}%` }} />
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-widest text-gray-500">Progress {run.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="card border border-blue-900/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">🖼 Mature Media Visualizer Stack</h2>
              <p className="text-xs text-gray-500">Private fictional IP planning, cataloging, and boundary control</p>
            </div>
            <span className="badge-blue">Visualizer</span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visualizerTracks.map((track) => (
              <div key={track.title} className="rounded-xl border border-blue-900/40 bg-[#0a0a0f] p-4">
                <div className="text-sm font-bold text-white">{track.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{track.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card border border-red-900/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">🐍 Black Vault Python Heads</h2>
              <p className="text-xs text-gray-500">Specialized automation heads assigned to the gated branch</p>
            </div>
            <span className="badge-red">Swarm</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {pythonHeads.map((head) => (
              <span key={head} className="rounded-full border border-red-900/70 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-200">
                {head}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400">CEO Logic Boundary</div>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              Public-safe Hydra outputs remain separated from this branch. Mature assets route through age-gated disclosures,
              Den Mother review, and offer-level evidence checks before release.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
