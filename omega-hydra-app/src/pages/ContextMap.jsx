import { useState, useEffect, useRef } from 'react';

export default function ContextMap() {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([
    { id: '1', label: 'Media Asset #42', type: 'asset', x: 200, y: 150, vx: 0, vy: 0 },
    { id: '2', label: 'Warrior Persona', type: 'persona', x: 400, y: 200, vx: 0, vy: 0 },
    { id: '3', label: 'Gen Workflow', type: 'workflow', x: 300, y: 300, vx: 0, vy: 0 },
    { id: '4', label: 'Conclave Review', type: 'conclave', x: 500, y: 250, vx: 0, vy: 0 },
    { id: '5', label: 'Media Asset #43', type: 'asset', x: 250, y: 400, vx: 0, vy: 0 },
  ]);

  const [edges] = useState([
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '1', to: '3' },
    { from: '3', to: '5' },
  ]);

  // Simple force-directed layout simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        const newNodes = prevNodes.map(node => ({ ...node }));

        // Apply forces
        newNodes.forEach((node, i) => {
          let fx = 0, fy = 0;

          // Repulsion from other nodes
          newNodes.forEach((other, j) => {
            if (i === j) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 1000 / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          });

          // Attraction along edges
          edges.forEach(edge => {
            if (edge.from === node.id) {
              const target = newNodes.find(n => n.id === edge.to);
              if (target) {
                const dx = target.x - node.x;
                const dy = target.y - node.y;
                fx += dx * 0.01;
                fy += dy * 0.01;
              }
            }
            if (edge.to === node.id) {
              const source = newNodes.find(n => n.id === edge.from);
              if (source) {
                const dx = source.x - node.x;
                const dy = source.y - node.y;
                fx += dx * 0.01;
                fy += dy * 0.01;
              }
            }
          });

          // Center attraction
          const centerX = 400;
          const centerY = 300;
          fx += (centerX - node.x) * 0.001;
          fy += (centerY - node.y) * 0.001;

          // Update velocity and position
          node.vx = (node.vx + fx) * 0.8;
          node.vy = (node.vy + fy) * 0.8;
          node.x += node.vx;
          node.y += node.vy;

          // Keep within bounds
          node.x = Math.max(50, Math.min(750, node.x));
          node.y = Math.max(50, Math.min(550, node.y));
        });

        return newNodes;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [edges]);

  const getNodeColor = (type) => {
    const colors = {
      asset: '#8b5cf6',
      persona: '#10b981',
      workflow: '#3b82f6',
      conclave: '#f59e0b',
    };
    return colors[type] || '#6b7280';
  };

  const getNodeIcon = (type) => {
    const icons = {
      asset: '🎨',
      persona: '👤',
      workflow: '⚙️',
      conclave: '🎯',
    };
    return icons[type] || '📦';
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex">
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-violet-400 flex items-center gap-2">
              <span>🗺️</span>
              Context Map
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Reset View
              </button>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                Export Map
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-[#0a0a0f]">
          <svg
            ref={canvasRef}
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(139,92,246,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          >
            {/* Render Edges */}
            <g>
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="rgba(139,92,246,0.3)"
                    strokeWidth="2"
                  />
                );
              })}
            </g>

            {/* Render Nodes */}
            <g>
              {nodes.map((node) => (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                  style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={selectedNode?.id === node.id ? "35" : "30"}
                    fill={getNodeColor(node.type)}
                    stroke={selectedNode?.id === node.id ? "#fff" : "transparent"}
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="20"
                    fill="white"
                  >
                    {getNodeIcon(node.type)}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          {/* Node Labels */}
          {nodes.map((node) => (
            <div
              key={`label-${node.id}`}
              className="absolute text-xs text-gray-400 bg-[#0d0d14] px-2 py-1 rounded pointer-events-none"
              style={{
                left: node.x - 40,
                top: node.y + 40,
                width: '80px',
                textAlign: 'center',
              }}
            >
              {node.label}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-[#1a1a2e] bg-[#0d0d14]">
          <div className="flex gap-6 justify-center">
            {['asset', 'persona', 'workflow', 'conclave'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getNodeColor(type) }}
                />
                <span className="text-xs text-gray-400 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Node Details */}
      <div className="w-80 bg-[#0d0d14] border-l border-[#1a1a2e] flex flex-col">
        <div className="p-4 border-b border-[#1a1a2e]">
          <h3 className="text-lg font-bold text-violet-400">Node Details</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{getNodeIcon(selectedNode.type)}</div>
                <h4 className="font-medium text-gray-200">{selectedNode.label}</h4>
                <div
                  className="inline-block mt-2 px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                >
                  {selectedNode.type}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1a1a2e]">
                <div className="text-sm">
                  <span className="text-gray-500">ID:</span>
                  <span className="text-gray-300 ml-2">{selectedNode.id}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Connections:</span>
                  <span className="text-gray-300 ml-2">
                    {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a2e]">
                <h5 className="text-sm font-medium text-gray-300 mb-2">Connected Nodes</h5>
                <div className="space-y-1">
                  {edges
                    .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                    .map((edge, idx) => {
                      const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
                      const otherNode = nodes.find(n => n.id === otherId);
                      return (
                        <div key={idx} className="text-xs text-gray-400 p-2 bg-[#0a0a0f] rounded">
                          {otherNode?.label}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#1a1a2e] space-y-2">
                <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  View Details
                </button>
                <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Navigate To
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-600">
              <div>
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-lg">Click a node to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
