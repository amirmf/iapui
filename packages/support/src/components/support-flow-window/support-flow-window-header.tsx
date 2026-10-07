import { useThemeStore } from '@iap/theme'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { ShieldCheck, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import IconBot from '../icon-bot'
import type { SupportFlowColorContext } from '../support-flow-types'

type SupportFlowWindowHeaderProps = {
  colorContext?: SupportFlowColorContext
  onClose: () => void
}

function SupportFlowWindowHeader(props: SupportFlowWindowHeaderProps) {
  const { colorContext = 'default', onClose } = props
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)

  return (
    <header
      className={cn(
        'text-primary-foreground relative z-10 overflow-hidden border-b border-white/15 px-3 py-3 shadow-[0_16px_50px_-34px_rgb(15_23_42/0.85)] sm:px-4 sm:py-4',
        colorContext === 'auth' && 'bg-primary'
      )}
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
      <div
        className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.16),transparent_40%),linear-gradient(90deg,rgba(15,23,42,0.16),transparent)]'
        aria-hidden='true'
      />
      <div
        className='absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent'
        aria-hidden='true'
      />
      <div className='relative flex items-center gap-2.5 sm:gap-3'>
        <div className='min-w-0 flex-1'>
          <h2
            id='support-flow-title'
            className='flex items-center text-base font-semibold tracking-tight'
          >
            <div className='me-2.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur sm:me-3 sm:size-11 sm:rounded-2xl'>
              <IconBot className='size-7 sm:size-8' />
            </div>
            <span className='min-w-0'>
              <p className='truncate'>{t('supportFlow.title')}</p>
              <span className='text-primary-foreground/75 mt-1 flex items-center gap-1.5 text-xs font-medium'>
                <ShieldCheck className='size-3.5' aria-hidden='true' />
                <span className='size-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgb(110_231_183/0.85)]' />
              </span>
            </span>
          </h2>
        </div>
        <Button
          presentation='reference'
          type='button'
          size='icon'
          variant='ghost'
          className='text-primary-foreground hover:text-primary-foreground size-9 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white/10 shadow-sm backdrop-blur hover:bg-white/[0.18] sm:size-10 sm:rounded-2xl'
          onClick={onClose}
          aria-label={t('supportFlow.actions.close')}
        >
          <X className='size-5' aria-hidden='true' />
        </Button>
      </div>
    </header>
  )
}

export default SupportFlowWindowHeader
