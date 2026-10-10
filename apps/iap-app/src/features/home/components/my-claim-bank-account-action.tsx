import { useState } from 'react'

import { Button } from '@iap/ui'
import { CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useHasHozeSupportPolicyIds } from '../hooks/use-has-hoze-support-policy-ids'
import { MyBankAccountDialog } from './my-bank-account-dialog'

export function MyClaimBankAccountAction() {
  const { t } = useTranslation()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const hasEligiblePolicy = useHasHozeSupportPolicyIds()

  if (hasEligiblePolicy) return null

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        className='inline-flex items-center gap-2'
        onClick={() => setIsDialogOpen(true)}
      >
        <CreditCard className='h-4 w-4' />
        {t('myiap.myIapPage.bankAccountInfo')}
      </Button>
      <MyBankAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}

export default MyClaimBankAccountAction
