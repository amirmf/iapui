import { SubUserDetailsDialog } from './components/sub-user-details-dialog'
import { SubUserFormDialog } from './components/sub-user-form-dialog'
import { SubUserReleaseAssignmentsDialog } from './components/sub-user-release-assignments-dialog'
import { SubUserSection } from './components/sub-user-section'
import { SubUsersAgreementPartySection } from './components/sub-users-agreement-party-section'
import { SubUsersAgreementsSection } from './components/sub-users-agreements-section'
import { SubUserProvider } from './context/provider/sub-user-provider'
import { SubUsersAgreementsProvider } from './context/provider/sub-users-agreements-provider'

function SubUsersContent() {
  return (
    <>
      <div className='flex flex-col sm:flex-row'>
        <div className='flex h-full w-full sm:w-1/2 sm:px-2'>
          <SubUserSection />
        </div>

        <SubUsersAgreementsProvider>
          <div className='my-4 w-full sm:my-0 sm:w-1/2 sm:px-2'>
            <SubUsersAgreementsSection />
          </div>
        </SubUsersAgreementsProvider>
      </div>

      <div className='pb-5'>
        <SubUsersAgreementPartySection />
      </div>

      <SubUserDetailsDialog />
      <SubUserFormDialog />
      <SubUserReleaseAssignmentsDialog />
    </>
  )
}

export function SubUsersPage() {
  return (
    <SubUserProvider>
      <SubUsersContent />
    </SubUserProvider>
  )
}

export default SubUsersPage
