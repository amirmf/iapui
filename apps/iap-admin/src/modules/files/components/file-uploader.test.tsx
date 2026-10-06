import { FileUploader } from '@modules/files/components/file-uploader'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const notifications = vi.hoisted(() => ({ error: vi.fn() }))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({ toast: notifications }))

function fileWithHeader(name: string, bytes: number[]) {
  const file = new File([new Uint8Array(bytes)], name)
  file.slice = () =>
    ({ arrayBuffer: async () => new Uint8Array(bytes).buffer }) as Blob
  return file
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('reference immediate invoice uploader', () => {
  it('validates actual bytes and invokes the custom invoice upload without a second submit button', async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined)
    const onUploadingChange = vi.fn()
    const { container } = render(
      <FileUploader
        maxFiles={1}
        onChange={vi.fn()}
        onUpload={onUpload}
        onUploadingChange={onUploadingChange}
      />
    )
    const file = fileWithHeader('scan.pdf', [0x25, 0x50, 0x44, 0x46, 0x2d])
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [file] },
    })
    await waitFor(() => expect(onUpload).toHaveBeenCalledOnce())
    expect(onUpload.mock.calls[0][0]).toBe(file)
    expect(onUpload.mock.calls[0][1].onProgress).toBeTypeOf('function')
    await waitFor(() =>
      expect(onUploadingChange).toHaveBeenLastCalledWith(false)
    )
    expect(onUploadingChange).toHaveBeenNthCalledWith(1, true)
  })

  it('rejects misleading extension and leaves upload untouched', async () => {
    const onUpload = vi.fn()
    const { container } = render(
      <FileUploader maxFiles={1} onChange={vi.fn()} onUpload={onUpload} />
    )
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [fileWithHeader('scan.pdf', [0, 1, 2])] },
    })
    await waitFor(() =>
      expect(notifications.error).toHaveBeenCalledWith(
        'common.fileUploader.onlyAllowed'
      )
    )
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('retains source failed entry and reports upload error for rejected custom upload', async () => {
    const onUpload = vi.fn().mockRejectedValue(new Error('offline'))
    const { container } = render(
      <FileUploader maxFiles={1} onChange={vi.fn()} onUpload={onUpload} />
    )
    fireEvent.change(container.querySelector('input')!, {
      target: { files: [fileWithHeader('scan.jpg', [0xff, 0xd8, 0xff])] },
    })
    await waitFor(() =>
      expect(screen.getByText('common.fileUploader.failed')).toBeTruthy()
    )
    expect(notifications.error).toHaveBeenCalledWith(
      'common.fileUploader.uploadFailed'
    )
  })
})
