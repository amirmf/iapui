import { useEffect, useState } from 'react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@features/assessment-items/components/assessment-alert'
import { PreAuthInquiryCard } from '@features/assessment-items/components/pre-auth-inquiry-card'
import { Pagination } from '@features/assessment-items/components/pre-auth-pagination'
import { useAssessmentItemDialog } from '@features/assessment-items/context/store/assessment-item-dialog-store'
import { usePreAuthInquiries } from '@features/assessment-items/queries/use-pre-auth-inquiries'
import { ConfirmDialog } from '@iap/dialogs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface PreAuthInquiriesDialogProps {
  policyId?: number | null
  nationalCode?: string | null
  displayName?: string | null
}

const PAGE_SIZE = 20

export function PreAuthInquiriesDialog(props: PreAuthInquiriesDialogProps) {
  const { policyId, nationalCode, displayName } = props
  const { t } = useTranslate()
  const { activeDialog, setActiveDialog } = useAssessmentItemDialog()
  const open = activeDialog === 'pre-auth-inquiries'
  const [page, setPage] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const request =
    open && policyId != null && nationalCode
      ? { policyId, nationalCode, page, size: PAGE_SIZE }
      : null
  const { data, error, isError, isLoading, isFetching } =
    usePreAuthInquiries(request)
  const preAuths = data?.content ?? []
  const hasNextPage = preAuths.length === PAGE_SIZE

  useEffect(() => {
    if (
      open &&
      page > 0 &&
      data &&
      preAuths.length === 0 &&
      !isLoading &&
      !isFetching
    ) {
      setConfirmOpen(true)
    }
  }, [data, isFetching, isLoading, open, page, preAuths.length])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setPage(0)
          setConfirmOpen(false)
        }
        setActiveDialog(nextOpen ? 'pre-auth-inquiries' : null)
      }}
    >
      <DialogContent
        presentation='reference'
        className='max-h-[90vh] overflow-y-auto sm:max-w-5xl'
      >
        <DialogHeader>
          <DialogTitle>{t('assessmentItems.preAuths.title')}</DialogTitle>
          <DialogDescription>
            {t('assessmentItems.preAuths.description', { displayName })}
          </DialogDescription>
        </DialogHeader>

        {isError ? (
          <Alert variant='destructive'>
            <AlertTitle>{t('errors.general.heading')}</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t('errors.general.description')}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className='py-12 text-center text-sm text-muted-foreground'>
            {t('common.loading')}
          </div>
        ) : preAuths.length > 0 ? (
          <div className='space-y-4'>
            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              onPageChange={setPage}
              isLoading={isFetching}
              countTranslationKey='assessmentItems.preAuths.pagination'
              className='border-b pb-4'
            />
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {preAuths.map((preAuth, index) => (
                <PreAuthInquiryCard
                  key={preAuth.id ?? `pre-auth-${index}`}
                  preAuth={preAuth}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              hasNextPage={hasNextPage}
              onPageChange={setPage}
              isLoading={isFetching}
              countTranslationKey='assessmentItems.preAuths.pagination'
              className='border-t pt-4'
            />
          </div>
        ) : (
          <div className='py-12 text-center text-sm text-muted-foreground'>
            {t('assessmentItems.preAuths.empty')}
          </div>
        )}
        <ConfirmDialog
          presentation='reference'
          hideCancelButton
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={() => {
            setPage((currentPage) => Math.max(0, currentPage - 1))
            setConfirmOpen(false)
          }}
          title={t('assessmentItems.preAuths.endOfListDialog.title')}
          description={t('assessmentItems.preAuths.endOfListDialog.desc')}
        />
      </DialogContent>
    </Dialog>
  )
}
