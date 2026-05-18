import { useMemo, useState } from 'react'
import type { EncryptedVaultRecord, VaultData, VaultItem } from '../../os/blackLotusVault/types'
import {
  createVault,
  deleteEncryptedRecord,
  loadEncryptedRecord,
  persistVaultData,
  unlockVault,
} from '../../os/blackLotusVault/store'

type Mode = 'no_vault' | 'locked' | 'unlocked'

function canUseWebCrypto() {
  return typeof window !== 'undefined' && !!window.crypto?.subtle
}

function newId() {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') return window.crypto.randomUUID()
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export function VaultView() {
  const webCryptoAvailable = canUseWebCrypto()
  const [record, setRecord] = useState<EncryptedVaultRecord | null>(() =>
    webCryptoAvailable ? loadEncryptedRecord() : null,
  )
  const [mode, setMode] = useState<Mode>(() => {
    if (!webCryptoAvailable) return 'locked'
    return record ? 'locked' : 'no_vault'
  })
  const [key, setKey] = useState<CryptoKey | null>(null)
  const [data, setData] = useState<VaultData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [passphrase, setPassphrase] = useState('')
  const [passphraseConfirm, setPassphraseConfirm] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')

  const items = data?.items ?? []
  const hasVault = mode !== 'no_vault'

  const statusText = useMemo(() => {
    if (!webCryptoAvailable) return 'WebCrypto unavailable'
    if (mode === 'no_vault') return 'No vault created'
    if (mode === 'locked') return 'Vault locked'
    return 'Vault unlocked'
  }, [mode, webCryptoAvailable])

  const onLock = () => {
    setKey(null)
    setData(null)
    setMode(record ? 'locked' : 'no_vault')
    setError(null)
    setPassphrase('')
    setPassphraseConfirm('')
    setNewLabel('')
    setNewValue('')
  }

  const onCreate = async () => {
    setError(null)
    if (!webCryptoAvailable) {
      setError('WebCrypto is not available in this browser.')
      return
    }
    if (passphrase.length < 10) {
      setError('Passphrase must be at least 10 characters.')
      return
    }
    if (passphrase !== passphraseConfirm) {
      setError('Passphrases do not match.')
      return
    }
    try {
      const created = await createVault(passphrase)
      setRecord(created.record)
      setKey(created.key)
      setData(created.data)
      setMode('unlocked')
      setPassphrase('')
      setPassphraseConfirm('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create vault.')
    }
  }

  const onUnlock = async () => {
    setError(null)
    if (!record) {
      setError('Vault record missing.')
      return
    }
    if (passphrase.length === 0) {
      setError('Passphrase required.')
      return
    }
    try {
      const unlocked = await unlockVault(passphrase, record)
      setKey(unlocked.key)
      setData(unlocked.data)
      setMode('unlocked')
      setPassphrase('')
    } catch {
      setError('Invalid passphrase or corrupted vault data.')
    }
  }

  const onDeleteVault = () => {
    setError(null)
    const ok = window.confirm('Delete the Black Lotus Vault from this browser? This cannot be undone.')
    if (!ok) return
    deleteEncryptedRecord()
    setRecord(null)
    onLock()
    setMode('no_vault')
  }

  const onAddItem = async () => {
    setError(null)
    if (!key || !record || !data) {
      setError('Unlock the vault first.')
      return
    }
    if (newLabel.trim().length === 0) {
      setError('Label required.')
      return
    }
    const now = new Date().toISOString()
    const nextItem: VaultItem = {
      id: newId(),
      label: newLabel.trim(),
      value: newValue,
      updatedAt: now,
    }
    const nextData: VaultData = {
      ...data,
      items: [nextItem, ...data.items],
    }
    try {
      const updatedRecord = await persistVaultData(key, record, nextData)
      setRecord(updatedRecord)
      setData(nextData)
      setNewLabel('')
      setNewValue('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save vault data.')
    }
  }

  const onDeleteItem = async (id: string) => {
    setError(null)
    if (!key || !record || !data) return
    const nextData: VaultData = { ...data, items: data.items.filter((i) => i.id !== id) }
    try {
      const updatedRecord = await persistVaultData(key, record, nextData)
      setRecord(updatedRecord)
      setData(nextData)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save vault data.')
    }
  }

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Black Lotus Vault</div>
        <div className="row">
          <span className="chip">{statusText}</span>
          {mode === 'unlocked' ? (
            <button type="button" className="button" onClick={onLock}>
              Lock
            </button>
          ) : null}
          {hasVault ? (
            <button type="button" className="button buttonDanger" onClick={onDeleteVault}>
              Delete Vault
            </button>
          ) : null}
        </div>
      </div>
      <div className="panelBody">
        {!webCryptoAvailable ? (
          <div className="errorBox">This browser does not support WebCrypto (`window.crypto.subtle`).</div>
        ) : null}

        {error ? <div className="errorBox">{error}</div> : null}

        {mode === 'no_vault' ? (
          <div className="stack">
            <div className="muted">
              Create a local encrypted vault in this browser. The passphrase is never stored.
            </div>
            <div className="grid2">
              <div className="field">
                <div className="label">Passphrase</div>
                <input
                  className="input"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="field">
                <div className="label">Confirm passphrase</div>
                <input
                  className="input"
                  type="password"
                  value={passphraseConfirm}
                  onChange={(e) => setPassphraseConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <div className="row">
              <button type="button" className="button buttonPrimary" onClick={onCreate}>
                Create Vault
              </button>
              <span className="muted">AES-GCM · PBKDF2-SHA256</span>
            </div>
          </div>
        ) : null}

        {mode === 'locked' ? (
          <div className="stack">
            <div className="muted">Unlock to view and manage vaulted items.</div>
            <div className="field">
              <div className="label">Passphrase</div>
              <input
                className="input"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="row">
              <button type="button" className="button buttonPrimary" onClick={onUnlock}>
                Unlock
              </button>
              <span className="muted">Wrong passphrase cannot be recovered.</span>
            </div>
          </div>
        ) : null}

        {mode === 'unlocked' ? (
          <div className="stack">
            <div className="card">
              <div className="cardTitle">Add vault item</div>
              <div style={{ height: 10 }} />
              <div className="grid2">
                <div className="field">
                  <div className="label">Label</div>
                  <input className="input" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                </div>
                <div className="field">
                  <div className="label">Value</div>
                  <textarea
                    className="textarea"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </div>
              <div className="row">
                <button type="button" className="button buttonPrimary" onClick={onAddItem}>
                  Save to Vault
                </button>
                <span className="muted">{items.length} items</span>
              </div>
            </div>

            <div className="divider" />

            {items.length === 0 ? (
              <div className="muted">No items yet.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Label</th>
                    <th>Value</th>
                    <th style={{ width: 140 }}>Updated</th>
                    <th style={{ width: 120 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.label}</td>
                      <td>
                        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{item.value}</div>
                      </td>
                      <td className="muted" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                        {new Date(item.updatedAt).toLocaleString()}
                      </td>
                      <td>
                        <button type="button" className="button buttonDanger" onClick={() => onDeleteItem(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
