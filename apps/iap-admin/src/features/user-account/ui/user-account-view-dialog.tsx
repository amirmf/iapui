import { type ReactNode, useCallback } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  cn,
  formatDateTime,
} from '@iap/ui'
import { ReadonlyItems } from '@shared/ui/readonly-items'
import {
  AtSign,
  Calendar,
  IdCard,
  MapPin,
  Smartphone,
  User,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { userAccountStatusClasses } from '../constants/user-account-options'
import { useUserAccountStore } from '../model/user-account-store'

function DetailItem(props: { title: string; value: ReactNode }) {
  const { title, value } = props
  return (
    <ReadonlyItems
      className='rounded border border-l-2 px-3'
      classNameTitle='text-muted-foreground'
      classNameValue='min-h-0 px-0 font-medium'
      title={title}
      value={value}
    />
  )
}

export function UserAccountViewDialog() {
  const { t } = useTranslation()
  const { closeDialog, currentUser, dialog } = useUserAccountStore()
  const isOpen = dialog === 'view'
  const status = currentUser?.enabled ? 'enabled' : 'disabled'
  const handleOpenChange = useCallback(() => closeDialog(), [closeDialog])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('parties.actions.viewDetails')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-foreground'>
                {currentUser?.displayName || currentUser?.username || '-'}
              </h2>
              <div className='mt-2 flex items-center gap-2 text-muted-foreground'>
                <IdCard aria-hidden='true' className='size-4' />
                <span className='font-mono text-sm'>
                  {currentUser?.id || currentUser?.extId || '-'}
                </span>
              </div>
            </div>
            <span
              className={cn(
                'flex w-fit items-center rounded-md border px-2 py-1 text-xs',
                userAccountStatusClasses[status]
              )}
            >
              {currentUser?.enabled ? (
                <UserCheck aria-hidden='true' className='me-1 size-3' />
              ) : (
                <UserX aria-hidden='true' className='me-1 size-3' />
              )}
              {t(
                currentUser?.enabled
                  ? 'parties.status.active'
                  : 'parties.status.inactive'
              )}
            </span>
          </div>
          <div className='border-t' />
          <div className='grid gap-4 md:grid-cols-2'>
            <section className='space-y-3'>
              <SectionTitle
                icon={<User aria-hidden='true' className='size-4' />}
                title={t('parties.userAccountView.sections.account')}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.username')}
                value={currentUser?.username || '-'}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.displayName')}
                value={currentUser?.displayName || '-'}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.externalId')}
                value={currentUser?.extId || '-'}
              />
            </section>
            <section className='space-y-3'>
              <SectionTitle
                icon={<AtSign aria-hidden='true' className='size-4' />}
                title={t('parties.userAccountView.sections.contact')}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.email')}
                value={currentUser?.email || '-'}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.mobile')}
                value={
                  <span className='flex items-center gap-2'>
                    <Smartphone aria-hidden='true' className='size-3' />
                    {currentUser?.mobileNumber || '-'}
                  </span>
                }
              />
            </section>
          </div>
          <section className='space-y-3'>
            <SectionTitle
              icon={<MapPin aria-hidden='true' className='size-4' />}
              title={t('parties.columns.branchLocations')}
            />
            <DetailItem
              title={t('parties.columns.branchLocations')}
              value={
                currentUser?.branchLocations?.length
                  ? currentUser.branchLocations
                      .map((branch) => branch.unitName || branch.code)
                      .filter(Boolean)
                      .join('، ')
                  : '-'
              }
            />
          </section>
          <section className='space-y-3'>
            <SectionTitle
              icon={<Calendar aria-hidden='true' className='size-4' />}
              title={t('parties.userAccountView.sections.audit')}
            />
            <div className='grid gap-4 md:grid-cols-2'>
              <DetailItem
                title={t('parties.userAccountView.fields.createdAt')}
                value={formatDateTime(currentUser?.createdAt)}
              />
              <DetailItem
                title={t('parties.userAccountView.fields.updatedAt')}
                value={formatDateTime(currentUser?.updatedAt)}
              />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionTitle(props: { icon: ReactNode; title: string }) {
  const { icon, title } = props
  return (
    <div className='mb-3 flex items-center gap-2'>
      <span className='text-primary'>{icon}</span>
      <h3 className='font-semibold'>{title}</h3>
    </div>
  )
}
