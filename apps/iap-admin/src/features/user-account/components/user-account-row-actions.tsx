import { useUserAccountStore } from '@features/user-account/context/store/user-account-store'
import { userAccountService } from '@features/user-account/services/user-account-service'
import type { UserAccount } from '@iap/api-types'
import { isAdminRole, useAuthSession } from '@iap/auth'
import { Permission } from '@iap/ui'
import { AuditInformationRowAction } from '@shared/dialogs/audit-information'
import { useTranslate } from '@shared/i18n/i18n'
import { TableActionButton, TableActions } from '@shared/tables'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, List, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function UserAccountRowActions(props: { user: UserAccount }) {
  const { user } = props
  const { t } = useTranslate()
  const { user: authenticatedUser } = useAuthSession()
  const openDialog = useUserAccountStore((state) => state.openDialog)
  const queryClient = useQueryClient()
  const refreshSnapshotMutation = useMutation({
    mutationFn: () => userAccountService.refreshSnapshot(user.id),
    onSuccess: () => {
      toast.success(t('parties.userAccount.messages.fanavaranInquerySuccess'))
      void queryClient.invalidateQueries({ queryKey: ['user-account'] })
    },
  })
  return (
    <TableActions>
      <TableActionButton
        icon={<Eye aria-hidden='true' className='size-4' />}
        label={t('parties.actions.viewDetails')}
        onClick={() => openDialog('view', user)}
        tooltipText={t('parties.actions.viewDetails')}
      />
      <TableActionButton
        icon={<Pencil aria-hidden='true' className='size-4' />}
        label={t('parties.actions.manageUserAccount')}
        onClick={() => openDialog('userAccount', user)}
        tooltipText={t('parties.actions.manageUserAccount')}
      />
      <TableActionButton
        icon={<List aria-hidden='true' className='size-4' />}
        label={t('parties.actions.specialDiseases')}
        onClick={() => openDialog('specialDiseases', user)}
        tooltipText={t('parties.actions.specialDiseases')}
      />
      <TableActionButton
        disabled={refreshSnapshotMutation.isPending}
        icon={<RefreshCw aria-hidden='true' className='size-4' />}
        label={t('parties.actions.fanavaranInquery')}
        onClick={() => refreshSnapshotMutation.mutate()}
        tooltipText={t('parties.actions.fanavaranInquery')}
      />
      <Permission hasPermission={isAdminRole(authenticatedUser?.roles ?? [])}>
        <TableActionButton
          icon={<Trash2 aria-hidden='true' className='size-4' />}
          label={t('parties.actions.delete')}
          onClick={() => openDialog('delete', user)}
          tooltipText={t('parties.actions.delete')}
          variant='destructive'
        />
      </Permission>
      <AuditInformationRowAction row={user} />
    </TableActions>
  )
}
