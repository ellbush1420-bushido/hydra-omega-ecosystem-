import { base64ToBytes } from './codec'
import { BLACK_LOTUS_VAULT_STORAGE_KEY, BLACK_LOTUS_VAULT_VERSION } from './constants'
import { decryptVaultData, deriveVaultKey, encryptVaultData, newSalt, newVaultRecord } from './crypto'
import type { EncryptedVaultRecord, VaultData } from './types'

export function loadEncryptedRecord(): EncryptedVaultRecord | null {
  const raw = window.localStorage.getItem(BLACK_LOTUS_VAULT_STORAGE_KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw) as unknown
  if (!parsed || typeof parsed !== 'object') return null
  const record = parsed as EncryptedVaultRecord
  if (record.version !== BLACK_LOTUS_VAULT_VERSION) return null
  return record
}

export function saveEncryptedRecord(record: EncryptedVaultRecord) {
  window.localStorage.setItem(BLACK_LOTUS_VAULT_STORAGE_KEY, JSON.stringify(record))
}

export function deleteEncryptedRecord() {
  window.localStorage.removeItem(BLACK_LOTUS_VAULT_STORAGE_KEY)
}

export async function createVault(passphrase: string): Promise<{
  record: EncryptedVaultRecord
  key: CryptoKey
  data: VaultData
}> {
  const now = new Date().toISOString()
  const salt = newSalt()
  const key = await deriveVaultKey(passphrase, salt)
  const data: VaultData = { version: 1, items: [] }
  const enc = await encryptVaultData(key, data)
  const record = newVaultRecord({ salt, iv: enc.iv, ciphertext: enc.ciphertext, createdAt: now, updatedAt: now })
  saveEncryptedRecord(record)
  return { record, key, data }
}

export async function unlockVault(passphrase: string, record: EncryptedVaultRecord): Promise<{
  key: CryptoKey
  data: VaultData
}> {
  const salt = base64ToBytes(record.kdf.saltB64)
  const key = await deriveVaultKey(passphrase, salt, record.kdf.iterations)
  const data = await decryptVaultData(key, record)
  return { key, data }
}

export async function persistVaultData(key: CryptoKey, record: EncryptedVaultRecord, data: VaultData) {
  const enc = await encryptVaultData(key, data)
  const updatedAt = new Date().toISOString()
  const saltBytes = base64ToBytes(record.kdf.saltB64)
  const newRecord = newVaultRecord({
    salt: saltBytes,
    iv: enc.iv,
    ciphertext: enc.ciphertext,
    createdAt: record.createdAt,
    updatedAt,
    iterations: record.kdf.iterations,
  })
  saveEncryptedRecord(newRecord)
  return newRecord
}
