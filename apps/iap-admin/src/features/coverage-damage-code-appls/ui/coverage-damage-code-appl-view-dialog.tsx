import { useCoverageDamageCodeApplStore } from '@features/coverage-damage-code-appls/model/coverage-damage-code-appl-store'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

export function CoverageDamageCodeApplViewDialog() {
  const { t } = useTranslate()
  const appl = useCoverageDamageCodeApplStore((state) => state.currentRow)
  const openDialog = useCoverageDamageCodeApplStore((state) => state.openDialog)
  const setCurrentRow = useCoverageDamageCodeApplStore(
    (state) => state.setCurrentRow
  )
  const setOpenDialog = useCoverageDamageCodeApplStore(
    (state) => state.setOpenDialog
  )
  if (!appl) return null
  const close = () => {
    setOpenDialog(null)
    setCurrentRow(null)
  }
  return (
    <Dialog
      open={openDialog === 'view'}
      onOpenChange={(open) => !open && close()}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('coverageDamageCodeAppls.view.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-2'>
          <Detail
            label={t('coverageDamageCodeAppls.columns.coverageTitle')}
            value={appl.coverageDetail?.title}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.coverageCode')}
            value={appl.coverageDetail?.code}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.damageTitle')}
            value={appl.damageCode?.title}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.damageCode')}
            value={appl.damageCode?.code}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.priority')}
            value={appl.priority}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.status')}
            value={appl.status}
          />
          <Detail
            label={t('coverageDamageCodeAppls.columns.ratio')}
            value={appl.ratio}
          />
        </div>
        <DialogFooter>
          <Button onClick={close} variant='outline'>
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function Detail(props: {
  label: string
  value: string | number | null | undefined
}) {
  const { label, value } = props
  return (
    <div>
      <span className='font-medium'>{label}: </span>
      {value ?? '-'}
    </div>
  )
}
