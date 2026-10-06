import { useMemo } from 'react'

import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { agreementPartyApplService } from '@features/agreements/services/agreement-party-appl-service'
import type { Agreement, UserAccount } from '@iap/api-types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function AgreementPartyApplBulkCreateDialog(props: {
  agreements: Agreement[]
  refetch: () => void
  userAccounts: UserAccount[]
}) {
  const { agreements, refetch, userAccounts } = props
  const { t } = useTranslate()
  const openDialog = useAgreementPartyApplStore((state) => state.openDialog)
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )
  const setRowSelection = useAgreementPartyApplStore(
    (state) => state.setRowSelection
  )
  const agreementIds = useMemo(
    () =>
      agreements.flatMap((agreement) => (agreement.id ? [agreement.id] : [])),
    [agreements]
  )
  const userAccountIds = useMemo(
    () => userAccounts.map((user) => user.id),
    [userAccounts]
  )
  const mutation = useMutation({
    mutationFn: () =>
      agreementPartyApplService.bulkCreatePartyApplications({
        agreementIds,
        docTypeCodes: [],
        userAccountIds,
      }),
    onSuccess: () => {
      toast.success(
        t('agreements.partyAppls.bulkCreate.success' as never, {
          defaultValue: 'Party applications were created successfully.',
        })
      )
      refetch()
      setOpenDialog(null)
      setRowSelection({})
    },
  })
  const canSubmit = agreementIds.length > 0 && userAccountIds.length > 0

  return (
    <Dialog
      onOpenChange={(open) => !open && setOpenDialog(null)}
      open={openDialog === 'bulkCreate'}
    >
      <DialogContent className='sm:max-w-2xl' presentation='reference'>
        <DialogHeader>
          <DialogTitle>
            {t('agreements.partyAppls.bulkCreate.title' as never)}
          </DialogTitle>
          <DialogDescription>
            {t('agreements.partyAppls.bulkCreate.description' as never)}
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <BulkCreateList
            emptyLabel={t(
              'agreements.partyAppls.bulkCreate.noResults' as never
            )}
            headerLeft={t(
              'agreements.partyAppls.bulkCreate.agreementTitle' as never
            )}
            headerRight={t(
              'agreements.partyAppls.bulkCreate.extContractId' as never
            )}
            items={agreements.map((agreement) => ({
              id: agreement.id ?? '',
              left: agreement.title ?? '',
              right: String(agreement.extContractId ?? ''),
            }))}
            title={t(
              'agreements.partyAppls.bulkCreate.selectedAgreements' as never
            )}
          />
          <BulkCreateList
            emptyLabel={t(
              'agreements.partyAppls.bulkCreate.noResults' as never
            )}
            headerLeft={t(
              'agreements.partyAppls.bulkCreate.displayName' as never
            )}
            headerRight={t(
              'agreements.partyAppls.bulkCreate.username' as never
            )}
            items={userAccounts.map((user) => ({
              id: user.id,
              left: user.displayName ?? '',
              right: user.username,
            }))}
            title={t('agreements.partyAppls.bulkCreate.user' as never)}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            onClick={() => setOpenDialog(null)}
            type='button'
            variant='outline'
          >
            {t('common.cancel')}
          </Button>
          <Button
            disabled={!canSubmit || mutation.isPending}
            onClick={() => {
              if (canSubmit && !mutation.isPending) mutation.mutate()
            }}
            type='button'
          >
            {t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BulkCreateList(props: {
  emptyLabel: string
  headerLeft: string
  headerRight: string
  items: { id: string; left: string; right: string }[]
  title: string
}) {
  const { emptyLabel, headerLeft, headerRight, items, title } = props
  return (
    <div className='space-y-2'>
      <p className='text-sm font-medium'>{title}</p>
      <div className='rounded-md border p-2'>
        <div className='mb-2 flex items-center justify-between border-b px-2 pb-2'>
          <p className='text-xs font-semibold text-gray-600'>{headerLeft}</p>
          <p className='text-xs font-semibold text-gray-600'>{headerRight}</p>
        </div>
        <div className='max-h-36 space-y-1 overflow-auto'>
          {items.length ? (
            items.map((item) => (
              <div
                className='flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted'
                key={item.id}
              >
                <p className='font-medium'>{item.left}</p>
                <p className='text-xs font-medium text-muted-foreground'>
                  {item.right}
                </p>
              </div>
            ))
          ) : (
            <p className='p-2 text-sm text-muted-foreground'>{emptyLabel}</p>
          )}
        </div>
      </div>
    </div>
  )
}
