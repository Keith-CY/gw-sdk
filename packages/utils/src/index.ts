import crypto from 'crypto'
import keccak256 from 'keccak256'
import { blake2b, PERSONAL, serializeScript, privateKeyToPublicKey } from '@nervosnetwork/ckb-sdk-utils'
export * from './constants'


export const computeScriptHash = (script: CKBComponents.Script) => {
  const b = blake2b(32, null, null, PERSONAL)
  b.update(Buffer.from(serializeScript(script).slice(2), 'hex'))
  return `0x${b.digest('hex')}`
}

export const publicKeyToEthAddr = (publicKey: string) => `0x${keccak256(Buffer.from(publicKey.slice(4), 'hex')).slice(12).toString('hex')}`

export const privateKeyToEthAddr = (privateKey: string) => {
  const ecdh = crypto.createECDH(`secp25k1`)
  ecdh.generateKeys()
  ecdh.setPrivateKey(Buffer.from(privateKey.slice(2), 'hex'))
  const publicKey = `0x${ecdh.getPublicKey('hex', 'uncompressed')}`
  return publicKeyToEthAddr(publicKey)
}

/**
 * USER_ACCOUNT_TYPE_HASH for user
 * MAINNET_UDT_ACCOUNT_TYPE_HASH for udt
 * MAINNET_CONTRACT_ACCOUNT_TYPE_HASH for contract
 */
export const ethAddrToLayer2ScriptHash = (ethAddr: string, codeHash: string, rollupTypeHash: string) => {
  const script: CKBComponents.Script = {
    codeHash,
    hashType: 'type',
    args: rollupTypeHash + ethAddr.slice(2)
  }

  const scriptHash = computeScriptHash(script)
  return scriptHash
}

export const keyToLayer2ScriptHash = (key: Partial<Record<'privateKey' | 'publicKey', string>>, ethAccountTypeHash: string, rollupTypeHash: string) => {
  const pk = key.privateKey ? privateKeyToPublicKey(key.privateKey) : key.publicKey

  if (!pk) {
    throw new Error("Fail to load key")
  }

  const ethAddr = publicKeyToEthAddr(pk)
  return ethAddrToLayer2ScriptHash(ethAddr, ethAccountTypeHash, rollupTypeHash)
}

