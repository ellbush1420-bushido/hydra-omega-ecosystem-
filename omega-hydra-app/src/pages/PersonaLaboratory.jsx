import { useState } from 'react';

export default function PersonaLaboratory() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [testMessage, setTestMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const personas = [
    { id: 1, name: 'The Strategist', traits: { logic: 90, creativity: 40 }, icon: '♟️' },
    { id: 2, name: 'The Dreamer', traits: { logic: 30, creativity: 95 }, icon: '✨' },
    { id: 3, name: 'The Warrior', traits: { logic: 60, creativity: 50 }, icon: '⚔️' },
    { id: 4, name: 'The Sage', traits: { logic: 85, creativity: 70 }, icon: '📚' },
  ];

  const handleTest = () => {
    if (!testMessage.trim()) return;

    setChatHistory([
      ...chatHistory,
      { role: 'user', content: testMessage },
      { role: 'assistant', content: `[${selectedPersona?.name}] Response to: ${testMessage}` }
    ]);
    setTestMessage('');
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex">
      {/* Left Panel - Persona Library Grid */}
      <div className="w-80 bg-[#0d0d14] border-r border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
            <span>👥</span>
            Persona Library
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedPersona?.id === persona.id
                    ? 'bg-violet-500/20 border-violet-500'
                    : 'bg-[#0a0a0f] border-[#1a1a2e] hover:border-violet-500/50'
                }`}
              >
                <div className="text-2xl mb-2">{persona.icon}</div>
                <div className="font-medium text-gray-200">{persona.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Logic: {persona.traits.logic} | Creativity: {persona.traits.creativity}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Panel - Live Test Arena */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Live Test Arena</h3>
          {selectedPersona && (
            <p className="text-sm text-gray-500 mt-1">
              Testing: {selectedPersona.name}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedPersona ? (
            <div className="space-y-4">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-violet-500/20 ml-12'
                      : 'bg-[#0d0d14] mr-12'
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {msg.role === 'user' ? 'You' : selectedPersona.name}
                  </div>
                  <div className="text-sm text-gray-200">{msg.content}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-lg">Select a persona to begin testing</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#1a1a2e]">
          <div className="flex gap-2">
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTest()}
              placeholder="Type a test message..."
              disabled={!selectedPersona}
              className="flex-1 bg-[#0d0d14] border border-[#1a1a2e] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:border-violet-500 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleTest}
              disabled={!selectedPersona || !testMessage.trim()}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Trait Sliders */}
      <div className="w-80 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Trait Controls</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {selectedPersona ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logic
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={selectedPersona.traits.logic}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-500 mt-1">
                  {selectedPersona.traits.logic}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Creativity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={selectedPersona.traits.creativity}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-500 mt-1">
                  {selectedPersona.traits.creativity}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Empathy
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-500 mt-1">50%</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assertiveness
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-500 mt-1">50%</div>
              </div>

              <div className="pt-4 border-t border-[#1a1a2e]">
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                  Inject into Orbit
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p className="text-sm">Select a persona to adjust traits</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
