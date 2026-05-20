import { useEffect, useMemo, useState } from 'react';
import {
  fetchBlackVaultReviews,
  updateBlackVaultReviewStatus,
} from '../../services/blackVaultService';

const checklist = [
  { icon: '✅', label: 'Public-safe content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'Age gate on all mature content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'Affiliate disclosure present', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No minors in any content', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No explicit public claims', status: 'Pass', badge: 'badge-green' },
  { icon: '✅', label: 'No real-world sexual services', status: 'Pass', badge: 'badge-green' },
  { icon: '⚠️', label: 'Platform risk level', status: 'Medium', badge: 'badge-amber' },
  { icon: '✅', label: 'Approved for distribution', status: 'Approved', badge: 'badge-green' },
];

const seededReviewQueue = [
  { id: 'seed-review-1', title: "Velrya's Vow — Public Teaser", type: 'Character Spotlight', status: 'Approved', risk: 'Low', owner: 'Den Mother' },
  { id: 'seed-review-2', title: 'The Ninth Veil — Full Scene', type: '18+ Content', status: 'Needs Review', risk: 'Medium', owner: 'Den Mother' },
  { id: 'seed-review-3', title: 'Serpent Sun Banquet Scene', type: '18+ Content', status: 'Approved', risk: 'Low', owner: 'Den Mother' },
  { id: 'seed-review-4', title: 'Hydra Labyrinth Manifesto', type: 'Faction Identity', status: 'Approved', risk: 'Low', owner: 'Den Mother' },
  { id: 'seed-review-5', title: "Den Mother's Protocol — Gated", type: '18+ Content', status: 'Blocked', risk: 'High', owner: 'Den Mother' },
];

const statusColor = {
  Approved: 'badge-green',
  approved: 'badge-green',
  'Needs Review': 'badge-amber',
  'needs-review': 'badge-amber',
  Pending: 'badge-amber',
  pending: 'badge-amber',
  Blocked: 'badge-red',
  blocked: 'badge-red',
};

const riskColor = {
  Low: 'badge-green',
  low: 'badge-green',
  Medium: 'badge-amber',
  medium: 'badge-amber',
  High: 'badge-red',
  high: 'badge-red',
};

const normalizeReview = (item, index) => ({
  id: item.id || `review-${index + 1}`,
  title: item.title || 'Untitled review item',
  type: item.type || 'Vault Review',
  status: item.status || 'Needs Review',
  risk: item.risk || 'Medium',
  owner: item.owner || 'Den Mother',
  notes: item.notes || '',
});

export default function ComplianceCenter() {
  const [reviewQueue, setReviewQueue] = useState(seededReviewQueue);
  const [reviewSource, setReviewSource] = useState('seed');
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [actionState, setActionState] = useState(null);

  useEffect(() => {
    let mounted = true;
    const hydrateReviews = async () => {
      setLoadingReviews(true);
      const reviews = await fetchBlackVaultReviews();
      if (!mounted) return;
      setReviewQueue((reviews?.length ? reviews : seededReviewQueue).map(normalizeReview));
      setReviewSource(reviews?.length ? 'api / storage' : 'seed');
      setLoadingReviews(false);
    };

    hydrateReviews();
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(() => ({
    approved: reviewQueue.filter((item) => String(item.status).toLowerCase() === 'approved').length,
    pending: reviewQueue.filter((item) => ['needs review', 'needs-review', 'pending'].includes(String(item.status).toLowerCase())).length,
    blocked: reviewQueue.filter((item) => String(item.status).toLowerCase() === 'blocked').length,
  }), [reviewQueue]);

  const setReviewStatus = async (item, nextStatus) => {
    const optimistic = reviewQueue.map((review) => review.id === item.id ? { ...review, status: nextStatus } : review);
    setReviewQueue(optimistic);
    const result = await updateBlackVaultReviewStatus(item.id, nextStatus);
    setActionState(result.persisted ? `${item.title}: ${nextStatus} persisted.` : `${item.title}: ${nextStatus} saved locally; API persistence pending.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">✅ Compliance Center</h1>
        <p className="section-subtitle">Platform risk monitoring, Den Mother review queue, and release discipline</p>
      </div>

      <div className="bg-amber-950/30 border border-amber-700 rounded-xl p-5">
        <div className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">Required Disclosure</div>
        <div className="text-amber-300 font-semibold">
          AI-generated fantasy characters. Affiliate links may generate commissions. 18+ destinations are age-gated.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="metric-card border border-emerald-700">
          <div className="text-xs uppercase tracking-widest text-gray-500">Approved</div>
          <div className="mt-2 text-2xl font-black text-emerald-300">{counts.approved}</div>
        </div>
        <div className="metric-card border border-amber-700">
          <div className="text-xs uppercase tracking-widest text-gray-500">Needs Review</div>
          <div className="mt-2 text-2xl font-black text-amber-300">{counts.pending}</div>
        </div>
        <div className="metric-card border border-red-700">
          <div className="text-xs uppercase tracking-widest text-gray-500">Blocked</div>
          <div className="mt-2 text-2xl font-black text-red-300">{counts.blocked}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-white mb-4">🛡 Compliance Checklist</h2>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1a1a2e] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <span className={item.badge}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">📋 Den Mother Review Queue</h2>
            <p className="text-xs text-gray-500">Source: {loadingReviews ? 'loading' : reviewSource}</p>
          </div>
          {actionState && <span className="badge-amber">{actionState}</span>}
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.map((item) => (
                <tr key={item.id}>
                  <td className="font-medium text-gray-200">{item.title}</td>
                  <td className="text-gray-400 text-xs">{item.type}</td>
                  <td><span className={statusColor[item.status] || 'badge-violet'}>{item.status}</span></td>
                  <td><span className={riskColor[item.risk] || 'badge-violet'}>{item.risk}</span></td>
                  <td className="text-xs text-violet-300">{item.owner}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-emerald text-xs py-1 px-2" onClick={() => setReviewStatus(item, 'Approved')}>Approve</button>
                      <button className="btn-outline text-xs py-1 px-2" onClick={() => setReviewStatus(item, 'Needs Review')}>Review</button>
                      <button className="btn-crimson text-xs py-1 px-2" onClick={() => setReviewStatus(item, 'Blocked')}>Block</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
