import { Bot } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSupportFlowStore } from './context/store/support-store'

export function SupportNavigationButton() {
  const { t: translate } = useTranslation()
  const t = translate as (key: string) => string
  const hasInitialQuestions = useSupportFlowStore(
    (state) => state.hasInitialQuestions
  )
  const isOpen = useSupportFlowStore((state) => state.isOpen)
  const open = useSupportFlowStore((state) => state.open)

  if (!hasInitialQuestions) return null

  return (
    <button
      aria-label={t('supportFlow.openLabel')}
      aria-pressed={isOpen}
      className='text-muted-foreground hover:text-primary focus-visible:ring-ring flex w-full flex-col items-center justify-center gap-1 px-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'
      onClick={open}
      type='button'
    >
      <Bot aria-hidden='true' className='size-6' />
      <span className='max-w-full truncate'>
        {t('supportFlow.bottomNavLabel')}
      </span>
    </button>
  )
}
