import { DocTypeEmbeddedPage } from '@features/doc-types/pages/shared/doc-type-embedded-page'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function DocTypeFormBuilderPage() {
  const { t } = useTranslation()
  const { docTypeId } = useParams({
    from: '/_authenticated/doc-types/$docTypeId/form-builder',
  })

  return (
    <DocTypeEmbeddedPage
      docTypeId={docTypeId}
      kind='builder'
      title={t('docTypes.dialog.builderTitle')}
    />
  )
}
