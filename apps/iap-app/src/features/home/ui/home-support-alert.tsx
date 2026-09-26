import { useQuery } from '@tanstack/react-query'
import { Headphones } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { insurancePolicyQuery } from '../queries/insurance-policy-query'

const supportPolicyIds = new Set([
  41853077, 41852575, 41852551, 41852520, 41852477, 41852441, 41852412,
  41852399, 41852365, 41852286, 41852282, 41852271, 41852262, 41852235,
  41852233, 41852224, 41852223, 41852193, 41852179, 41852165, 41852126,
  41852124, 41852110, 41852080, 41852079, 41852066, 41852048, 41852045,
  41851979, 41851943, 41851927, 41851908, 41851906, 41849725, 41835713,
])

export function HomeSupportAlert() {
  const { data: policies } = useQuery(insurancePolicyQuery)
  const { t } = useTranslation()
  const hasEligiblePolicy = policies?.some((policy) =>
    supportPolicyIds.has(policy.id)
  )

  if (!hasEligiblePolicy) {
    return null
  }

  return (
    <aside className='mb-6 flex gap-3 rounded-xl border border-primary/50 bg-primary/5 p-4'>
      <Headphones
        aria-hidden='true'
        className='mt-0.5 size-5 shrink-0 text-primary'
      />
      <p className='font-semibold'>
        {t('myiap.myIapPage.supportAlertDescription')}
      </p>
    </aside>
  )
}
