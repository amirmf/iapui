import { agreementStatusClasses } from '@features/agreements/constants/agreement-status-options'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  cn,
  formatDateTime,
} from '@iap/ui'
import { ReadonlyItems } from '@shared/components/readonly-items'
import { useTranslate } from '@shared/i18n/i18n'

export function AgreementViewDialog() {
  const { t } = useTranslate()
  const row = useAgreementStore((state) => state.currentRow)
  const openDialog = useAgreementStore((state) => state.openDialog)
  const setCurrentRow = useAgreementStore((state) => state.setCurrentRow)
  const setOpenDialog = useAgreementStore((state) => state.setOpenDialog)
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
  }

  return (
    <Dialog open={openDialog === 'view'} onOpenChange={close}>
      <DialogContent presentation='reference' className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('agreements.dialog.details')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold'>{row?.title}</h2>
              <Badge
                className={cn(
                  row?.status && agreementStatusClasses[row.status]
                )}
                variant='outline'
              >
                {t(`agreements.status.${row?.status?.toLowerCase()}` as never)}
              </Badge>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <ReadonlyItems
                title={t('agreements.columns.code')}
                value={row?.code}
              />
              <ReadonlyItems
                title={t('agreements.columns.overrideRatio')}
                value={row?.overrideRatio ?? '-'}
              />
              <ReadonlyItems
                title={t('agreements.columns.extLocation')}
                value={row?.extLocation || '-'}
              />
              <ReadonlyItems
                title={t('agreements.columns.fromDate')}
                value={formatDateTime(
                  row?.fromDate ? new Date(row.fromDate) : null,
                  'PPpp'
                )}
              />
              <ReadonlyItems
                title={t('agreements.columns.thruDate')}
                value={formatDateTime(
                  row?.thruDate ? new Date(row.thruDate) : null,
                  'PPpp'
                )}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
