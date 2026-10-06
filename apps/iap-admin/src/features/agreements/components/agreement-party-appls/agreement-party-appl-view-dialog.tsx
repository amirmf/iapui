import { type ReactNode, useCallback } from 'react'

import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { formatLocalDateTime } from '@iap/shared-lib'
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

function Detail(props: { label: string; value: ReactNode }) {
  const { label, value } = props
  return (
    <div className='flex flex-col gap-1'>
      <p className='font-semibold'>{label}</p>
      <p>{value || '-'}</p>
    </div>
  )
}

export function AgreementPartyApplViewDialog() {
  const { t } = useTranslate()
  const currentRow = useAgreementPartyApplStore((state) => state.currentRow)
  const openDialog = useAgreementPartyApplStore((state) => state.openDialog)
  const setCurrentRow = useAgreementPartyApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const close = useCallback(() => {
    setOpenDialog(null)
    setCurrentRow(null)
  }, [setCurrentRow, setOpenDialog])
  return (
    <Dialog
      onOpenChange={(open) => !open && close()}
      open={openDialog === 'view'}
    >
      <DialogContent presentation='reference'>
        <DialogHeader>
          <DialogTitle>{t('agreements.partyAppls.title' as never)}</DialogTitle>
        </DialogHeader>
        <div className='space-y-3 text-sm'>
          <Detail
            label={t('agreements.partyAppls.user' as never)}
            value={
              currentRow?.userAccount?.displayName ||
              currentRow?.userAccount?.username ||
              currentRow?.userAccountId
            }
          />
          <div className='grid gap-3 sm:grid-cols-2'>
            <Detail
              label={t('agreements.partyAppls.relationshipType' as never)}
              value={currentRow?.relationshipType}
            />
            <Detail
              label={t('agreements.partyAppls.role' as never)}
              value={currentRow?.role}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <p className='font-semibold'>
              {t('agreements.partyAppls.docTypes' as never)}
            </p>
            {currentRow?.docTypeCodes?.length ? (
              <div className='flex flex-wrap gap-1'>
                {currentRow.docTypeCodes.map((code) => (
                  <Badge
                    presentation='reference'
                    key={code}
                    variant='secondary'
                  >
                    {code}
                  </Badge>
                ))}
              </div>
            ) : (
              <p>-</p>
            )}
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <Detail
              label={t('agreements.partyAppls.fromDate' as never)}
              value={formatLocalDateTime(currentRow?.fromDate)}
            />
            <Detail
              label={t('agreements.partyAppls.thruDate' as never)}
              value={formatLocalDateTime(currentRow?.thruDate)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
