import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { ReadonlyItems } from '@shared/components/readonly-items'
import { useTranslation } from 'react-i18next'

import { useSubUser } from '../context/store/sub-user-store'

export function SubUserDetailsDialog() {
  const { t } = useTranslation()
  const open = useSubUser((state) => state.open)
  const setOpen = useSubUser((state) => state.setOpen)
  const user = useSubUser((state) => state.currentRow)

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setOpen(null)
        }
      }}
      open={open === 'details'}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('subUsers.details.title')}</DialogTitle>
        </DialogHeader>
        {user && (
          <div className='grid sm:grid-cols-2'>
            <ReadonlyItems
              title={t('subUsers.columns.username')}
              value={user.username}
            />
            <ReadonlyItems
              title={t('subUsers.columns.displayName')}
              value={user.displayName || '-'}
            />
            <ReadonlyItems
              title={t('subUsers.columns.email')}
              value={user.email || '-'}
            />
            <ReadonlyItems
              title={t('subUsers.columns.mobileNumber')}
              value={user.mobileNumber || '-'}
            />
            <ReadonlyItems
              title={t('subUsers.columns.status')}
              value={
                user.enabled === false
                  ? t('subUsers.status.disabled')
                  : t('subUsers.status.enabled')
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
