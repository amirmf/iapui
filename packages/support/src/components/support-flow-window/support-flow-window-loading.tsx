import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSupportFlow } from './use-support-flow'

function SupportFlowWindowLoading() {
  const { t } = useTranslation()
  const { isLoading } = useSupportFlow()

  if (!isLoading) return null
  return (
    <div className='flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400'>
      <span className='flex size-9 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-700 shadow-sm ring-4 ring-sky-50 dark:border-sky-400/20 dark:bg-slate-900 dark:text-sky-300 dark:ring-sky-400/10'>
        <Loader2 className='size-4 animate-spin' aria-hidden='true' />
      </span>
      <span className='rounded-2xl border border-slate-200/80 bg-white/[0.88] px-3 py-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]'>
        {t('supportFlow.loading')}
      </span>
    </div>
  )
}

export default SupportFlowWindowLoading
