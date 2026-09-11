import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabase';

const REVIEW_STATES = [
  'unreviewed',
  'private_approved',
  'vaulted',
  'archived',
  'release_candidate',
  'rejected',
];

function VaultCard({ asset, onPreview, onReview, busy }) {
  return (
    <article className="rounded-xl border border-violet-900/60 bg-[#11111a] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400">{asset.asset_type}</p>
          <h3 className="text-white font-semibold">{asset.title || asset.asset_id}</h3>
          <p className="text-xs text-gray-500 mt-1">{asset.asset_id}</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full border border-amber-700/60 text-amber-300">
          {asset.privacy_tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-black/20 p-2">
          <div className="text-gray-500">Review state</div>
          <div className="text-gray-200">{asset.review_state}</div>
        </div>
        <div className="rounded-lg bg-black/20 p-2">
          <div className="text-gray-500">Release</div>
          <div className={asset.release_approved ? 'text-green-400' : 'text-gray-400'}>
            {asset.release_approved ? 'approved' : 'private'}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-xs"
          onClick={() => onPreview(asset)}
          disabled={busy}
        >
          Private preview
        </button>

        <select
          className="bg-[#0b0b12] border border-[#2a2a3f] text-gray-200 text-xs rounded-lg px-2 py-2"
          value={asset.review_state}
          disabled={busy}
          onChange={(event) => onReview(asset, event.target.value)}
        >
          {REVIEW_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
    </article>
  );
}

export default function BlackVaultStudio() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [assets, setAssets] = useState([]);
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const ready = Boolean(supabase);
  const user = session?.user || null;

  const queueCounts = useMemo(() => {
    return assets.reduce((acc, asset) => {
      acc[asset.review_state] = (acc[asset.review_state] || 0) + 1;
      return acc;
    }, {});
  }, [assets]);

  async function refreshVault(activeSession = session) {
    if (!supabase || !activeSession?.user) {
      setAuthorized(false);
      setAssets([]);
      setEvents([]);
      return;
    }

    const { data: accessRow, error: accessError } = await supabase
      .from('owner_studio_access')
      .select('user_id')
      .eq('user_id', activeSession.user.id)
      .maybeSingle();

    if (accessError) {
      setMessage(accessError.message);
      setAuthorized(false);
      return;
    }

    if (!accessRow) {
      setAuthorized(false);
      setAssets([]);
      setEvents([]);
      setMessage('Authenticated, but this account is not provisioned for Black Vault owner access.');
      return;
    }

    setAuthorized(true);

    const [{ data: assetRows, error: assetError }, { data: eventRows, error: eventError }] = await Promise.all([
      supabase
        .from('owner_studio_assets')
        .select('id, asset_id, title, storage_path, asset_type, privacy_tier, review_state, release_approved, reviewed_at, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('owner_studio_review_events')
        .select('id, asset_id, action, from_state, to_state, created_at')
        .order('created_at', { ascending: false })
        .limit(25),
    ]);

    if (assetError || eventError) {
      setMessage(assetError?.message || eventError?.message || 'Unable to load Black Vault.');
      return;
    }

    setAssets(assetRows || []);
    setEvents(eventRows || []);
    setMessage('');
  }

  useEffect(() => {
    if (!supabase) return undefined;

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      refreshVault(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      refreshVault(nextSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(event) {
    event.preventDefault();
    if (!supabase) return;

    setStatus('busy');
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus('idle');
    setMessage(error ? error.message : '');
  }

  async function signUp() {
    if (!supabase) return;

    setStatus('busy');
    setMessage('');

    const { error } = await supabase.auth.signUp({ email, password });
    setStatus('idle');
    setMessage(error ? error.message : 'Account created. Confirm email if required, then provision owner_studio_access.');
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthorized(false);
    setAssets([]);
    setEvents([]);
  }

  async function previewAsset(asset) {
    if (!supabase || !authorized) return;

    setStatus('busy');
    const { data, error } = await supabase.storage
      .from('owner-private-studio')
      .createSignedUrl(asset.storage_path, 60);

    setStatus('idle');

    if (error) {
      setMessage(error.message);
      return;
    }

    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  }

  async function changeReviewState(asset, nextState) {
    if (!supabase || !authorized || nextState === asset.review_state) return;

    setStatus('busy');
    setMessage('');

    const { error } = await supabase.rpc('review_owner_studio_asset', {
      p_asset_id: asset.id,
      p_to_state: nextState,
    });

    if (error) {
      setMessage(error.message);
    } else {
      await refreshVault();
    }

    setStatus('idle');
  }

  if (!ready) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Shadow Monastery · Black Vault</h1>
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-200">
          Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY locally.
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="max-w-lg space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-400">Owner-only boundary</p>
          <h1 className="text-3xl font-bold text-white mt-2">Shadow Monastery · Black Vault</h1>
          <p className="text-sm text-gray-400 mt-2">
            Private asset review, canon control, and release gating. Authentication does not imply authorization.
          </p>
        </div>

        <form onSubmit={signIn} className="rounded-xl border border-violet-900/60 bg-[#11111a] p-5 space-y-4">
          <input
            className="w-full rounded-lg bg-[#0b0b12] border border-[#2a2a3f] px-3 py-2 text-gray-100"
            type="email"
            autoComplete="email"
            placeholder="Owner email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="w-full rounded-lg bg-[#0b0b12] border border-[#2a2a3f] px-3 py-2 text-gray-100"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className="flex gap-2">
            <button disabled={status === 'busy'} className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-600 text-white">
              Sign in
            </button>
            <button
              type="button"
              disabled={status === 'busy'}
              onClick={signUp}
              className="px-4 py-2 rounded-lg border border-violet-700 text-violet-200"
            >
              Create owner account
            </button>
          </div>
          {message && <p className="text-xs text-amber-300">{message}</p>}
        </form>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-violet-400">Authenticated · not authorized</p>
        <h1 className="text-3xl font-bold text-white">Black Vault remains sealed</h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          This account has a valid Supabase session but is not present in owner_studio_access. Provision access administratively; the client cannot self-promote.
        </p>
        {message && <p className="text-xs text-amber-300">{message}</p>}
        <button onClick={signOut} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300">Sign out</button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-400">Shadow Monastery · owner studio</p>
          <h1 className="text-3xl font-bold text-white mt-2">Black Vault Review Queue</h1>
          <p className="text-sm text-gray-400 mt-2">
            Private Supabase bucket · RLS enforced · signed previews expire in 60 seconds.
          </p>
        </div>
        <button onClick={signOut} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300">Sign out</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['unreviewed', 'private_approved', 'vaulted', 'release_candidate'].map((state) => (
          <div key={state} className="rounded-xl border border-[#24243a] bg-[#101019] p-4">
            <div className="text-2xl font-bold text-white">{queueCounts[state] || 0}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{state}</div>
          </div>
        ))}
      </div>

      {message && (
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {assets.length ? assets.map((asset) => (
          <VaultCard
            key={asset.id}
            asset={asset}
            onPreview={previewAsset}
            onReview={changeReviewState}
            busy={status === 'busy'}
          />
        )) : (
          <div className="rounded-xl border border-dashed border-[#303048] p-8 text-sm text-gray-500">
            No owner-studio assets are currently queued.
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#24243a] bg-[#101019] p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Recent audit events</h2>
        <div className="space-y-2">
          {events.length ? events.map((event) => (
            <div key={event.id} className="text-xs flex flex-wrap gap-x-2 gap-y-1 text-gray-400">
              <span className="text-violet-300">{event.action}</span>
              <span>{event.from_state || '—'} → {event.to_state || '—'}</span>
              <span className="text-gray-600">{new Date(event.created_at).toLocaleString()}</span>
            </div>
          )) : <div className="text-xs text-gray-600">No review events yet.</div>}
        </div>
      </div>
    </section>
  );
}
