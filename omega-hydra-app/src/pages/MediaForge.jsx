import { useState } from 'react';

export default function MediaForge() {
  const [prompt, setPrompt] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('neutral');
  const [generatedImage, setGeneratedImage] = useState(null);

  const personas = [
    { id: 'neutral', name: 'Neutral', icon: '⚪' },
    { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
    { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
    { id: 'horror', name: 'Horror', icon: '👻' },
    { id: 'anime', name: 'Anime', icon: '🎨' },
  ];

  const handleGenerate = () => {
    // Placeholder for generation logic
    setGeneratedImage({
      url: 'https://via.placeholder.com/800x600?text=Generated+Image',
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex">
      {/* Left Panel - Prompt + Persona Selector */}
      <div className="w-80 bg-[#0d0d14] border-r border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
            <span>🎨</span>
            Media Forge
          </h2>
          <p className="text-xs text-gray-500 mt-1">Create stunning visuals</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full h-32 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500 focus:outline-none resize-none"
            />
          </div>

          {/* Persona Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Persona Style
            </label>
            <div className="space-y-2">
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedPersona === persona.id
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                      : 'bg-[#0a0a0f] border-[#1a1a2e] text-gray-400 hover:border-violet-500/50'
                  }`}
                >
                  <span className="text-xl">{persona.icon}</span>
                  <span className="text-sm font-medium">{persona.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            Generate Media
          </button>
        </div>
      </div>

      {/* Center Preview Pane */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          {generatedImage ? (
            <div className="max-w-4xl w-full">
              <img
                src={generatedImage.url}
                alt="Generated content"
                className="w-full rounded-lg shadow-2xl border border-[#1a1a2e]"
              />
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg">Enter a prompt and select a persona to begin</p>
              <p className="text-sm mt-2">Real-time generation preview will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Variant Controls */}
      <div className="w-80 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Variant Controls</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Style Strength */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Style Strength
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="75"
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Subtle</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quality
            </label>
            <select className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none">
              <option>Standard</option>
              <option>High</option>
              <option>Ultra</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['1:1', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  className="py-2 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg text-xs text-gray-400 hover:border-violet-500 transition-colors"
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Seed */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Seed (optional)
            </label>
            <input
              type="number"
              placeholder="Random"
              className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-2 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Test in Conclave Button */}
          <div className="pt-4 border-t border-[#1a1a2e]">
            <button
              disabled={!generatedImage}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Test in Conclave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
