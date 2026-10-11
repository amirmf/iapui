import { describe, expect, it } from 'vitest'

import { detectFileTypeByHex, isHeic } from './file-types'

function headerBlob(bytes: number[]): Blob {
  return {
    slice: () => ({ arrayBuffer: async () => new Uint8Array(bytes).buffer }),
  } as unknown as Blob
}

describe('reference file signature detection', () => {
  it('accepts actual PNG, JPEG and PDF headers rather than filenames', async () => {
    expect(
      await detectFileTypeByHex(
        headerBlob([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10])
      )
    ).toBe('png')
    expect(await detectFileTypeByHex(headerBlob([0xff, 0xd8, 0xff]))).toBe(
      'jpeg'
    )
    expect(
      await detectFileTypeByHex(headerBlob([0x25, 0x50, 0x44, 0x46, 0x2d]))
    ).toBe('pdf')
    expect(await detectFileTypeByHex(headerBlob([0, 1, 2]))).toBeNull()
  })

  it('identifies the source HEIC and HEIF container brands', async () => {
    const bytes = [
      0,
      0,
      0,
      0,
      ...Array.from('ftypheic', (char) => char.charCodeAt(0)),
    ]
    expect(await isHeic(headerBlob(bytes))).toBe(true)
    bytes.splice(8, 4, ...Array.from('mif1', (char) => char.charCodeAt(0)))
    expect(await detectFileTypeByHex(headerBlob(bytes))).toBe('heif')
  })
})
