import {
  damageCodeStatusColors,
  damageCodeStatusTranslationKeys,
} from '@features/damage-codes/constants/damage-code-options'
import type { DamageCode, DamageCodeStatus } from '@iap/api-types'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  formatDateTime,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function DamageCodeViewDialog(props: {
  damageCode: DamageCode
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  const { damageCode, onOpenChange, open } = props
  const { t } = useTranslation()
  const status = damageCode.status as DamageCodeStatus | null | undefined
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{t('damageCodes.dialog.details')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold'>
                {damageCode.title ?? t('common.notAvailable')}
              </h2>
              <div className='mt-2 flex items-center gap-2 text-muted-foreground'>
                <span className='font-mono text-sm'>{damageCode.code}</span>
                <span className='text-xs'>•</span>
                <span className='text-sm'>{damageCode.codeType}</span>
              </div>
            </div>
            {status ? (
              <Badge
                className={damageCodeStatusColors[status]}
                variant='outline'
              >
                {t(damageCodeStatusTranslationKeys[status])}
              </Badge>
            ) : null}
          </div>
          <div className='h-px bg-border' />
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                {t('damageCodes.dialog.basicInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <Detail
                  label={t('damageCodes.columns.code')}
                  value={damageCode.code}
                />
                <Detail
                  label={t('damageCodes.columns.codeType')}
                  value={damageCode.codeType}
                />
              </div>
              <Detail
                label={t('damageCodes.columns.title')}
                value={damageCode.title}
              />
              {damageCode.description ? (
                <Detail
                  label={t('damageCodes.columns.description')}
                  value={damageCode.description}
                />
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                {t('damageCodes.dialog.dateInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2'>
                <DateDetail
                  active
                  label={t('damageCodes.columns.fromDate')}
                  value={
                    damageCode.fromDate
                      ? formatDateTime(damageCode.fromDate, 'PPpp')
                      : t('damageCodes.dialog.noStartDate')
                  }
                />
                <DateDetail
                  label={t('damageCodes.columns.thruDate')}
                  value={
                    damageCode.thruDate
                      ? formatDateTime(damageCode.thruDate, 'PPpp')
                      : t('damageCodes.dialog.noStartDate')
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DateDetail(props: { active?: boolean; label: string; value: string }) {
  const { active, label, value } = props
  return (
    <div className='rounded-lg border border-border p-3'>
      <div className='mb-2 flex items-center gap-2'>
        <div
          className={
            active
              ? 'size-2 rounded-full bg-green-500'
              : 'size-2 rounded-full bg-red-500'
          }
        />
        <span className='text-sm font-medium text-muted-foreground'>
          {label}
        </span>
      </div>
      <p className='text-sm font-medium'>{value}</p>
    </div>
  )
}
function Detail(props: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{props.label}</p>
      <p className='break-words font-medium'>{props.value ?? '-'}</p>
    </div>
  )
}
