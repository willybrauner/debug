/**
 * Check if is browser env
 */
export const isBrowser: boolean = !!(typeof window != "undefined" && window.document)

/**
 * Transform string to RGB
 * @param str
 */
export function stringToRgb(str: string):[number, number, number] {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    let character = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + character
    hash = Math.abs(hash & hash)
  }
  const r = (hash & 0xFF0000) >> 16
  const g = (hash & 0x00FF00) >> 8
  const b = hash & 0x0000FF
  return [r, g, b]
}
