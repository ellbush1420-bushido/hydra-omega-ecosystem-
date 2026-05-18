import { useState } from 'react';

export default function SystemsArchitect() {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'generate', label: 'Generate Media', x: 100, y: 100 },
    { id: '2', type: 'score', label: 'Score in Conclave', x: 300, y: 100 },
    { id: '3', type: 'execute', label: 'Execute on Warp', x: 500, y: 100 },
  ]);

  const [connections, setConnections] = useState([
    { from: '1', to: '2' },
    { from: '2', to: '3' },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = [
    { type: 'generate', label: 'Generate Media', icon: '🎨', color: 'violet' },
    { type: 'score', label: 'Score in Conclave', icon: '🎯', color: 'emerald' },
    { type: 'execute', label: 'Execute on Warp', icon: '⚡', color: 'blue' },
    { type: 'persona', label: 'Apply Persona', icon: '👥', color: 'purple' },
    { type: 'vault', label: 'Store in Vault', icon: '🗄️', color: 'amber' },
  ];

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = JSON.parse(e.dataTransfer.getData('nodeType'));
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode = {
      id: Date.now().toString(),
      type: nodeType.type,
      label: nodeType.label,
      x,
      y,
    };

    setNodes([...nodes, newNode]);
  };

  const getNodeColor = (type) => {
    const colors = {
      generate: 'bg-violet-600',
      score: 'bg-emerald-600',
      execute: 'bg-blue-600',
      persona: 'bg-purple-600',
      vault: 'bg-amber-600',
    };
    return colors[type] || 'bg-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex">
      {/* Left Panel - Node Palette */}
      <div className="w-64 bg-[#0d0d14] border-r border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h2 className="text-lg font-bold text-violet-400 flex items-center gap-2">
            <span>🔧</span>
            Node Library
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType)}
              className="p-3 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg cursor-move hover:border-violet-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{nodeType.icon}</span>
                <span className="text-sm font-medium text-gray-200">{nodeType.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
              <span>⚙️</span>
              Systems Architect
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Save Workflow
              </button>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Run Workflow
              </button>
            </div>
          </div>
        </div>

        <div
          className="flex-1 relative bg-[#0a0a0f] overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Render Connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={idx}
                  x1={fromNode.x + 75}
                  y1={fromNode.y + 30}
                  x2={toNode.x + 75}
                  y2={toNode.y + 30}
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`absolute cursor-pointer transition-all ${
                selectedNode?.id === node.id ? 'ring-2 ring-violet-500' : ''
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: '150px',
              }}
            >
              <div className={`${getNodeColor(node.type)} rounded-lg p-3 shadow-lg`}>
                <div className="text-white text-sm font-medium text-center">
                  {node.label}
                </div>
              </div>
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-[#0a0a0f]" />
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-700 rounded-full border-2 border-[#0a0a0f]" />
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="flex items-center justify-center h-full text-center text-gray-600">
              <div>
                <div className="text-6xl mb-4">🔧</div>
                <p className="text-lg">Drag nodes from the left panel to build your workflow</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Node Properties */}
      <div className="w-80 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Node Properties</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Node Label
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    setNodes(nodes.map(n =>
                      n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                    ));
                    setSelectedNode({ ...selectedNode, label: e.target.value });
                  }}
                  className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-2 text-sm text-gray-200 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Node Type
                </label>
                <div className="text-sm text-gray-400 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg p-2">
                  {selectedNode.type}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a2e] space-y-2">
                <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Configure Node
                </button>
                <button
                  onClick={() => {
                    setNodes(nodes.filter(n => n.id !== selectedNode.id));
                    setConnections(connections.filter(c =>
                      c.from !== selectedNode.id && c.to !== selectedNode.id
                    ));
                    setSelectedNode(null);
                  }}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Delete Node
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-600">
              <p className="text-sm">Select a node to view properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
