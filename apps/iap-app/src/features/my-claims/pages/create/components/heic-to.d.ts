declare module 'heic-to' {
  export function heicTo(options: {
    blob: Blob
    type: 'image/jpeg'
    quality: number
  }): Promise<Blob>
}
