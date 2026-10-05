import { DocTypeForm } from '@features/doc-types/components/doc-type-form/doc-type-form'
import { DocTypePageLayout } from '@features/doc-types/pages/shared/doc-type-page-layout'
import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function DocTypeEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { docTypeId } = useParams({
    from: '/_authenticated/doc-types/$docTypeId/edit',
  })
  const query = useQuery({
    enabled: !!docTypeId,
    queryFn: () => docTypeService.getById(docTypeId!),
    queryKey: ['doc-types', docTypeId],
  })
  const exit = () => navigate({ to: '/doc-types/' })
  const isMissingOrError = query.isError || !query.data

  return (
    <DocTypePageLayout
      description={t('docTypes.dialog.editDesc')}
      title={t('docTypes.dialog.edit')}
    >
      {query.isLoading ? (
        <p className='text-sm text-muted-foreground'>{t('common.loading')}</p>
      ) : !isMissingOrError ? (
        <DocTypeForm
          docType={query.data}
          mode='edit'
          onCancel={exit}
          onSuccess={exit}
        />
      ) : (
        <div className='space-y-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4'>
          <p className='text-sm text-destructive'>
            {t('docTypes.messages.updateError')}
          </p>
          <div className='flex justify-end'>
            <Button onClick={exit} variant='outline'>
              {t('common.goBack')}
            </Button>
          </div>
        </div>
      )}
    </DocTypePageLayout>
  )
}
