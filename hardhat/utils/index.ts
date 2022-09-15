export * from './env'
export * from './logger'
export * from './test'

export function stripHexPrefix(hexString: string): string {
  if (hexString.length < 2) return hexString
  if (hexString.substring(0, 2) == '0x') {
    hexString = hexString.substring(2)
  }
  return hexString
}
