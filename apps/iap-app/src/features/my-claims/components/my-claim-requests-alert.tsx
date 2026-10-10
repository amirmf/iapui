import { useThemeStore } from '@iap/theme'
import { Alert, AlertDescription, AlertTitle, Button } from '@iap/ui'
import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function MyClaimRequestsAlert() {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme)
  return (
    <Alert
      className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'
      style={{
        borderColor: import.meta.env.VITE_MY_IAP_NAV_BACKGROUND,
        background: import.meta.env.VITE_MY_IAP_NAV_BACKGROUND.replace(
          '1)',
          '0.05)'
        ),
      }}
    >
      <Info
        aria-hidden='true'
        className='h-4 w-4'
        style={{
          color:
            theme === 'light'
              ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND
              : undefined,
        }}
      />
      <AlertTitle className='line-clamp-none font-semibold lg:text-lg'>
        {t('myiap.claimRequests.treatmentCostInfoTitle')}
      </AlertTitle>
      <AlertDescription className='mt-2 space-y-2'>
        {(
          [
            {
              key: 'treatmentCostInfoStepPrimary',
              href: 'https://alborzinsurance.ir/InsuredCode',
              btnTitle: 'treatmentCostInfoStepPrimaryBtn',
            },
            {
              key: 'treatmentCostInfoStepEstimate',
              href: 'https://eit.alborzinsurance.ir/BimeSiteMVC/Dr/BimeshodeDmgEstelam/BimeshodeDmgEstelam',
              btnTitle: 'treatmentCostInfoStepEstimateBtn',
            },
          ] as const
        ).map((link) => (
          <div
            key={link.href}
            className='flex w-full flex-wrap items-center text-sm text-muted-foreground'
          >
            <p>{t(`myiap.claimRequests.${link.key}`)}</p>
            <Button
              presentation='reference'
              className='ms-2'
              asChild
              variant='outline'
              size='sm'
            >
              <a href={link.href} target='_blank' rel='noopener noreferrer'>
                {t(`myiap.claimRequests.${link.btnTitle}`)}
              </a>
            </Button>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  )
}

export default MyClaimRequestsAlert
