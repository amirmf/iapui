import {
  AgreementPartyApplProvider,
  AgreementPartyApplsContent,
} from '@features/agreements'

import { useSubUser } from '../context/store/sub-user-store'
import { useSubUsersAgreementsStore } from '../context/store/sub-users-agreements-store'

export function SubUsersAgreementPartySection() {
  const agreements = useSubUsersAgreementsStore(
    (state) => state.selectedAgreement
  )
  const userAccounts = useSubUser((state) => state.selectedUserAccount)

  return (
    <AgreementPartyApplProvider>
      <AgreementPartyApplsContent
        agreements={agreements}
        tableWrapperClassName='max-h-70'
        userAccounts={userAccounts}
      />
    </AgreementPartyApplProvider>
  )
}
