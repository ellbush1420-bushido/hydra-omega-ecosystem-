export type VaultItem = {
  id: string
  label: string
  value: string
  updatedAt: string
}

export type VaultData = {
  version: 1
  items: VaultItem[]
}

export type EncryptedVaultRecord = {
  version: 1
  createdAt: string
  updatedAt: string
  kdf: {
    name: 'PBKDF2'
    hash: 'SHA-256'
    iterations: number
    saltB64: string
  }
  cipher: {
    name: 'AES-GCM'
    ivB64: string
  }
  ciphertextB64: string
}

