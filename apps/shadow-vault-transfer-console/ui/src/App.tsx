import { useMemo, useState } from 'react'
import './App.css'
import { CanvasWarpBackground } from './components/CanvasWarpBackground'
import { Sidebar, type NavItemId } from './components/Sidebar'
import { CommandCenterView } from './features/command-center/CommandCenterView'
import { ReleasesView } from './features/releases/ReleasesView'
import { TransfersView } from './features/transfers/TransfersView'
import { VaultView } from './features/vault/VaultView'

function App() {
  const [active, setActive] = useState<NavItemId>('command_center')
  const view = useMemo(() => {
    switch (active) {
      case 'command_center':
        return <CommandCenterView />
      case 'vault':
        return <VaultView />
      case 'transfers':
        return <TransfersView />
      case 'releases':
        return <ReleasesView />
      default: {
        const exhaustive: never = active
        return exhaustive
      }
    }
  }, [active])

  return (
    <div className="appRoot">
      <CanvasWarpBackground />
      <div className="appShell">
        <Sidebar active={active} onSelect={setActive} />
        <main className="mainPane">
          <header className="topBar">
            <div className="topBarTitle">
              Shadow Vault Transfer Console
              <span className="topBarSubtitle">Conclave Edition</span>
            </div>
            <div className="topBarMeta">
              <span className="chip">HOMCE</span>
              <span className="chip">Warp.dev Limitless</span>
              <span className="chip">Hydra Meta OS</span>
            </div>
          </header>
          <section className="contentPane">{view}</section>
        </main>
      </div>
    </div>
  )
}

export default App
