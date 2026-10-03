import { repetitiveResponseGroupService } from '@features/repetitive-responses/services/repetitive-response-group-service'
import type { RepetitiveResponse } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
  repetitiveResponse: RepetitiveResponse
}

export function RepetitiveResponseViewDialog({
  onOpenChange,
  open,
  repetitiveResponse,
}: Props) {
  const { t } = useTranslation()
  const groupId = repetitiveResponse.repetitiveResponseGroupId ?? null
  const groupQuery = useQuery({
    enabled: Boolean(open && groupId),
    gcTime: 30_000,
    queryFn: ({ signal }) =>
      repetitiveResponseGroupService.getById(groupId as string, { signal }),
    queryKey: ['repetitive-response-group', groupId],
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  })

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {t('repetitiveResponses.dialog.viewDetails')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold'>
              {repetitiveResponse.title ?? '-'}
            </h2>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>
              {t('repetitiveResponses.columns.response')}
            </p>
            <p className='whitespace-pre-line font-medium'>
              {repetitiveResponse.description ?? '-'}
            </p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>
              {t('repetitiveResponses.dialog.fields.group')}
            </p>
            <p className='font-medium'>{groupQuery.data?.title ?? '-'}</p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('repetitiveResponses.columns.seqNum')}
              </p>
              <p className='font-medium'>{repetitiveResponse.seqNum ?? '-'}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>
                {t('repetitiveResponses.columns.usageCount')}
              </p>
              <p className='font-medium'>
                {repetitiveResponse.usageCount ?? '-'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
