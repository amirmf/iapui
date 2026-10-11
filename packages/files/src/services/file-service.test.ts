import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fileService } from './file-service'

const transport = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('@iap/api-client', () => ({ getApiClient: () => transport }))

const attachment = {
  filename: 'scan.pdf',
  fileType: 'application/pdf',
  fileSize: 3,
  uploadDate: '2026-10-06',
  minioObjectName: 'scan',
  bucketName: 'invoices',
}

beforeEach(() => vi.clearAllMocks())

describe('reference file transport', () => {
  it('downloads using the encoded attachment identifier, blob response, abort and progress', async () => {
    const blob = new Blob(['pdf'])
    transport.get.mockResolvedValue({ data: blob })
    const signal = new AbortController().signal
    const onProgress = vi.fn()
    expect(await fileService.download('id /?#', { signal, onProgress })).toBe(
      blob
    )
    const [path, options] = transport.get.mock.calls[0]!
    expect(path).toBe('/files/download/attachment/id%20%2F%3F%23')
    expect(options.responseType).toBe('blob')
    expect(options.signal).toBe(signal)
    options.onDownloadProgress({ loaded: 15, total: 10 })
    expect(onProgress).toHaveBeenLastCalledWith(100)
    options.onDownloadProgress({ loaded: 5 })
    expect(onProgress).toHaveBeenLastCalledWith(0)
  })

  it('posts a file using the exact multipart field and validates the attachment response', async () => {
    transport.post.mockResolvedValue({ data: attachment })
    const file = new File(['pdf'], 'scan.pdf')
    expect(await fileService.upload(file)).toEqual(attachment)
    const [path, body, options] = transport.post.mock.calls[0]!
    expect(path).toBe('/files/upload')
    expect(body.get('file')).toEqual(file)
    expect(options.headers).toEqual({ 'Content-Type': 'multipart/form-data' })
    transport.post.mockResolvedValue({ data: { filename: 'bad' } })
    await expect(fileService.upload(file)).rejects.toThrow()
  })
})
