import type { ClaimRequestObjection } from '@iap/api-types'
import { cn } from '@iap/ui'
import { formatDateTime } from '@iap/ui'
import { useTranslation } from 'react-i18next'

interface ObjectionChatCardProps {
  objection: ClaimRequestObjection
}

export function ObjectionChatCard(props: ObjectionChatCardProps) {
  const { objection } = props
  const { t, i18n } = useTranslation()
  const isEndUser = objection.roleType === 'ENDUSER'

  return (
    <div
      key={objection.createdAt}
      className={cn('flex', isEndUser ? 'justify-start' : 'justify-end')}
    >
      <div
        className={cn(
          'max-w-xs rounded-lg px-4 py-2 lg:max-w-md xl:max-w-lg',
          isEndUser
            ? 'rounded-br-none bg-gray-200 text-gray-900'
            : 'rounded-bl-none bg-primary-600 text-white'
        )}
      >
        <div className={cn('text-sm', isEndUser ? 'text-right' : 'text-left')}>
          {objection.description}
        </div>
        <div
          className={cn(
            'flex items-center text-xs',
            isEndUser ? 'justify-start text-gray-500' : 'justify-end text-muted'
          )}
        >
          {objection.createdAt && (
            <div className={cn('mt-1 dir-ltr')}>
              {formatDateTime(objection.createdAt, undefined, {
                language: i18n.language,
                normalizeTimezone: false,
                invalidDate: 'throw',
              })}
            </div>
          )}
          <span className='mx-1'>-</span>
          <div>
            {isEndUser ? t('objectionChat.user') : t('objectionChat.admin')}
          </div>
        </div>
      </div>
    </div>
  )
}
