import { DocTypeEmbeddedPage } from '@features/doc-types/pages/shared/doc-type-embedded-page'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function DocTypeSampleSubmissionPage() {
  const { t } = useTranslation()
  const { docTypeId } = useParams({
    from: '/_authenticated/doc-types/$docTypeId/submission-example',
  })

  return (
    <DocTypeEmbeddedPage
      docTypeId={docTypeId}
      kind='submission-example'
      title={t('docTypes.dialog.submissionTitle')}
    />
  )
}
