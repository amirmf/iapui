import { Button } from '@iap/ui'
import { useGetMyInsurancePolicy } from '@modules/insurance-policies'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { hasPolicyPdf } from '../constants/policy-pdf-ids'

export function MyClaimPolicyPdfDownloadActions() {
  const { t } = useTranslation()
  const { data: insurancePolicies } = useGetMyInsurancePolicy()
  const downloadablePolicies = (insurancePolicies ?? []).filter((policy) =>
    hasPolicyPdf(policy.id)
  )

  if (downloadablePolicies.length === 0) {
    return null
  }

  const handleDownloadAll = () => {
    downloadablePolicies.forEach((policy) => {
      const link = document.createElement('a')
      link.href = `/policy/${policy.id}.pdf`
      link.download = `${policy.id}.pdf`
      document.body.append(link)
      link.click()
      link.remove()
    })
  }

  return (
    <Button
      variant='outline'
      size='sm'
      className='border-sky-500 text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-950/30 dark:hover:text-sky-200'
      onClick={handleDownloadAll}
    >
      <Download className='h-4 w-4' />
      {t('myiap.myIapPage.downloadPolicyPdf')}
    </Button>
  )
}

export default MyClaimPolicyPdfDownloadActions
