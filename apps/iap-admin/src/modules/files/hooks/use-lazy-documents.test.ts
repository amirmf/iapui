import { useLazyDocuments } from '@modules/files/hooks/use-lazy-documents'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const download = vi.hoisted(() => vi.fn())
vi.mock('@modules/files/services/file-service', () => ({
  default: { download },
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const attachments = [
  {
    id: 'attachment-1',
    filename: 'scan.pdf',
    fileType: 'application/pdf',
    fileSize: 5,
    uploadDate: 'date',
    minioObjectName: 'object',
    bucketName: 'bucket',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:scan'),
    revokeObjectURL: vi.fn(),
  })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function pdfBlob(): Blob {
  const blob = new Blob(['%PDF-'])
  blob.slice = () =>
    ({
      arrayBuffer: async () =>
        new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]).buffer,
    }) as Blob
  return blob
}

describe('reference lazy attachment lifecycle', () => {
  it('downloads lazily, creates a PDF object URL, and releases it on unmount', async () => {
    download.mockResolvedValue(pdfBlob())
    const { result, unmount } = renderHook(() =>
      useLazyDocuments({ attachments })
    )
    await waitFor(() =>
      expect(result.current.activeDocEntry?.status).toBe('loaded')
    )
    expect(download.mock.calls[0][0]).toBe('attachment-1')
    expect(result.current.activeDoc).toEqual({
      uri: 'blob:scan',
      fileType: 'application/pdf',
      fileName: 'scan.pdf',
    })
    unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:scan')
  })

  it('does not retry errors automatically and permits source explicit force retry', async () => {
    download
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(pdfBlob())
    const { result } = renderHook(() => useLazyDocuments({ attachments }))
    await waitFor(() =>
      expect(result.current.activeDocEntry?.status).toBe('error')
    )
    expect(result.current.activeDocEntry?.error).toBe('offline')
    expect(download).toHaveBeenCalledOnce()
    await act(async () => {
      await result.current.ensureDocument(0, { force: true })
    })
    await waitFor(() =>
      expect(result.current.activeDocEntry?.status).toBe('loaded')
    )
    expect(download).toHaveBeenCalledTimes(2)
  })

  it('aborts pending downloads on unmount and ignores the late download response', async () => {
    let resolve: (blob: Blob) => void = () => undefined
    download.mockReturnValue(
      new Promise<Blob>((done) => {
        resolve = done
      })
    )
    const { unmount } = renderHook(() => useLazyDocuments({ attachments }))
    await waitFor(() => expect(download).toHaveBeenCalledOnce())
    const signal = download.mock.calls[0][1].signal as AbortSignal
    unmount()
    expect(signal.aborted).toBe(true)
    await act(async () => {
      resolve(pdfBlob())
    })
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })
})
