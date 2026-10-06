import { useAgreementPartyApplStore } from '@features/agreements/context/store/agreement-party-appl-store'
import { Button, cn } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import {
  IconPlus,
  IconRefresh,
  IconStack2,
  IconTrash,
} from '@tabler/icons-react'

export function AgreementPartyApplsActions(props: {
  createDisabled: boolean
  hasCreateButton?: boolean
  isBulkCreateDisabled?: boolean
  isFetching: boolean
  onRefetch: () => void
}) {
  const {
    createDisabled,
    hasCreateButton,
    isBulkCreateDisabled = false,
    isFetching,
    onRefetch,
  } = props
  const { t } = useTranslate()
  const rowSelection = useAgreementPartyApplStore((state) => state.rowSelection)
  const setOpenDialog = useAgreementPartyApplStore(
    (state) => state.setOpenDialog
  )

  return (
    <div className='flex flex-wrap gap-2'>
      <Button
        className='space-x-2 text-destructive'
        disabled={Object.keys(rowSelection).length === 0}
        onClick={() => setOpenDialog('deleteMethod')}
        variant='outline'
      >
        <IconTrash aria-hidden='true' size={18} />
        {t('common.delete')}
      </Button>
      <Button
        className='space-x-2'
        disabled={isFetching}
        onClick={onRefetch}
        variant='outline'
      >
        <IconRefresh
          aria-hidden='true'
          className={cn('size-[18px]', isFetching && 'animate-spin')}
        />
        {t('common.refresh')}
      </Button>
      <Button
        className='space-x-2'
        disabled={isBulkCreateDisabled}
        onClick={() => setOpenDialog('bulkCreate')}
        variant='secondary'
      >
        <IconStack2 aria-hidden='true' size={18} />
        {t('agreements.partyAppls.bulkCreate.bulkCreateTitleBtn' as never)}
      </Button>
      {hasCreateButton ? (
        <Button
          className='space-x-2'
          disabled={createDisabled}
          onClick={() => setOpenDialog('create')}
        >
          <IconPlus aria-hidden='true' size={18} />
          {t('agreements.partyAppls.add' as never)}
        </Button>
      ) : null}
    </div>
  )
}
