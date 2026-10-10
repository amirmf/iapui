import { Button } from '@iap/ui'
import { Link } from '@tanstack/react-router'
import { Building2, FileText, PlayCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { MyClaimBankAccountAction } from './my-claim-bank-account-action'
import { MyClaimPolicyPdfDownloadActions } from './my-claim-policy-pdf-download-actions'

export function MyClaimWelcomeActions() {
  const { t } = useTranslation()

  return (
    <div className='flex w-full flex-wrap justify-end gap-2'>
      <MyClaimPolicyPdfDownloadActions />
      <Button
        variant='outline'
        size='sm'
        asChild
        className='border-violet-500 text-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-200'
      >
        <Link to='/pre-auths/' className='inline-flex items-center gap-2'>
          <FileText className='h-4 w-4' />
          {t('myiap.myIapPage.medicalReferralLetters')}
        </Link>
      </Button>
      <MyClaimBankAccountAction />
      <Button
        variant='outline'
        size='sm'
        className='border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-950/30 dark:hover:text-orange-200'
        asChild
      >
        <a
          href='https://alborzinsurance.ir/MedicalCenters'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2'
        >
          <Building2 className='h-4 w-4' />
          {t('myiap.myIapPage.contractingPartyCenters')}
        </a>
      </Button>
      <Button variant='outline' size='sm' asChild>
        <a
          href='/video/panel-customer-02.mp4'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2'
        >
          <PlayCircle className='h-4 w-4' />
          {t('myiap.myIapPage.watchTutorial')}
        </a>
      </Button>
    </div>
  )
}

export default MyClaimWelcomeActions
