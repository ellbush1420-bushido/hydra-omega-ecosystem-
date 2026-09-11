import { useState } from 'react';
import OwnerPrivateStudio from './OwnerPrivateStudio';
import PersonaForge from './PersonaForge';
import VisualizationEngine from '../studio/VisualizationEngine';
import MotionStudio from '../studio/MotionStudio';

const MODULES = [
  { id: 'assets', label: 'Asset Review', icon: '🛡️' },
  { id: 'personas', label: 'Persona Forge', icon: '◈' },
  { id: 'visualization', label: 'Visualization Engine', icon: '◉' },
  { id: 'motion', label: 'Motion Studio', icon: '▶' },
];

export default function SovereignStudio() {
  const [module, setModule] = useState('assets');

  return (
    <div>
      <div className="mb-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge-red">OWNER ONLY</span>
          <span className="badge-violet">SOVEREIGN CREATIVE SYSTEM</span>
        </div>
        <h1 className="section-title">Hydra Sovereign Studio</h1>
        <p className="section-subtitle">Private creation, visualization, motion, persona, and release-review workspace.</p>
      </div>

      <div className="card !p-2 flex flex-wrap gap-2 mb-5">
        {MODULES.map((item) => (
          <button
            key={item.id}
            onClick={() => setModule(item.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${module === item.id ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a2e]'}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {module === 'assets' && <OwnerPrivateStudio />}
      {module === 'personas' && <PersonaForge />}
      {module === 'visualization' && <VisualizationEngine />}
      {module === 'motion' && <MotionStudio />}
    </div>
  );
}
