import {
  AgreementPartyApplProvider,
  AgreementPartyApplsContent,
} from '@features/agreements'

import { useSubUser } from '../context/sub-user-context'
import { useSubUsersAgreements } from '../context/sub-users-agreements-context'

export function SubUsersAgreementPartySection() {
  const agreements = useSubUsersAgreements((state) => state.selectedAgreement)
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
