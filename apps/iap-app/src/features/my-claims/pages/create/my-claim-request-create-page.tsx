import { MyClaimRequestPageHeader } from '@features/my-claims/components/my-claim-request-page-header'
import { MyClaimRequestForm } from '@features/my-claims/pages/create/components/my-claim-request-form'
import { Card, CardContent } from '@iap/ui'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export default function MyClaimRequestCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className='container px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl space-y-6'>
        <MyClaimRequestPageHeader
          title={t('myiap.claimRequests.form.title')}
          description={t('myiap.claimRequests.form.description')}
          showBackButton
          backLink='/myclaims/'
        />
        <Card>
          <CardContent>
            <MyClaimRequestForm
              onSuccess={() => navigate({ to: '/myclaims/' })}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
