import { useMemo } from 'react'

import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function buildIframeSrc(docTypeId: string) {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return `${base}/formio/doc-types/${docTypeId}/submission-example`
}

export default function DocTypeSampleSubmissionPage() {
  const { t } = useTranslation()
  const { docTypeId } = useParams({
    from: '/_authenticated/doc-types/$docTypeId/submission-example',
  })
  const navigate = useNavigate()
  const { data: docType } = useQuery({
    enabled: !!docTypeId,
    queryFn: () => docTypeService.getById(docTypeId),
    queryKey: ['doc-types', 'detail', docTypeId],
  })
  const iframeSrc = useMemo(() => buildIframeSrc(docTypeId), [docTypeId])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col-reverse justify-between gap-3 sm:flex-row'>
        <div>
          <Button
            className='mb-2 w-fit gap-2 px-0 text-sm text-muted-foreground hover:text-foreground'
            onClick={() => navigate({ to: '/doc-types/' })}
            type='button'
            variant='ghost'
          >
            <ArrowLeft aria-hidden='true' className='size-4 rtl:hidden' />
            <ArrowRight aria-hidden='true' className='size-4 ltr:hidden' />
            <span>{t('common.back')}</span>
          </Button>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>
            {t('docTypes.dialog.submissionTitle')}
          </h2>
          {docType?.docType ? (
            <p className='text-sm text-muted-foreground'>{docType.docType}</p>
          ) : null}
        </div>
        <Button
          className='gap-2'
          onClick={() =>
            window.open(iframeSrc, '_blank', 'noopener,noreferrer')
          }
          type='button'
          variant='outline'
        >
          <ExternalLink aria-hidden='true' className='size-4' />
          <span>{t('common.openInNewTab')}</span>
        </Button>
      </div>
      <div className='flex-1 overflow-hidden rounded-xl border bg-background shadow-sm'>
        <iframe
          className='h-[calc(100vh-220px)] min-h-[600px] w-full'
          key={iframeSrc}
          src={iframeSrc}
          title={t('docTypes.dialog.submissionTitle')}
        />
      </div>
    </div>
  )
}
