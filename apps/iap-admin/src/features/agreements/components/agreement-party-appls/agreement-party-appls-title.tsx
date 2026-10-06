import { useTranslate } from '@shared/i18n/i18n'

export function AgreementPartyApplsTitle() {
  const { t } = useTranslate()

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap items-center gap-3'>
        <h2 className='text-xl font-bold tracking-tight'>
          {t('agreements.partyAppls.title' as never)}
        </h2>
      </div>
    </div>
  )
}
