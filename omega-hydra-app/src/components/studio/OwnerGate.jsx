import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function OwnerGate({ children }) {
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function verifyOwner() {
    setStatus('loading');
    setMessage('');

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setStatus('signed-out');
      return;
    }

    const { data, error } = await supabase
      .from('owner_studio_access')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      setStatus('denied');
      return;
    }

    setStatus('owner');
  }

  useEffect(() => {
    verifyOwner();
    const { data: listener } = supabase.auth.onAuthStateChange(() => verifyOwner());
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setStatus('signed-out');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStatus('signed-out');
  }

  if (status === 'loading') {
    return <div className="card text-sm text-gray-400">Verifying owner authorization…</div>;
  }

  if (status === 'denied') {
    return (
      <div className="card max-w-xl">
        <div className="badge-red inline-flex mb-4">Access denied</div>
        <h2 className="text-xl font-bold text-white mb-2">Owner authorization required</h2>
        <p className="text-sm text-gray-400 mb-5">
          This account is authenticated but is not present in the Studio owner allowlist.
        </p>
        <button className="btn-outline" onClick={signOut}>Sign out</button>
      </div>
    );
  }

  if (status === 'signed-out') {
    return (
      <div className="card max-w-md">
        <div className="badge-violet inline-flex mb-4">Private Studio</div>
        <h2 className="text-xl font-bold text-white mb-2">Owner sign in</h2>
        <p className="text-sm text-gray-500 mb-5">Authentication is required before any asset metadata is requested.</p>
        <form className="space-y-3" onSubmit={signIn}>
          <input className="input-field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Owner email" required />
          <input className="input-field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          {message && <div className="text-xs text-red-400">{message}</div>}
          <button className="btn-primary w-full" type="submit">Unlock Studio</button>
        </form>
      </div>
    );
  }

  return children;
}
