import type { SubUser } from '@iap/api-types'
import { TableActionButton, TableActions } from '@shared/tables'
import {
  IconArchiveOff,
  IconEdit,
  IconEye,
  IconUser,
  IconUserOff,
} from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSubUser } from '../context/sub-user-context'
import { subUserService } from '../services/sub-user-service'

interface SubUserRowActionsProps {
  row: Row<SubUser>
}

export function SubUserRowActions({ row }: SubUserRowActionsProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const setOpen = useSubUser((state) => state.setOpen)
  const setCurrentRow = useSubUser((state) => state.setCurrentRow)
  const user = row.original

  const { mutate: toggleUser } = useMutation({
    mutationFn: async (target: SubUser) => subUserService.disable(target.id),
    onSuccess: () => {
      toast.success(t('subUsers.messages.statusUpdateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['sub-users'] })
    },
  })

  const handleView = () => {
    setCurrentRow(user)
    setOpen('details')
  }

  const handleEdit = () => {
    setCurrentRow(user)
    setOpen('editor')
  }

  const handleReleaseAssignments = () => {
    setCurrentRow(user)
    setOpen('releaseAssignments')
  }

  return (
    <TableActions>
      <TableActionButton
        icon={<IconEye className='size-4' />}
        label={t('subUsers.actions.details')}
        onClick={handleView}
        tooltipText={t('subUsers.actions.details')}
      />
      <TableActionButton
        icon={<IconEdit className='size-4' />}
        label={t('subUsers.actions.edit')}
        onClick={handleEdit}
        tooltipText={t('subUsers.actions.edit')}
      />
      <TableActionButton
        icon={<IconArchiveOff className='size-4' />}
        label={t('subUsers.actions.releaseAssignments')}
        onClick={handleReleaseAssignments}
        tooltipText={t('subUsers.actions.releaseAssignments')}
        variant='destructive'
      />
      <TableActionButton
        icon={
          user.enabled ? (
            <IconUserOff className='size-4' />
          ) : (
            <IconUser className='size-4' />
          )
        }
        label={
          user.enabled
            ? t('subUsers.actions.disable')
            : t('subUsers.actions.enable')
        }
        onClick={() => {
          toggleUser(user)
        }}
        tooltipText={
          user.enabled
            ? t('subUsers.actions.disable')
            : t('subUsers.actions.enable')
        }
        variant='destructive'
      />
    </TableActions>
  )
}
