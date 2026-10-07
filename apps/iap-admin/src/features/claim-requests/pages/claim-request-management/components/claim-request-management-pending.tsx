import type { ReactNode } from 'react'

import { cn } from '@iap/ui'
import { Card, CardContent } from '@iap/ui'
import { Skeleton } from '@iap/ui'
import { Main } from '@shared/components/layout/main'
import { useTranslate } from '@shared/i18n/i18n'

const infoListRows = [
  ['w-20', 'w-32', 'w-20', 'w-28', 'w-16', 'w-24'],
  ['w-16', 'w-24', 'w-20', 'w-28', 'w-20', 'w-24', 'w-20', 'w-24'],
  ['w-20', 'w-28', 'w-20', 'w-24', 'w-20', 'w-32'],
] as const

function ClaimRequestHeaderSkeleton() {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center gap-1'>
        <Skeleton className='h-3 w-20' />
        <Skeleton className='h-5 w-24 rounded-md' />
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-3 w-14' />
          <Skeleton className='h-5 w-24 rounded-md' />
        </div>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-5 w-24 rounded-md' />
        </div>
      </div>
      <Skeleton className='h-8 w-24 rounded-md' />
      <Skeleton className='h-8 w-28 rounded-md' />
    </div>
  )
}

function ClaimRequestPanelHeaderSkeleton() {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex items-center gap-1'>
        <Skeleton className='h-3 w-20' />
        <Skeleton className='h-5 w-24 rounded-md' />
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-3 w-14' />
          <Skeleton className='h-5 w-24 rounded-md' />
        </div>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-5 w-24 rounded-md' />
        </div>
      </div>
    </div>
  )
}

function ClaimRequestInfoListSkeleton() {
  return (
    <section className='flex rounded-md border border-gray-400 bg-card px-1 py-0.5'>
      <div className='flex flex-1 flex-col'>
        {infoListRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='flex min-h-7 flex-wrap items-center gap-y-1'
          >
            {row.map((width, fieldIndex) => (
              <div
                key={`${rowIndex}-${fieldIndex}`}
                className='flex items-center px-1'
              >
                <Skeleton className='me-1 h-3 w-12' />
                <Skeleton className={cn('h-4', width)} />
                {fieldIndex < row.length - 1 ? (
                  <Skeleton className='ms-1 h-3 w-1' />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ClaimRequestAssessmentSkeleton() {
  return (
    <Card className='h-[75vh]'>
      <CardContent className='flex min-h-0 flex-1 flex-col px-4'>
        <div className='mb-3 flex items-center justify-between gap-4'>
          <Skeleton className='h-4 w-28' />
          <div className='flex gap-2'>
            <Skeleton className='size-8 rounded-md' />
            <Skeleton className='size-8 rounded-md' />
          </div>
        </div>
        <div className='space-y-3 overflow-hidden'>
          <Skeleton className='h-20 w-full rounded-md' />
          <Skeleton className='h-20 w-full rounded-md' />
          <Skeleton className='h-20 w-full rounded-md' />
        </div>
      </CardContent>
    </Card>
  )
}

function ClaimRequestAttachmentsSkeleton() {
  return (
    <Card className='h-[75vh] gap-2 py-4'>
      <CardContent className='flex min-h-0 flex-1 flex-col px-4'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-7 w-24 rounded-md' />
        </div>
        <Skeleton className='mt-4 min-h-0 flex-1 rounded-md' />
      </CardContent>
    </Card>
  )
}

function ClaimRequestManagementPendingLayout(props: { header: ReactNode }) {
  const { header } = props
  const { t } = useTranslate()

  return (
    <Main
      aria-busy='true'
      aria-live='polite'
      className='space-y-2 bg-transparent p-0 shadow-none sm:p-0'
    >
      <span className='sr-only' role='status'>
        {t('common.loading')}
      </span>
      {header}
      <ClaimRequestInfoListSkeleton />
      <div className='-mx-2 flex flex-wrap'>
        <div className='w-full px-2 md:w-1/2 lg:w-2/5'>
          <ClaimRequestAssessmentSkeleton />
        </div>
        <div className='w-full px-2 md:w-1/2 lg:w-3/5'>
          <ClaimRequestAttachmentsSkeleton />
        </div>
      </div>
    </Main>
  )
}

export function ClaimRequestManagementPending() {
  return (
    <ClaimRequestManagementPendingLayout
      header={<ClaimRequestHeaderSkeleton />}
    />
  )
}

export function ClaimRequestManagementPanelPending() {
  return (
    <ClaimRequestManagementPendingLayout
      header={<ClaimRequestPanelHeaderSkeleton />}
    />
  )
}
