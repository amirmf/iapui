import type { AgreementCoverageApplFull } from '@iap/api-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  formatDateTime,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  appl: AgreementCoverageApplFull
}

export function AgreementCoverageApplViewDialog(props: Props) {
  const { open, onOpenChange, appl } = props
  const { t } = useTranslate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation='reference' className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>{t('agreementCoverageAppls.view.title')}</DialogTitle>
          <DialogDescription>
            {t('agreementCoverageAppls.view.description')}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-3 text-sm'>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.agreementTitle')}:
            </span>{' '}
            {appl.agreement?.title ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.agreementCode')}:
            </span>{' '}
            {appl.agreement?.code ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.extPolicyId')}:
            </span>{' '}
            {appl.agreement?.extPolicyId ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.coverageTitle')}:
            </span>{' '}
            {appl.coverageDetail?.title ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.damageTitle')}:
            </span>{' '}
            {appl.damageCode?.title ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.damageCode')}:
            </span>{' '}
            {appl.damageCode?.code ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.overrideRatio')}:
            </span>{' '}
            {appl.overrideRatio ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.franchisePercentage')}:
            </span>{' '}
            {appl.franchisePercentage ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.form.coverageAmount')}:
            </span>{' '}
            {appl.coverageAmount ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.form.amountPerCase')}:
            </span>{' '}
            {appl.amountPerCase ?? '-'}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.fromDate')}:
            </span>{' '}
            {formatDateTime(
              appl.fromDate ? new Date(appl.fromDate) : null,
              'PPpp'
            )}
          </div>
          <div>
            <span className='font-medium'>
              {t('agreementCoverageAppls.columns.thruDate')}:
            </span>{' '}
            {formatDateTime(
              appl.thruDate ? new Date(appl.thruDate) : null,
              'PPpp'
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            presentation='reference'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            {'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
