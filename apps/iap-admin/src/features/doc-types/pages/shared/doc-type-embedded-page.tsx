import { useMemo } from 'react'

import { Button, cn } from '@iap/ui'
import { docTypeService } from '@modules/doc-types'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type DocTypeEmbeddedPageProps = {
  docTypeId: string
  kind: 'builder' | 'submission-example'
  title: string
}

function buildIframeSrc(
  docTypeId: string,
  kind: DocTypeEmbeddedPageProps['kind']
) {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return `${base}/formio/doc-types/${docTypeId}/${kind}`
}

export function DocTypeEmbeddedPage(props: DocTypeEmbeddedPageProps) {
  const { docTypeId, kind, title } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const query = useQuery({
    enabled: Boolean(docTypeId),
    queryFn: () => docTypeService.getById(docTypeId),
    queryKey: ['doc-types', 'detail', docTypeId],
  })
  const iframeSrc = useMemo(
    () => buildIframeSrc(docTypeId, kind),
    [docTypeId, kind]
  )
  const isSubmissionExample = kind === 'submission-example'
  const headerClassName = cn(
    'flex flex-col-reverse justify-between gap-3 sm:flex-row',
    kind === 'builder' && 'sm:items-center'
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className={headerClassName}>
        <div>
          <Button
            className='mb-2 w-fit gap-2 px-0 text-sm text-muted-foreground hover:text-foreground'
            onClick={() => navigate({ to: '/doc-types/' })}
            type='button'
            variant='ghost'
          >
            {isSubmissionExample ? (
              <ArrowLeft aria-hidden='true' className='size-4 rtl:hidden' />
            ) : (
              <ArrowLeft aria-hidden='true' className='size-4' />
            )}
            {isSubmissionExample ? (
              <ArrowRight aria-hidden='true' className='size-4 ltr:hidden' />
            ) : null}
            <span>{t('common.back')}</span>
          </Button>
          <h2 className='text-xl font-semibold tracking-tight sm:text-2xl'>
            {title}
          </h2>
          {query.data?.docType ? (
            <p className='text-sm text-muted-foreground'>
              {query.data.docType}
            </p>
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
          className='h-[calc(100vh-220px)] min-h-150 w-full'
          key={iframeSrc}
          src={iframeSrc}
          title={title}
        />
      </div>
    </div>
  )
}
