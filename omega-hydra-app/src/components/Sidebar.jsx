const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡', type: 'tab' },
  { id: 'sfw', label: 'SFW Pipeline', icon: '🌿', type: 'tab' },
  { id: 'adult', label: '18+ Pipeline', icon: '🔒', type: 'tab' },
  { id: 'characters', label: 'Character Factory', icon: '👁', type: 'tab' },
  { id: 'drops', label: 'Daily Drops', icon: '🔥', type: 'tab' },
  { id: 'books', label: 'Book Forge', icon: '📖', type: 'tab' },
  { id: 'factions', label: 'Faction Map', icon: '🐍', type: 'tab' },
  { id: 'affiliate', label: 'Affiliate Tracker', icon: '🔗', type: 'tab' },
  { id: 'compliance', label: 'Compliance', icon: '✅', type: 'tab' },
  { id: 'pythons', label: 'CEO Pythons', icon: '🖤', type: 'tab' },
  { id: 'scanner', label: 'Evolution Scanner', icon: '📡', type: 'tab' },
  { id: 'realm5crowns', label: 'Realm of 5 Crowns', icon: '👑', type: 'tab' },
];

const NEW_PAGES = [
  { path: '/create', label: 'Media Forge', icon: '🎨' },
  { path: '/personas', label: 'Persona Lab', icon: '👥' },
  { path: '/vault', label: 'The Vault', icon: '🗄️' },
  { path: '/conclave', label: 'Conclave Review', icon: '🎯' },
  { path: '/workflows', label: 'Systems Architect', icon: '⚙️' },
  { path: '/warp', label: 'Warp Terminal', icon: '⚡' },
  { path: '/orbit/map', label: 'Context Map', icon: '🗺️' },
];

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0d0d14] border-r border-[#1a1a2e] z-30 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🐉</span>
            <div>
              <div className="text-xs font-bold text-violet-400 uppercase tracking-widest">Omega Hydra CEO</div>
              <div className="text-xs text-gray-500">Black Grin Python Empire OS</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Section Header - Tab-Based Pages */}
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2">
            Tabs
          </div>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); onClose(); }}
              className={`sidebar-item w-full text-left ${activeTab === item.id ? 'active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}

          {/* Section Header - Full-Screen Pages */}
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 py-2 mt-4">
            Tools
          </div>

          {NEW_PAGES.map((page) => (
            <a
              key={page.path}
              href={page.path}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = page.path;
              }}
              className="sidebar-item w-full text-left block"
            >
              <span className="text-base">{page.icon}</span>
              <span className="text-sm font-medium">{page.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a1a2e]">
          <div className="text-[10px] text-gray-600 leading-relaxed">
            AI-generated fantasy characters. Affiliate links may generate commissions. 18+ destinations are age-gated.
          </div>
        </div>
      </aside>
    </>
  );
}
