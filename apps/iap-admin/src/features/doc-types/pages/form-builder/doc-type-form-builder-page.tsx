import { useMemo } from 'react'

import { Button } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { IconArrowLeft, IconExternalLink } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const buildIframeSrc = (docTypeId: string) => {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return `${base}/formio/doc-types/${docTypeId}/builder`
}

export function DocTypeFormBuilderPage() {
  const { docTypeId } = useParams({
    from: '/_authenticated/doc-types/$docTypeId/form-builder',
  })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: docType } = useQuery({
    enabled: Boolean(docTypeId),
    queryFn: () => docTypeService.getById(docTypeId),
    queryKey: ['doc-types', 'detail', docTypeId],
  })
  const iframeSrc = useMemo(() => buildIframeSrc(docTypeId), [docTypeId])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center'>
        <div>
          <Button
            className='mb-2 w-fit gap-2 px-0 text-sm text-muted-foreground hover:text-foreground'
            onClick={() => navigate({ to: '/doc-types/' })}
            type='button'
            variant='ghost'
          >
            <IconArrowLeft size={16} />
            <span>{t('common.back')}</span>
          </Button>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>
            {t('docTypes.dialog.builderTitle')}
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
          <IconExternalLink size={16} />
          <span>{t('common.openInNewTab')}</span>
        </Button>
      </div>
      <div className='flex-1 overflow-hidden rounded-xl border bg-background shadow-sm'>
        <iframe
          className='h-[calc(100vh-220px)] min-h-[600px] w-full'
          key={iframeSrc}
          src={iframeSrc}
          title={t('docTypes.dialog.builderTitle')}
        />
      </div>
    </div>
  )
}
