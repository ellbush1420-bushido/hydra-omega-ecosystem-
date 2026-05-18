import { useState } from 'react';

export default function TheVault() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [uploadZoneActive, setUploadZoneActive] = useState(false);

  const assets = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Asset ${i + 1}`,
    type: ['image', 'video', 'audio', 'model'][i % 4],
    score: Math.floor(Math.random() * 100),
    ipStatus: ['safe', 'pending', 'flagged'][Math.floor(Math.random() * 3)],
    thumbnail: `https://via.placeholder.com/300x200?text=Asset+${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  }));

  const filteredAssets = filterType === 'all'
    ? assets
    : assets.filter(a => a.type === filterType);

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadZoneActive(false);
    // Placeholder for file upload logic
    alert('File upload functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex">
      {/* Main Asset Grid */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
              <span>🗄️</span>
              The Vault
            </h2>
            <div className="flex gap-2">
              {['all', 'image', 'video', 'audio', 'model'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    filterType === type
                      ? 'bg-violet-600 text-white'
                      : 'bg-[#0d0d14] text-gray-400 hover:text-white'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className={`m-4 border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            uploadZoneActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-[#1a1a2e] bg-[#0d0d14]'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setUploadZoneActive(true);
          }}
          onDragLeave={() => setUploadZoneActive(false)}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-2">📤</div>
          <p className="text-sm text-gray-400">
            Drag and drop files here or{' '}
            <button className="text-violet-400 hover:underline">browse</button>
          </p>
        </div>

        {/* Asset Grid with Infinite Scroll */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`group relative rounded-lg overflow-hidden border transition-all ${
                  selectedAsset?.id === asset.id
                    ? 'border-violet-500 ring-2 ring-violet-500/50'
                    : 'border-[#1a1a2e] hover:border-violet-500/50'
                }`}
              >
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 bg-[#0d0d14]">
                  <div className="font-medium text-sm text-gray-200 truncate">
                    {asset.name}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{asset.type}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        asset.ipStatus === 'safe'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : asset.ipStatus === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {asset.ipStatus}
                    </span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  Score: {asset.score}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata Sidebar */}
      <div className="w-80 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Asset Details</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedAsset ? (
            <div className="space-y-4">
              <img
                src={selectedAsset.thumbnail}
                alt={selectedAsset.name}
                className="w-full rounded-lg border border-[#1a1a2e]"
              />

              <div>
                <h4 className="font-medium text-gray-200 mb-2">{selectedAsset.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="text-gray-300">{selectedAsset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Score:</span>
                    <span className="text-gray-300">{selectedAsset.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IP Status:</span>
                    <span
                      className={
                        selectedAsset.ipStatus === 'safe'
                          ? 'text-emerald-400'
                          : selectedAsset.ipStatus === 'pending'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }
                    >
                      {selectedAsset.ipStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="text-gray-300">{selectedAsset.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a2e] space-y-2">
                <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Edit Asset
                </button>
                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Test in Conclave
                </button>
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Delete Asset
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-600">
              <div>
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg">Select an asset to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
