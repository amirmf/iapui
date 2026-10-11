const HEIC_CONVERSION_QUALITY = 1

export async function convertHeicToJpeg(blob: Blob): Promise<Blob> {
  const { heicTo } = await import('heic-to')

  return heicTo({
    blob,
    type: 'image/jpeg',
    quality: HEIC_CONVERSION_QUALITY,
  })
}
