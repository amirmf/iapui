import { type ReactNode } from 'react'

import { MedicalCenterInvoiceDeleteDialog } from '@features/medical-center/components/medical-center-invoice-delete-dialog'
import { MedicalCenterInvoiceDetailDialog } from '@features/medical-center/components/medical-center-invoice-detail-dialog'
import { MedicalCenterInvoiceUploadDialog } from '@features/medical-center/components/medical-center-invoice-upload-dialog'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  activeDialog: 'view',
  selectedInvoice: { id: 'invoice-1', documentNumber: '42' },
  closeDialog: vi.fn(),
  data: { documentNumber: '42', records: [], invoiceFile: undefined } as Record<
    string,
    unknown
  >,
  pending: false,
  mutateAsync: vi.fn(),
  mutate: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock('sonner', () => ({
  toast: { success: state.success, error: state.error },
}))
vi.mock(
  '@features/medical-center/context/store/medical-center-invoice-dialog-store',
  () => ({
    useMedicalCenterInvoiceDialog: (
      selector: (store: typeof state) => unknown
    ) => selector(state),
  })
)
vi.mock(
  '@features/medical-center/queries/medical-center-invoice-query',
  () => ({
    useMedicalCenterInvoice: () => ({
      data: state.data,
      isLoading: false,
      isError: false,
    }),
    useCreateMedicalCenterInvoice: () => ({
      isPending: state.pending,
      mutateAsync: state.mutateAsync,
    }),
    useDeleteMedicalCenterInvoice: () => ({
      isPending: state.pending,
      mutate: state.mutate,
    }),
  })
)
vi.mock('@iap/ui', () => {
  const Wrapper = (props: { children: ReactNode }) => (
    <div>{props.children}</div>
  )
  return {
    cn: (...classes: Array<string | undefined>) =>
      classes.filter(Boolean).join(' '),
    Dialog: Wrapper,
    DialogContent: Wrapper,
    DialogHeader: Wrapper,
    DialogFooter: Wrapper,
    DialogTitle: Wrapper,
    Separator: () => <hr />,
    Button: (props: {
      children: ReactNode
      disabled?: boolean
      onClick?: () => void
    }) => (
      <button disabled={props.disabled} onClick={props.onClick}>
        {props.children}
      </button>
    ),
  }
})
vi.mock('@iap/dialogs', () => ({
  ConfirmDialog: (props: { open: boolean; onConfirm: () => void }) =>
    props.open ? (
      <button onClick={props.onConfirm}>confirm-delete</button>
    ) : null,
}))
vi.mock('@modules/files', () => ({
  FileUploader: (props: {
    onUpload: (file: File, options: object) => Promise<void>
    maxFiles: number
  }) => (
    <button
      onClick={() => void props.onUpload(new File(['pdf'], 'invoice.pdf'), {})}
    >
      upload-{props.maxFiles}
    </button>
  ),
  FileViewer: (props: {
    attachments: unknown[]
    transformComponentWrapperStyle: { height: string }
  }) => <div data-testid='viewer'>{JSON.stringify(props)}</div>,
}))

afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  state.activeDialog = 'view'
  state.pending = false
  state.data = { documentNumber: '42', records: [] }
})

describe('reference medical-center dialogs', () => {
  it('uploads immediately through FileUploader and closes after successful asynchronous mutation', async () => {
    const close = vi.fn()
    state.mutateAsync.mockResolvedValue(undefined)
    render(<MedicalCenterInvoiceUploadDialog open onOpenChange={close} />)
    fireEvent.click(screen.getByText('upload-1'))
    await waitFor(() => expect(close).toHaveBeenCalledWith(false))
    expect(state.mutateAsync.mock.calls[0][0].input.file.name).toBe(
      'invoice.pdf'
    )
    expect(state.success).toHaveBeenCalledWith('medicalCenter.messages.created')
    expect(screen.queryByText('medicalCenter.actions.upload')).toBeNull()
  })

  it('mounts FileViewer only for complete source file metadata and maps exact attachment fields', () => {
    const { rerender } = render(<MedicalCenterInvoiceDetailDialog />)
    expect(screen.queryByTestId('viewer')).toBeNull()
    state.data.invoiceFile = {
      id: 'file-1',
      filename: 'invoice.pdf',
      contentType: 'application/pdf',
      size: 0,
      uploadedAt: 'date',
      objectName: 'object',
      bucketName: 'bucket',
    }
    rerender(<MedicalCenterInvoiceDetailDialog />)
    const props = JSON.parse(screen.getByTestId('viewer').textContent ?? '{}')
    expect(props.attachments).toEqual([
      {
        id: 'file-1',
        filename: 'invoice.pdf',
        fileType: 'application/pdf',
        fileSize: 0,
        uploadDate: 'date',
        minioObjectName: 'object',
        bucketName: 'bucket',
      },
    ])
    expect(props.transformComponentWrapperStyle).toEqual({ height: '30vh' })
  })

  it('blocks repeated pending deletion and keeps error confirmation open', () => {
    state.activeDialog = 'delete'
    state.pending = true
    const { rerender } = render(<MedicalCenterInvoiceDeleteDialog />)
    fireEvent.click(screen.getByText('confirm-delete'))
    expect(state.mutate).not.toHaveBeenCalled()
    state.pending = false
    rerender(<MedicalCenterInvoiceDeleteDialog />)
    fireEvent.click(screen.getByText('confirm-delete'))
    const [id, handlers] = state.mutate.mock.calls[0]
    expect(id).toBe('invoice-1')
    handlers.onError()
    expect(state.closeDialog).not.toHaveBeenCalled()
    expect(state.error).toHaveBeenCalledWith(
      'medicalCenter.messages.deleteError'
    )
    handlers.onSuccess()
    expect(state.closeDialog).toHaveBeenCalledOnce()
  })
})
