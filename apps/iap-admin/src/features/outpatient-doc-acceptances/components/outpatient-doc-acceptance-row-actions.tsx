import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import type { OutpatientDocAcceptance } from '@iap/api-types'
import { Button } from '@iap/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@iap/ui'
import { IconDots as DotsHorizontalIcon } from '@tabler/icons-react'
import {
  IconBan,
  IconEdit,
  IconEye,
  IconFileText,
  IconLayersIntersect,
  IconSend,
  IconStethoscope,
  IconTrash,
} from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface Props {
  row: Row<OutpatientDocAcceptance>
}

export function OutpatientDocAcceptanceRowActions({ row }: Props) {
  const { t } = useTranslation()
  const { openDialog } = useOutpatientDocAcceptance()
  const docAcceptance = row.original

  const handleAction = (
    action:
      | 'view'
      | 'edit'
      | 'delete'
      | 'manageClaim'
      | 'viewClaim'
      | 'manageIssuance'
      | 'viewIssuance'
      | 'manageDmgCases'
      | 'send'
      | 'cancel'
      | 'terminate'
  ) => {
    openDialog(action, docAcceptance)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>{t('common.openMenu')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-55'>
        <DropdownMenuItem onClick={() => handleAction('view')}>
          <IconEye className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.viewDetails')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('edit')}>
          <IconEdit className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('manageClaim')}>
          <IconFileText className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.manageClaim')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('manageIssuance')}>
          <IconStethoscope className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.manageIssuance')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('manageDmgCases')}>
          <IconLayersIntersect className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.manageDamageCases')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('send')}>
          <IconSend className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.send')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('cancel')}>
          <IconBan className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.cancel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction('terminate')}>
          <IconBan className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.terminate')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction('delete')}
          className='text-destructive'
        >
          <IconTrash className='mr-2 h-4 w-4' />
          {t('outpatientDocAcceptances.actions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
