import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslation } from 'react-i18next'

import { useSupportQuestion } from '../../context'

export function SupportQuestionViewDialog() {
  const open = useSupportQuestion((state) => state.open)
  const setOpen = useSupportQuestion((state) => state.setOpen)
  const supportQuestion = useSupportQuestion((state) => state.currentRow)
  const setCurrentRow = useSupportQuestion((state) => state.setCurrentRow)
  const { t } = useTranslation()

  const isOpen = open === 'view'
  const close = () => {
    setOpen(null)
    setCurrentRow(null)
  }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {t('supportQuestions.dialog.details' as never)}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold'>{supportQuestion?.title}</h2>
            <p className='break-all text-sm text-muted-foreground'>
              {supportQuestion?.questionKey}
            </p>
          </div>
          <Badge variant='outline'>
            {supportQuestion?.active === false
              ? t('supportQuestions.status.inactive' as never)
              : t('supportQuestions.status.active' as never)}
          </Badge>
          <div className='grid grid-cols-2 gap-4'>
            <Detail
              label={t('supportQuestions.fields.level' as never)}
              value={supportQuestion?.level?.toString()}
            />
            <Detail
              label={t('supportQuestions.fields.requiredParam' as never)}
              value={supportQuestion?.requiredParam}
            />
            <Detail
              label={t(
                'supportQuestions.fields.requiredParamInputDisplay' as never
              )}
              value={
                supportQuestion?.requiredParamInputDisplay
                  ? t(
                      `supportQuestions.inputDisplay.${supportQuestion?.requiredParamInputDisplay}` as never
                    )
                  : null
              }
            />
            <Detail
              label={t('supportQuestions.fields.sequence' as never)}
              value={supportQuestion?.sequence?.toString()}
            />
            <Detail
              label={t(
                'supportQuestions.fields.nextSelectableQuestionKeys' as never
              )}
              value={supportQuestion?.nextSelectableQuestionKeys?.join(', ')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='break-all font-medium'>{value || '-'}</p>
    </div>
  )
}
