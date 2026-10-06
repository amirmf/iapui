import { AssessmentPromptEnumBadge } from '@features/assessment-prompts/components/assessment-prompt-enum-badge'
import {
  ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS,
  ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS,
  ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS,
} from '@features/assessment-prompts/constants/assessment-prompts-constant'
import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { formatDateTime } from '@shared/lib/format-date'

export function AssessmentPromptViewDialog() {
  const { t } = useTranslate()
  const row = useAssessmentPrompt((s) => s.currentRow)
  const open = useAssessmentPrompt((s) => s.open)
  const setOpen = useAssessmentPrompt((s) => s.setOpen)
  if (!row) return null
  const item = (
    label: string,
    value: string | null | undefined,
    agreement = false
  ) => (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className={cn('font-medium', agreement && 'break-all')}>
        {value ?? t('common.notAvailable')}
      </p>
    </div>
  )
  return (
    <Dialog
      onOpenChange={(next) => !next && setOpen(null)}
      open={open === 'view'}
    >
      <DialogContent className='sm:max-w-lg' presentation='reference'>
        <DialogHeader presentation='reference'>
          <DialogTitle presentation='reference'>
            {t('assessmentPrompts.dialog.details')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold'>
              {row.title ?? t('common.notAvailable')}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {row.prompt ?? t('common.notAvailable')}
            </p>
          </div>
          <AssessmentPromptEnumBadge
            presentation='view'
            value={row.status}
            translationKey={
              row.status
                ? ASSESSMENT_PROMPT_STATUS_TRANSLATION_KEYS[row.status]
                : undefined
            }
          />
          {row.placeType ? (
            <AssessmentPromptEnumBadge
              presentation='view'
              value={row.placeType}
              translationKey={
                ASSESSMENT_PROMPT_PLACE_TYPE_TRANSLATION_KEYS[row.placeType]
              }
            />
          ) : null}
          {item(
            t('assessmentPrompts.dialog.fields.agreement'),
            row.agreementId,
            true
          )}
          <div className='grid grid-cols-2 gap-4'>
            {item(
              t('assessmentPrompts.dialog.fields.docType'),
              row.docTypeCode
            )}
            {item(
              t('assessmentPrompts.dialog.fields.ruleState'),
              row.ruleState
                ? t(
                    ASSESSMENT_PROMPT_RULE_STATE_TRANSLATION_KEYS[
                      row.ruleState
                    ] as never
                  )
                : undefined
            )}
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {item(
              t('assessmentPrompts.dialog.fields.fromDate'),
              formatDateTime(row.fromDate)
            )}
            {item(
              t('assessmentPrompts.dialog.fields.thruDate'),
              formatDateTime(row.thruDate)
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
