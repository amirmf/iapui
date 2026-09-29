import type { AdminDocType } from '@iap/api-types'
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

function JsonValue(props: { value: string | null | undefined }) {
  const { value } = props
  const { t } = useTranslation()
  if (!value) return <>{t('common.notAvailable')}</>

  try {
    return <>{JSON.stringify(JSON.parse(value), null, 2)}</>
  } catch {
    return <>{value}</>
  }
}

type DocTypeDetailsDialogProps = {
  docType: AdminDocType
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function DocTypeDetailsDialog(props: DocTypeDetailsDialogProps) {
  const { docType, onOpenChange, open } = props
  const { t } = useTranslation()
  const fields: Array<[keyof AdminDocType, string]> = [
    ['docType', t('docTypes.dialog.fields.docType')],
    ['docTypeCode', t('docTypes.dialog.fields.docTypeCode')],
    [
      'ceilingControlDamageCode',
      t('docTypes.dialog.fields.ceilingControlDamageCode'),
    ],
    [
      'ceilingControlErrorDescription',
      t('docTypes.dialog.fields.ceilingControlErrorDescription'),
    ],
    [
      'noCoverageErrorDescription',
      t('docTypes.dialog.fields.noCoverageErrorDescription'),
    ],
    ['sequence', t('docTypes.dialog.fields.sequence')],
    ['minThreshold', t('docTypes.dialog.fields.minThreshold')],
    ['maxThreshold', t('docTypes.dialog.fields.maxThreshold')],
    ['prompt', t('docTypes.dialog.fields.prompt')],
    ['documentGuide', t('docTypes.dialog.fields.documentGuide')],
  ]

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('docTypes.dialog.details')}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className='space-y-2 p-4'>
            {fields.map(([key, label]) => (
              <div key={key}>
                <span className='font-semibold'>{label}:</span>{' '}
                {String(docType[key] ?? t('common.notAvailable'))}
              </div>
            ))}
            <JsonSection
              label={t('docTypes.dialog.fields.dataJsonSchema')}
              value={docType.dataJsonSchema}
            />
            <JsonSection
              label={t('docTypes.dialog.fields.dataSubmissionExample')}
              value={docType.dataSubmissionExample}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

type JsonSectionProps = {
  label: string
  value: string | null | undefined
}

function JsonSection(props: JsonSectionProps) {
  const { label, value } = props
  return (
    <div className='space-y-1'>
      <span className='font-semibold'>{label}:</span>
      <pre
        className='mt-1 max-h-60 w-full max-w-150 overflow-auto rounded bg-muted p-2 text-xs'
        dir='ltr'
      >
        <JsonValue value={value} />
      </pre>
    </div>
  )
}
