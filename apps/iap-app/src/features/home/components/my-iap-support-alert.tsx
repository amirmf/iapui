import { Alert, AlertTitle } from '@iap/ui'
import { Headphones } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useHasHozeSupportPolicyIds } from '../hooks/use-has-hoze-support-policy-ids'

export function MyIapSupportAlert() {
  const { t } = useTranslation()
  const hasEligiblePolicy = useHasHozeSupportPolicyIds()

  if (!hasEligiblePolicy) {
    return null
  }

  return (
    <Alert className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'>
      <Headphones className='h-4 w-4 text-primary' />
      <AlertTitle className='line-clamp-none whitespace-normal break-words font-semibold'>
        {t('myiap.myIapPage.supportAlertDescription')}
      </AlertTitle>
    </Alert>
  )
}

export default MyIapSupportAlert
