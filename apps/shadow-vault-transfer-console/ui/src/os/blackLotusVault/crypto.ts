import { base64ToBytes, bytesToBase64, bytesToText, textToBytes } from './codec'
import { PBKDF2_ITERATIONS } from './constants'
import type { EncryptedVaultRecord, VaultData } from './types'

function assertCryptoAvailable() {
  if (typeof window === 'undefined') throw new Error('Crypto unavailable (no window)')
  if (!window.crypto?.subtle) throw new Error('WebCrypto not available in this browser')
}

export async function deriveVaultKey(passphrase: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS) {
  assertCryptoAvailable()
  const baseKey = await window.crypto.subtle.importKey('raw', textToBytes(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ])
  const saltBuffer = new Uint8Array(salt).buffer as ArrayBuffer

  return window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBuffer, iterations },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptVaultData(key: CryptoKey, data: VaultData) {
  assertCryptoAvailable()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const plaintext = textToBytes(JSON.stringify(data))
  const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  return { iv, ciphertext: new Uint8Array(ciphertext) }
}

export async function decryptVaultData(key: CryptoKey, record: EncryptedVaultRecord): Promise<VaultData> {
  assertCryptoAvailable()
  const iv = base64ToBytes(record.cipher.ivB64)
  const ciphertext = base64ToBytes(record.ciphertextB64)
  const plaintextBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  const decoded = bytesToText(new Uint8Array(plaintextBuffer))
  const parsed = JSON.parse(decoded) as unknown
  if (!parsed || typeof parsed !== 'object') throw new Error('Vault payload is invalid')
  const data = parsed as VaultData
  if (data.version !== 1 || !Array.isArray(data.items)) throw new Error('Vault payload has an unsupported version')
  return data
}

export function newSalt() {
  assertCryptoAvailable()
  return window.crypto.getRandomValues(new Uint8Array(16))
}

export function newVaultRecord(params: {
  salt: Uint8Array
  iv: Uint8Array
  ciphertext: Uint8Array
  createdAt: string
  updatedAt: string
  iterations?: number
}): EncryptedVaultRecord {
  return {
    version: 1,
    createdAt: params.createdAt,
    updatedAt: params.updatedAt,
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: params.iterations ?? PBKDF2_ITERATIONS,
      saltB64: bytesToBase64(params.salt),
    },
    cipher: {
      name: 'AES-GCM',
      ivB64: bytesToBase64(params.iv),
    },
    ciphertextB64: bytesToBase64(params.ciphertext),
  }
}
