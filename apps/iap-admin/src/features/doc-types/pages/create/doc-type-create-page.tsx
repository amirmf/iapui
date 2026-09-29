import { DocTypePageLayout } from '@features/doc-types/pages/shared/doc-type-page-layout'
import { DocTypeForm } from '@features/doc-types/ui/doc-type-form/doc-type-form'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function DocTypeCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const exit = () => navigate({ to: '/doc-types/' })

  return (
    <DocTypePageLayout
      description={t('docTypes.dialog.createDesc')}
      title={t('docTypes.dialog.create')}
    >
      <DocTypeForm mode='create' onCancel={exit} onSuccess={exit} />
    </DocTypePageLayout>
  )
}
