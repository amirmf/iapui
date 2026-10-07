import type { ComponentProps } from 'react'

import { cn } from '@iap/ui'
import { Button } from '@iap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@iap/ui'
import { CircleHelp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportQuestionButtonProps = {
  label: string
  onClick: () => void
  featureKey: string
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
  className?: string
  disabled?: boolean
}

export function SupportQuestionButton(props: SupportQuestionButtonProps) {
  const {
    label,
    onClick,
    featureKey,
    variant = 'default',
    size = 'default',
    className,
    disabled,
  } = props
  const { t } = useTranslation()
  const { openSupportForFeature } = useSupportFlow()

  return (
    <div className='inline-flex'>
      <Button
        presentation='reference'
        type='button'
        variant={variant}
        size={size}
        className={cn(
          'rounded-e-none',
          variant === 'link' && 'text-primary',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              presentation='reference'
              type='button'
              variant={variant}
              size={size}
              className={cn(
                '-ms-px rounded-s-none',
                variant === 'link' && 'text-primary'
              )}
              onClick={() => openSupportForFeature(featureKey)}
              aria-label={t('supportFlow.openLabel')}
              disabled={disabled}
            >
              <CircleHelp className='size-4' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent presentation='reference'>
            {t('supportFlow.questionButton')}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
