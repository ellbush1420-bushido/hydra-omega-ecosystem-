import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function OwnerGate({ children }) {
  const [status, setStatus] = useState('loading');
  const [mode, setMode] = useState('signin');
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

  async function submit(event) {
    event.preventDefault();
    setMessage('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }
      setMessage('Account created. Confirm your email if required, then sign in. Studio access remains denied until the owner allowlist is updated.');
      setMode('signin');
      return;
    }

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
        <h2 className="text-xl font-bold text-white mb-2">{mode === 'signup' ? 'Create owner identity' : 'Owner sign in'}</h2>
        <p className="text-sm text-gray-500 mb-5">
          Authentication does not grant Studio access. RLS still requires the server-side owner allowlist.
        </p>
        <form className="space-y-3" onSubmit={submit}>
          <input className="input-field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Owner email" required />
          <input className="input-field" type="password" minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          {message && <div className="text-xs text-amber-300">{message}</div>}
          <button className="btn-primary w-full" type="submit">{mode === 'signup' ? 'Create account' : 'Unlock Studio'}</button>
        </form>
        <button className="mt-3 text-xs text-violet-400 hover:text-violet-300" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); }}>
          {mode === 'signup' ? 'Already have an account? Sign in' : 'First setup? Create the owner account'}
        </button>
      </div>
    );
  }

  return children;
}
