import { useMemo, useState } from 'react';
import { normalizeConversationsPayload } from '../../utils/chatIngest';

const SAMPLE_JEZEBEL_RESPONSE = {
  conversations: [
    {
      id: 'conv-001',
      title: 'Launch planning',
      model: 'gpt-4.1',
      tags: ['product', 'roadmap'],
      messages: [
        { id: 'm1', role: 'user', content: 'Draft launch sequence.' },
        { id: 'm2', role: 'assistant', content: 'Phase by market and channel.' },
      ],
    },
  ],
};

export default function JezebelIngest() {
  const [endpoint, setEndpoint] = useState('https://api.jezebel.example.com/conversations');
  const [token, setToken] = useState('');
  const [rawResponse, setRawResponse] = useState(JSON.stringify(SAMPLE_JEZEBEL_RESPONSE, null, 2));
  const [conversations, setConversations] = useState(normalizeConversationsPayload(SAMPLE_JEZEBEL_RESPONSE));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastPulledAt, setLastPulledAt] = useState(null);

  const totalMessages = useMemo(
    () => conversations.reduce((count, conversation) => count + conversation.messages.length, 0),
    [conversations],
  );

  const handlePull = async () => {
    const trimmedEndpoint = endpoint.trim();

    if (!trimmedEndpoint) {
      setError('API endpoint is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(trimmedEndpoint, {
        headers: token.trim()
          ? {
            Authorization: `Bearer ${token.trim()}`,
            Accept: 'application/json',
          }
          : { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API pull failed (${response.status})`);
      }

      const payload = await response.json();
      const normalized = normalizeConversationsPayload(payload);
      setRawResponse(JSON.stringify(payload, null, 2));
      setConversations(normalized);
      setLastPulledAt(new Date().toISOString());
    } catch (pullError) {
      setError(pullError instanceof Error ? pullError.message : 'Failed to pull conversations.');
    } finally {
      setLoading(false);
    }
  };

  const handleNormalizeFromRaw = () => {
    try {
      const parsed = JSON.parse(rawResponse);
      const normalized = normalizeConversationsPayload(parsed);
      setConversations(normalized);
      setError('');
    } catch {
      setError('Raw JSON is invalid.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">🧵 Jezebel AI Chat Ingest</h1>
        <p className="section-subtitle">Pull conversations via API and normalize title, messages, model, and tags</p>
      </div>

      <div className="card space-y-4">
        <h2 className="text-base font-bold text-white">🔌 API Pull</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Endpoint</label>
            <input
              className="input-field"
              value={endpoint}
              onChange={(event) => setEndpoint(event.target.value)}
              placeholder="https://api.jezebel.example.com/conversations"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Bearer Token (optional)</label>
            <input
              type="password"
              className="input-field"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste API token"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" onClick={handlePull} disabled={loading}>
            {loading ? 'Pulling...' : '📥 Pull Conversations'}
          </button>
          <button className="btn-outline" onClick={handleNormalizeFromRaw} disabled={loading}>
            ♻ Normalize Raw JSON
          </button>
          {lastPulledAt && <span className="badge-blue">Last pulled: {new Date(lastPulledAt).toLocaleString()}</span>}
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800 rounded-lg p-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-bold text-white">🧾 Raw API Payload</h2>
          <span className="badge-violet">JSON</span>
        </div>
        <textarea
          className="textarea-field font-mono text-xs"
          rows={10}
          value={rawResponse}
          onChange={(event) => setRawResponse(event.target.value)}
          placeholder="Paste raw API JSON payload here"
        />
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base font-bold text-white">✅ Normalized Conversations</h2>
          <div className="flex gap-2">
            <span className="badge-green">Conversations: {conversations.length}</span>
            <span className="badge-violet">Messages: {totalMessages}</span>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="text-sm text-gray-400">No conversations found in payload.</div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="bg-[#0a0a0f] rounded-lg p-4 border border-[#1a1a2e] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-sm font-semibold text-white">{conversation.title}</div>
                    <div className="text-xs text-gray-500">ID: {conversation.id}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-blue">Model: {conversation.model}</span>
                    {conversation.tags.map((tag) => (
                      <span key={`${conversation.id}-${tag}`} className="badge-amber">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {conversation.messages.map((message) => (
                    <div key={message.id} className="rounded border border-[#1a1a2e] px-3 py-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{message.role}</div>
                      <div className="text-sm text-gray-200 whitespace-pre-wrap">{message.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
