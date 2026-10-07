import type { ComponentProps } from 'react'

import { useThemeStore } from '@iap/theme'
import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import { CircleHelp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportFeatureButtonProps = Omit<
  ComponentProps<typeof Button>,
  'asChild' | 'children' | 'onClick' | 'type'
> & {
  featureKey: string
  onlyIcon?: boolean
}

export function SupportFeatureButton(props: SupportFeatureButtonProps) {
  const {
    featureKey,
    variant = 'outline',
    className,
    onlyIcon,
    ...buttonProps
  } = props
  const { t } = useTranslation()
  const { openSupportForFeature, hasInitialQuestions } = useSupportFlow()
  const theme = useThemeStore((state) => state.theme)

  if (!hasInitialQuestions) return null

  return (
    <Button
      presentation='reference'
      {...buttonProps}
      type='button'
      variant={variant}
      className={cn('gap-2', variant === 'link' && 'text-primary', className)}
      onClick={() => openSupportForFeature(featureKey)}
      style={{
        background:
          theme === 'dark'
            ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
            : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND,
      }}
    >
      <CircleHelp className='size-4' aria-hidden='true' />
      {!onlyIcon && t('supportFlow.questionButton')}
    </Button>
  )
}
