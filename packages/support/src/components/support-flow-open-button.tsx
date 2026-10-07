import { Button } from '@iap/ui'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { getSupportFlowRouteContext } from '../route-adapters/support-route-context'
import IconBot from './icon-bot'
import type { SupportFlowColorContext } from './support-flow-types'
import { useSupportFlow } from './support-flow-window/use-support-flow'

type SupportFlowOpenButtonProps = {
  colorContext?: SupportFlowColorContext
}

export function SupportFlowOpenButton(props: SupportFlowOpenButtonProps) {
  const { colorContext = 'default' } = props
  const { t } = useTranslation()
  const { isOpen, openSupport, hasInitialQuestions } = useSupportFlow()
  const pathname = useLocation({ select: (location) => location.pathname })

  if (!hasInitialQuestions && !isOpen) return null

  return (
    <Button
      presentation='reference'
      type='button'
      variant={colorContext === 'auth' ? 'default' : 'outline'}
      className='w-full cursor-pointer gap-2 md:hidden'
      onClick={() => openSupport(getSupportFlowRouteContext(pathname))}
      aria-label={t('supportFlow.openLabel')}
    >
      <IconBot className='size-5' aria-hidden='true' />
      {t('supportFlow.floatingButton')}
    </Button>
  )
}
