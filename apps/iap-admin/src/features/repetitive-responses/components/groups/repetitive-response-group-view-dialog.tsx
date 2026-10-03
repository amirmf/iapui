import type { RepetitiveResponseGroup } from '@iap/api-types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { useTranslation } from 'react-i18next'

type Props = {
  group: RepetitiveResponseGroup
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function RepetitiveResponseGroupViewDialog({
  group,
  onOpenChange,
  open,
}: Props) {
  const { t } = useTranslation()

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {t('repetitiveResponseGroups.dialog.viewDetails')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold'>{group.title ?? '-'}</h2>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>
              {t('repetitiveResponseGroups.columns.seqNum')}
            </p>
            <p className='font-medium'>{group.seqNum ?? '-'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
