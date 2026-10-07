import { useThemeStore } from '@iap/theme'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { useTranslation } from 'react-i18next'

import type { SupportFlowContext } from '../model/support-flow-context'
import IconBot from './icon-bot'
import type { SupportFlowColorContext } from './support-flow-types'
import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportFloatingButtonProps = {
  colorContext?: SupportFlowColorContext
  position?: 'default' | 'admin'
  context?: SupportFlowContext
}

export function SupportFloatingButton(props: SupportFloatingButtonProps) {
  const { colorContext = 'default', position = 'default', context } = props
  const { t } = useTranslation()
  const { openSupport, isOpen } = useSupportFlow()
  const theme = useThemeStore((state) => state.theme)

  if (isOpen) return null

  return (
    <Button
      presentation='reference'
      type='button'
      className={cn(
        'group fixed left-6 z-50 hidden h-16 cursor-pointer overflow-visible rounded-[1.35rem] px-4 pe-5 shadow-[0_24px_70px_-22px_rgb(15_23_42/0.65)] ring-1 ring-white/15 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_30px_80px_-24px_rgb(15_23_42/0.72)] md:inline-flex',
        position === 'admin' ? 'bottom-6' : 'bottom-16',
        colorContext === 'auth' && 'bg-primary hover:bg-primary/90'
      )}
      onClick={() => openSupport(context)}
      aria-label={t('supportFlow.openLabel')}
      style={
        colorContext === 'default'
          ? {
              background:
                theme === 'dark'
                  ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
                  : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND,
            }
          : undefined
      }
    >
      <span
        className='absolute -top-1 -right-1 size-4 rounded-full border-2 border-white bg-emerald-400 shadow-[0_0_18px_rgb(52_211_153/0.9)] dark:border-slate-950'
        aria-hidden='true'
      />
      <span
        className='absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.42),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.2),transparent_50%)] opacity-90 transition-opacity group-hover:opacity-100'
        aria-hidden='true'
      />
      <span className='relative flex items-center gap-2.5'>
        <IconBot className='size-10 shrink-0 text-white drop-shadow-sm' />
        <span className='max-w-28 truncate text-sm font-semibold text-white drop-shadow-sm'>
          {position === 'admin'
            ? t('supportFlow.floatingButtonAdmin')
            : t('supportFlow.floatingButton')}
        </span>
      </span>
    </Button>
  )
}
