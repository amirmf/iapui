import type { RepetitiveResponse } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslation } from 'react-i18next'

export function RepetitiveResponseViewDialog(props: { onOpenChange: (open: boolean) => void; open: boolean; repetitiveResponse: RepetitiveResponse }) {
  const { onOpenChange, open, repetitiveResponse } = props; const { t } = useTranslation()
  return <Dialog onOpenChange={onOpenChange} open={open}><DialogContent><DialogHeader><DialogTitle>{t('repetitiveResponses.dialog.viewDetails')}</DialogTitle></DialogHeader><div className='space-y-4'><h2 className='text-xl font-bold'>{repetitiveResponse.title ?? '-'}</h2><div><p className='text-sm text-muted-foreground'>{t('repetitiveResponses.columns.response')}</p><p className='whitespace-pre-line font-medium'>{repetitiveResponse.description ?? '-'}</p></div><div className='grid grid-cols-2 gap-4'><div><p className='text-sm text-muted-foreground'>{t('repetitiveResponses.columns.seqNum')}</p><p>{repetitiveResponse.seqNum ?? '-'}</p></div><div><p className='text-sm text-muted-foreground'>{t('repetitiveResponses.columns.usageCount')}</p><p>{repetitiveResponse.usageCount ?? '-'}</p></div></div></div></DialogContent></Dialog>
}
