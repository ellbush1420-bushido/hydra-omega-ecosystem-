import { useState, useCallback, useMemo } from 'react';
import { ingestTrackingUrl } from '../../utils/urlIngest';
import { SAMPLE_BING_INGEST_URL } from '../../constants/urlSamples';
import { submitAffiliateMatrixRoute } from '../../services/blackVaultService';

const sampleStats = [
  { subid: 'velrya-tiktok-bio-shadow-v1', clicks: 312, epc: '$2.87', revenue: '$143.54', lastActive: '2h ago' },
  { subid: 'kael-instagram-story-lotus-v1', clicks: 198, epc: '$2.14', revenue: '$67.23', lastActive: '5h ago' },
  { subid: 'seraphyn-twitter-post-scarlet-v2', clicks: 87, epc: '$1.98', revenue: '$32.11', lastActive: '1d ago' },
  { subid: 'velrya-youtube-pinned-shadow-v1', clicks: 156, epc: '$3.12', revenue: '$87.43', lastActive: '3h ago' },
  { subid: 'hydra-discord-bio-labyrinth-v1', clicks: 43, epc: '$1.54', revenue: '$18.76', lastActive: '2d ago' },
];

export default function AffiliateTracker() {
  const [form, setForm] = useState({
    sub1: 'velrya',
    sub2: 'tiktok',
    sub3: 'bio',
    sub4: 'shadow-monastery-intro',
    sub5: 'v1',
  });
  const [rawIngestUrl, setRawIngestUrl] = useState(SAMPLE_BING_INGEST_URL);
  const [copiedTarget, setCopiedTarget] = useState(null);
  const [matrixState, setMatrixState] = useState(null);
  const [isSubmittingMatrix, setIsSubmittingMatrix] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const ingestedLink = useMemo(() => ingestTrackingUrl(rawIngestUrl), [rawIngestUrl]);
  const metadataEntries = Object.entries(ingestedLink.metadata ?? {});

  const trackingString = (() => {
    const params = new URLSearchParams();
    params.set('sub1', form.sub1 || 'velrya');
    params.set('sub2', form.sub2 || 'tiktok');
    params.set('sub3', form.sub3 || 'bio');
    params.set('sub4', form.sub4 || 'shadow-monastery-intro');
    params.set('sub5', form.sub5 || 'v1');
    return '?' + params.toString();
  })();
  const fullUrl = (() => {
    const base = new URL('https://ourdream.ai/');
    base.searchParams.set('ref', 'hydra');
    ['sub1','sub2','sub3','sub4','sub5'].forEach(k =>
      base.searchParams.set(k, form[k] || { sub1:'velrya', sub2:'tiktok', sub3:'bio', sub4:'shadow-monastery-intro', sub5:'v1' }[k])
    );
    return base.toString();
  })();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedTarget('full');
      setTimeout(() => setCopiedTarget(null), 2000);
    } catch {
      // clipboard unavailable — do not show false success state
    }
  }, [fullUrl]);

  const handleCopyDestination = useCallback(async () => {
    if (!ingestedLink.destinationUrl) return;

    try {
      await navigator.clipboard.writeText(ingestedLink.destinationUrl);
      setCopiedTarget('destination');
      setTimeout(() => setCopiedTarget(null), 2000);
    } catch {
      // clipboard unavailable — do not show false success state
    }
  }, [ingestedLink.destinationUrl]);

  const handleSendToMatrix = useCallback(async () => {
    setIsSubmittingMatrix(true);
    setMatrixState(null);
    const result = await submitAffiliateMatrixRoute({
      lane: `${form.sub1 || 'hydra'} / ${form.sub4 || 'campaign'}`,
      source: form.sub2 || ingestedLink.sourceHost || 'unknown',
      cta: `${form.sub3 || 'placement'} route`,
      decision: 'Monitor',
      trackingUrl: fullUrl,
      metadata: {
        sub1: form.sub1,
        sub2: form.sub2,
        sub3: form.sub3,
        sub4: form.sub4,
        sub5: form.sub5,
        destinationUrl: ingestedLink.destinationUrl || null,
        sourceHost: ingestedLink.sourceHost || null,
        destinationHost: ingestedLink.destinationHost || null,
        extractedMetadata: ingestedLink.metadata || {},
      },
    });

    setMatrixState(result.persisted ? 'Route synced to Black Vault Matrix API.' : 'Route saved locally; API persistence pending.');
    setIsSubmittingMatrix(false);
  }, [form, fullUrl, ingestedLink]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🔗 Affiliate Tracker</h1>
        <p className="section-subtitle">SubID generator, redirect ingest, and Black Vault Matrix feed</p>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">🧲 External Link Ingest</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Raw Tracking URL</label>
            <textarea
              className="textarea-field"
              rows={4}
              value={rawIngestUrl}
              onChange={e => setRawIngestUrl(e.target.value)}
              placeholder="Paste a Bing, Google, or affiliate redirect URL..."
            />
          </div>

          {ingestedLink.error ? (
            <div className="bg-red-950/30 border border-red-800 rounded-lg p-4 text-sm text-red-300">
              {ingestedLink.error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[#1a1a2e]">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Source</div>
                <div className="text-sm font-semibold text-white break-all">{ingestedLink.sourceHost}</div>
                <div className="font-mono text-[10px] text-gray-500 break-all mt-2">{ingestedLink.sourceUrl}</div>
              </div>
              <div className="bg-[#0a0a0f] rounded-lg p-4 border border-emerald-700/40">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Resolved Destination</div>
                <div className="text-sm font-semibold text-emerald-400 break-all">{ingestedLink.destinationHost}</div>
                <div className="font-mono text-[10px] text-gray-500 break-all mt-2">{ingestedLink.destinationUrl}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="badge-green">Redirect hops: {ingestedLink.redirectDepth}</span>
                  <span className="badge-violet">Path: {ingestedLink.pathname}</span>
                </div>
              </div>
            </div>
          )}

          {!ingestedLink.error && (
            <div className="bg-[#0a0a0f] rounded-lg p-4 border border-violet-700/50">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Extracted Campaign Metadata</div>
                <button className="btn-primary text-xs" onClick={handleCopyDestination}>
                  {copiedTarget === 'destination' ? '✅ Copied!' : '📋 Copy Destination URL'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {metadataEntries.length ? metadataEntries.map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-[#1a1a2e] px-3 py-2">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{key}</div>
                    <div className="text-sm text-white break-all mt-1">{value}</div>
                  </div>
                )) : (
                  <div className="rounded-lg border border-[#1a1a2e] px-3 py-2 text-sm text-gray-400 sm:col-span-2 lg:col-span-3">
                    No campaign parameters detected in the resolved destination.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">⚙ SubID Generator</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">sub1 = Character</label>
            <input
              className="input-field"
              value={form.sub1}
              onChange={e => set('sub1', e.target.value)}
              placeholder="velrya"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">sub2 = Platform</label>
            <select className="select-field" value={form.sub2} onChange={e => set('sub2', e.target.value)}>
              {['tiktok','instagram','twitter','youtube','discord','email'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">sub3 = Placement</label>
            <select className="select-field" value={form.sub3} onChange={e => set('sub3', e.target.value)}>
              {['bio','post','story','link-hub','pinned'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">sub4 = Theme</label>
            <input
              className="input-field"
              value={form.sub4}
              onChange={e => set('sub4', e.target.value)}
              placeholder="shadow-monastery-intro"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">sub5 = Variant</label>
            <input
              className="input-field"
              value={form.sub5}
              onChange={e => set('sub5', e.target.value)}
              placeholder="v1"
            />
          </div>
        </div>

        <div className="mt-4 bg-[#0a0a0f] rounded-lg p-4 border border-violet-700/50">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Live Preview</div>
          <div className="font-mono text-xs text-emerald-400 break-all mb-3">
            {trackingString}
          </div>
          <div className="font-mono text-[10px] text-gray-500 break-all mb-3">
            {fullUrl}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary text-xs" onClick={handleCopy}>
              {copiedTarget === 'full' ? '✅ Copied!' : '📋 Copy Full URL'}
            </button>
            <button className="btn-emerald text-xs" onClick={handleSendToMatrix} disabled={isSubmittingMatrix}>
              {isSubmittingMatrix ? '⏳ Sending...' : '🧬 Send to Black Vault Matrix'}
            </button>
          </div>
          {matrixState && (
            <div className="mt-3 rounded-lg border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-xs text-emerald-200">
              {matrixState}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">📊 SubID Performance</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SubID</th>
                <th>Clicks</th>
                <th>EPC</th>
                <th>Revenue</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {sampleStats.map((s) => (
                <tr key={s.subid}>
                  <td><span className="font-mono text-xs text-violet-400">{s.subid}</span></td>
                  <td className="text-amber-400 font-medium">{s.clicks}</td>
                  <td className="text-emerald-400 font-medium">{s.epc}</td>
                  <td className="text-emerald-400 font-bold">{s.revenue}</td>
                  <td className="text-gray-500 text-xs">{s.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
