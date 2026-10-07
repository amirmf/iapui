import { Button } from '@iap/ui'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type SupportFlowWindowActionsProps = {
  canGoBack: boolean
  isLoading: boolean
  onBack: () => void
  onReset: () => void
}

function SupportFlowWindowActions(props: SupportFlowWindowActionsProps) {
  const { canGoBack, isLoading, onBack, onReset } = props
  const { t } = useTranslation()

  return (
    <div className='relative z-10 flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white/[0.82] px-3 py-2 shadow-[0_14px_36px_-30px_rgb(15_23_42/0.7)] backdrop-blur-xl sm:px-4 dark:border-white/10 dark:bg-slate-950/[0.78]'>
      <Button
        presentation='reference'
        type='button'
        size='sm'
        variant='ghost'
        className='h-9 cursor-pointer gap-2 rounded-lg px-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 disabled:text-slate-400 sm:px-3 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:text-slate-600'
        onClick={onBack}
        disabled={!canGoBack || isLoading}
      >
        <ArrowLeft className='size-4 rtl:rotate-180' aria-hidden='true' />
        <span>{t('supportFlow.actions.back')}</span>
      </Button>
      <Button
        presentation='reference'
        type='button'
        size='sm'
        variant='ghost'
        className='h-9 cursor-pointer gap-2 rounded-lg px-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-950 disabled:text-slate-400 sm:px-3 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:text-slate-600'
        onClick={onReset}
        disabled={isLoading}
      >
        <RotateCcw className='size-4' aria-hidden='true' />
        <span>{t('supportFlow.actions.restart')}</span>
      </Button>
    </div>
  )
}

export default SupportFlowWindowActions
