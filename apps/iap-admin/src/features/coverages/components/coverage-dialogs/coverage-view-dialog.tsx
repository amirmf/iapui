import {
  coverageStatusTranslationKeys,
  coverageTypeTranslationKeys,
} from '@features/coverages/constants/coverage-constant'
import { useCoverageStore } from '@features/coverages/model/store/coverage-store'
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  formatDateTime,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

const coverageTypeColors = {
  DETAIL:
    'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200',
  GROUP: 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
}

const statusColors = {
  ACTIVE:
    'bg-emerald-100/30 text-emerald-900 dark:text-emerald-200 border-emerald-200',
  INACTIVE: 'bg-gray-100/30 text-gray-900 dark:text-gray-200 border-gray-200',
  PENDING:
    'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200',
  SUSPENDED: 'bg-red-100/30 text-red-900 dark:text-red-200 border-red-200',
} as const

export function CoverageViewDialog() {
  const { t } = useTranslate()
  const coverage = useCoverageStore((state) => state.currentRow)
  const openDialog = useCoverageStore((state) => state.openDialog)
  const setCurrentRow = useCoverageStore((state) => state.setCurrentRow)
  const setOpenDialog = useCoverageStore((state) => state.setOpenDialog)
  if (!coverage) return null
  return (
    <Dialog
      open={openDialog === 'view'}
      onOpenChange={(open) => {
        if (!open) {
          setOpenDialog(null)
          setTimeout(() => setCurrentRow(null), 500)
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('coverages.dialog.viewDetails')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold'>{coverage.title}</h2>
            <p className='font-mono text-sm text-muted-foreground'>
              {coverage.code}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {coverage.coverageType ? (
              <Badge
                className={coverageTypeColors[coverage.coverageType]}
                variant='outline'
              >
                {t(coverageTypeTranslationKeys[coverage.coverageType] as never)}
              </Badge>
            ) : null}
            {coverage.status ? (
              <Badge
                className={statusColors[coverage.status]}
                variant='outline'
              >
                {t(coverageStatusTranslationKeys[coverage.status] as never)}
              </Badge>
            ) : null}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Detail
              label={t('coverages.columns.maxCoverage')}
              value={coverage.maximumCoverage ?? '-'}
            />
            <Detail
              label={t('coverages.dialog.fields.rootCoverageId')}
              value={coverage.rootCoverageId ?? '-'}
            />
            <Detail
              label={t('coverages.columns.fromDate')}
              value={formatDateTime(coverage.fromDate)}
            />
            <Detail
              label={t('coverages.columns.thruDate')}
              value={formatDateTime(coverage.thruDate)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
function Detail(props: { label: string; value: string | number }) {
  const { label, value } = props
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='font-medium'>{value}</p>
    </div>
  )
}
