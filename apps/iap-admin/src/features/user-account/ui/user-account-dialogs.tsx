import { UserAccountDeleteRowItem } from '@features/user-account/ui/user-account-delete-row-item'
import { UserAccountSpecialDiseaseDialog } from '@features/user-account/ui/user-account-special-disease-dialog'
import { UserAccountViewDialog } from '@features/user-account/ui/user-account-view-dialog'

export function UserAccountDialogs(props: { onSuccess: () => void }) {
  const { onSuccess } = props

  return (
    <>
      <UserAccountViewDialog />
      <UserAccountDeleteRowItem onSuccess={onSuccess} />
      <UserAccountSpecialDiseaseDialog />
    </>
  )
}
