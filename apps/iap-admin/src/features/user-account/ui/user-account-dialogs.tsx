import { UserAccountDeleteRowItem } from './user-account-delete-row-item'
import { UserAccountSpecialDiseaseDialog } from './user-account-special-disease-dialog'
import { UserAccountViewDialog } from './user-account-view-dialog'

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
