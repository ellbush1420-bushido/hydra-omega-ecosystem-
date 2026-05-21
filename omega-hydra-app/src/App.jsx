import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import Dashboard from './components/tabs/Dashboard';
import SFWPipeline from './components/tabs/SFWPipeline';
import AdultPipeline from './components/tabs/AdultPipeline';
import CharacterFactory from './components/tabs/CharacterFactory';
import DailyDropEngine from './components/tabs/DailyDropEngine';
import BookForge from './components/tabs/BookForge';
import FactionMap from './components/tabs/FactionMap';
import AffiliateTracker from './components/tabs/AffiliateTracker';
import ComplianceCenter from './components/tabs/ComplianceCenter';
import CEOPythons from './components/tabs/CEOPythons';
import EvolutionScanner from './components/tabs/EvolutionScanner';
import Realm5Crowns from './components/tabs/Realm5Crowns';
import JezebelIngest from './components/tabs/JezebelIngest';

const tabComponents = {
  dashboard: Dashboard,
  sfw: SFWPipeline,
  adult: AdultPipeline,
  characters: CharacterFactory,
  drops: DailyDropEngine,
  books: BookForge,
  factions: FactionMap,
  affiliate: AffiliateTracker,
  compliance: ComplianceCenter,
  pythons: CEOPythons,
  scanner: EvolutionScanner,
  realm5crowns: Realm5Crowns,
  jezebel: JezebelIngest,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const TabComponent = tabComponents[activeTab] || Dashboard;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 bg-[#0d0d14]/95 backdrop-blur border-b border-[#1a1a2e] px-4 py-3 flex items-center justify-between">
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/>
            </svg>
          </button>
          <div className="text-[10px] sm:text-xs text-amber-400 font-semibold flex-1 text-center mx-2 sm:mx-4 leading-tight">
            ⚠️ AI-generated fantasy characters. Affiliate links may generate commissions. 18+ destinations are age-gated.
          </div>
          <div className="flex items-center gap-2">
            <span className="badge-green hidden md:inline-flex">System Online</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <TabComponent />
        </main>

        <Footer />
      </div>
    </div>
  );
}
