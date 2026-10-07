import { Main } from '@shared/components/layout/main'
import { useTranslate } from '@shared/i18n/i18n'
import { isAxiosError } from 'axios'

interface ClaimRequestManagementQueryErrorProps {
  error: unknown
}

export function ClaimRequestManagementQueryError(
  props: ClaimRequestManagementQueryErrorProps
) {
  const { error } = props
  const { t } = useTranslate()
  const errorStatus = isAxiosError(error) ? error.response?.status : undefined
  const message =
    errorStatus === 404
      ? t('common.errorStatus.notFound')
      : errorStatus === 500
        ? t('common.errorStatus.serverError')
        : t('common.errorStatus.generic')

  return (
    <Main>
      <p className='text-center text-destructive'>{message}</p>
    </Main>
  )
}
