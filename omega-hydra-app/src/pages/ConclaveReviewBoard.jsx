import { useState } from 'react';

export default function ConclaveReviewBoard() {
  const [selectedCard, setSelectedCard] = useState(null);

  const cards = Array.from({ length: 81 }, (_, i) => ({
    id: i + 1,
    name: `Asset ${i + 1}`,
    aiScore: Math.floor(Math.random() * 100),
    humanScore: Math.floor(Math.random() * 100),
    thumbnail: `https://via.placeholder.com/150?text=${i + 1}`,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  }));

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handlePromote = () => {
    if (selectedCard) {
      alert(`Promoting Asset ${selectedCard.id} to Production via Warp.dev hook`);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col">
      <div className="p-4 border-b border-[#1a1a2e]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
            <span>🎯</span>
            Conclave Review Board
          </h2>
          <button
            onClick={handlePromote}
            disabled={!selectedCard}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Promote to Production
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 9×9 Scoring Matrix */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-9 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`aspect-square rounded-lg border overflow-hidden transition-all ${
                  selectedCard?.id === card.id
                    ? 'border-violet-500 ring-2 ring-violet-500/50 scale-105'
                    : 'border-[#1a1a2e] hover:border-violet-500/50'
                }`}
              >
                <div className="relative h-full flex flex-col">
                  <img
                    src={card.thumbnail}
                    alt={card.name}
                    className="flex-1 object-cover"
                  />
                  <div className="bg-[#0d0d14]/95 p-1 space-y-0.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">AI:</span>
                      <span className={getScoreColor(card.aiScore)}>
                        {card.aiScore}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Human:</span>
                      <span className={getScoreColor(card.humanScore)}>
                        {card.humanScore}
                      </span>
                    </div>
                  </div>
                  {card.status === 'approved' && (
                    <div className="absolute top-1 right-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded">
                      ✓
                    </div>
                  )}
                  {card.status === 'rejected' && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                      ✗
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-96 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
          <div className="p-4 border-b border-[#1a1a2e]">
            <h3 className="text-lg font-bold text-violet-400">Review Details</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedCard ? (
              <div className="space-y-6">
                <img
                  src={selectedCard.thumbnail}
                  alt={selectedCard.name}
                  className="w-full rounded-lg border border-[#1a1a2e]"
                />

                <div>
                  <h4 className="font-medium text-gray-200 mb-3">{selectedCard.name}</h4>

                  <div className="space-y-3">
                    <div className="p-3 bg-[#0a0a0f] rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">AI Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(selectedCard.aiScore)}`}>
                        {selectedCard.aiScore}/100
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                        <div
                          className="bg-violet-500 h-2 rounded-full"
                          style={{ width: `${selectedCard.aiScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#0a0a0f] rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Human Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(selectedCard.humanScore)}`}>
                        {selectedCard.humanScore}/100
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${selectedCard.humanScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#0a0a0f] rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Average Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(
                        Math.round((selectedCard.aiScore + selectedCard.humanScore) / 2)
                      )}`}>
                        {Math.round((selectedCard.aiScore + selectedCard.humanScore) / 2)}/100
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded-lg">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className={`text-sm font-medium ${
                        selectedCard.status === 'approved'
                          ? 'text-emerald-400'
                          : selectedCard.status === 'rejected'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}>
                        {selectedCard.status.charAt(0).toUpperCase() + selectedCard.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#1a1a2e]">
                  <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    Approve
                  </button>
                  <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    Reject
                  </button>
                  <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    Request Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-600">
                <div>
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-lg">Select a card to review</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
