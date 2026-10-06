export async function isHeic(blob: Blob) {
  const fileType = await detectFileTypeByHex(blob)
  return fileType === 'heic' || fileType === 'heif'
}

const PNG_SIGNATURE = ['89', '50', '4e', '47', '0d', '0a', '1a', '0a']
const JPEG_SIGNATURE = ['ff', 'd8', 'ff']
const PDF_SIGNATURE = ['25', '50', '44', '46', '2d']
const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx'])
const HEIF_BRANDS = new Set(['mif1', 'msf1', 'heif'])

export async function fileHeaderToHex(blob: Blob, byteLength: number) {
  const headerBuffer = await blob.slice(0, byteLength).arrayBuffer()
  return Array.from(new Uint8Array(headerBuffer)).map((byte) =>
    byte.toString(16).padStart(2, '0')
  )
}

export async function detectFileTypeByHex(blob: Blob) {
  const headerHex = await fileHeaderToHex(blob, 32)
  if (headerHex.length >= PNG_SIGNATURE.length) {
    const hasPngSignature = PNG_SIGNATURE.every(
      (hex, index) => headerHex[index] === hex
    )
    if (hasPngSignature) return 'png'
  }

  if (headerHex.length >= JPEG_SIGNATURE.length) {
    const hasJpegSignature = JPEG_SIGNATURE.every(
      (hex, index) => headerHex[index] === hex
    )
    if (hasJpegSignature) return 'jpeg'
  }

  if (headerHex.length >= PDF_SIGNATURE.length) {
    const hasPdfSignature = PDF_SIGNATURE.every(
      (hex, index) => headerHex[index] === hex
    )
    if (hasPdfSignature) return 'pdf'
  }

  if (headerHex.length >= 12) {
    const brandMarker = headerHex
      .slice(4, 8)
      .map((hex) => String.fromCharCode(Number.parseInt(hex, 16)))
      .join('')
      .toLowerCase()
    const brand = headerHex
      .slice(8, 12)
      .map((hex) => String.fromCharCode(Number.parseInt(hex, 16)))
      .join('')
      .toLowerCase()

    if (brandMarker === 'ftyp') {
      if (HEIC_BRANDS.has(brand)) return 'heic'
      if (HEIF_BRANDS.has(brand)) return 'heif'
    }
  }

  return null
}

export const EXTENSION_TO_FILE_MIME: Record<string, string> = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  png: 'image/png',
  webp: 'image/webp',
  bmp: 'image/bmp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  pdf: 'application/pdf',
}

export const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/gif',
  'image/svg+xml',
  'image/tiff',
])

export const FILE_MIME_TYPES = new Set(['application/pdf'])
