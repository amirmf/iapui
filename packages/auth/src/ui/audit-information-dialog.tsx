import { useCallback, useEffect, useRef } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Skeleton,
  formatDateTime,
} from '@iap/ui'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { CalendarClockIcon, IdCardIcon, UserRoundIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'

import { authService } from '../services/auth-service'

export type AuditInformation = {
  createdAt?: string | null
  createdBy?: string | null
  updatedAt?: string | null
  updatedBy?: string | null
}

type AuditInformationDialogStore = AuditInformation & {
  isOpen: boolean
  open: (data: AuditInformation) => void
  reset: () => void
}

const initialState: AuditInformation & { isOpen: boolean } = {
  createdAt: undefined,
  createdBy: undefined,
  isOpen: false,
  updatedAt: undefined,
  updatedBy: undefined,
}

export const useAuditInformationDialogStore =
  create<AuditInformationDialogStore>((set) => ({
    ...initialState,
    open: (data) => set({ ...initialState, ...data, isOpen: true }),
    reset: () => set(initialState),
  }))

type AuditSectionProps = {
  date: string | null | undefined
  dateLabel: string
  displayName: string | null
  isError: boolean
  isLoading: boolean
  title: string
  username: string | null
}

function AuditSection(props: AuditSectionProps) {
  const { date, dateLabel, displayName, isError, isLoading, title, username } =
    props
  const { t } = useTranslation()

  const userValue = (value: string | null) => {
    if (isLoading) return <Skeleton className='h-5 w-32' />
    if (isError) return t('common.auditInfo.userLoadError')

    return value ?? '-'
  }

  return (
    <section className='bg-background space-y-4 rounded-lg border p-4'>
      <h3 className='font-semibold'>{title}</h3>
      <dl className='grid gap-4 sm:grid-cols-3'>
        <div className='space-y-1'>
          <dt className='text-muted-foreground flex items-center gap-2 text-sm'>
            <UserRoundIcon aria-hidden='true' className='size-4' />
            {t('common.username')}
          </dt>
          <dd className='min-h-5 text-sm font-medium'>{userValue(username)}</dd>
        </div>
        <div className='space-y-1'>
          <dt className='text-muted-foreground flex items-center gap-2 text-sm'>
            <IdCardIcon aria-hidden='true' className='size-4' />
            {t('common.displayName')}
          </dt>
          <dd className='min-h-5 text-sm font-medium'>
            {userValue(displayName)}
          </dd>
        </div>
        <div className='space-y-1'>
          <dt className='text-muted-foreground flex items-center gap-2 text-sm'>
            <CalendarClockIcon aria-hidden='true' className='size-4' />
            {dateLabel}
          </dt>
          <dd className='min-h-5 text-sm font-medium'>
            {formatDateTime(date)}
          </dd>
        </div>
      </dl>
    </section>
  )
}

function useAuditUser(userId: string | null | undefined, enabled: boolean) {
  const normalizedUserId = userId?.trim() ?? ''

  return useQuery({
    enabled: Boolean(normalizedUserId) && enabled,
    queryFn: ({ signal }) => authService.getUserById(normalizedUserId, signal),
    queryKey: ['auth', 'user-by-id', normalizedUserId],
    staleTime: 30_000,
  })
}

function userFields(
  user: { displayName?: string | null; username: string } | undefined
) {
  return {
    displayName: user?.displayName?.trim() || null,
    username: user?.username?.trim() || null,
  }
}

export function AuditInformationDialog() {
  const { t } = useTranslation()
  const locationHref = useLocation({ select: (location) => location.href })
  const openedAtLocationRef = useRef<string | null>(null)
  const createdAt = useAuditInformationDialogStore((state) => state.createdAt)
  const createdBy = useAuditInformationDialogStore((state) => state.createdBy)
  const isOpen = useAuditInformationDialogStore((state) => state.isOpen)
  const reset = useAuditInformationDialogStore((state) => state.reset)
  const updatedAt = useAuditInformationDialogStore((state) => state.updatedAt)
  const updatedBy = useAuditInformationDialogStore((state) => state.updatedBy)
  const creatorQuery = useAuditUser(createdBy, isOpen)
  const updaterQuery = useAuditUser(updatedBy, isOpen)
  const creator = userFields(creatorQuery.data)
  const updater = userFields(updaterQuery.data)

  useEffect(() => {
    if (!isOpen) {
      openedAtLocationRef.current = null
      return
    }

    if (openedAtLocationRef.current === null) {
      openedAtLocationRef.current = locationHref
      return
    }

    if (openedAtLocationRef.current !== locationHref) reset()
  }, [isOpen, locationHref, reset])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) reset()
    },
    [reset]
  )

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t('common.auditInfo.title')}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <AuditSection
            date={createdAt}
            dateLabel={t('common.createdAt')}
            displayName={creator.displayName}
            isError={creatorQuery.isError}
            isLoading={creatorQuery.isPending || creatorQuery.isFetching}
            title={t('common.auditInfo.createdSection')}
            username={creator.username}
          />
          <AuditSection
            date={updatedAt}
            dateLabel={t('common.updatedAt')}
            displayName={updater.displayName}
            isError={updaterQuery.isError}
            isLoading={updaterQuery.isPending || updaterQuery.isFetching}
            title={t('common.auditInfo.updatedSection')}
            username={updater.username}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
