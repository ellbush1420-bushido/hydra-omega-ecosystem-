import type { ReactNode } from 'react'

export type NavItemId = 'command_center' | 'vault' | 'transfers' | 'releases'

type NavItem = {
  id: NavItemId
  label: string
  hint: string
  icon: ReactNode
}

const navItems: NavItem[] = [
  { id: 'command_center', label: 'Command Center', hint: 'Orchestration layer', icon: '⌘' },
  { id: 'vault', label: 'Black Lotus Vault', hint: 'Vaulted assets', icon: '⬢' },
  { id: 'transfers', label: 'Transfer Queue', hint: 'Governed pipeline', icon: '⇄' },
  { id: 'releases', label: 'Conclave Board', hint: 'Release routing', icon: '✦' },
]

export function Sidebar(props: { active: NavItemId; onSelect: (id: NavItemId) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandName">Hydra Obsidian Motion</div>
        <div className="brandSub">HOMCE · Jezebel Velvet · Meta OS</div>
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === props.active ? 'navItem navItemActive' : 'navItem'}
            onClick={() => props.onSelect(item.id)}
          >
            <span className="navIcon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="navText">
              <span className="navLabel">{item.label}</span>
              <span className="navHint">{item.hint}</span>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebarFooter">
        <div className="footerLine">Standalone Console UI</div>
        <div className="footerLine muted">Local-first · No network required</div>
      </div>
    </aside>
  )
}

