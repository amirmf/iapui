import { AgreementCoverageApplsSection } from '@features/agreements/components/agreement-coverage-appls/agreement-coverage-appls-section'
import { AgreementCoverageInitializeDialog } from '@features/agreements/components/agreement-coverage-initialize-dialog'
import { AgreementDeleteMethodDialog } from '@features/agreements/components/agreement-delete-method-dialog'
import { AgreementFormDialog } from '@features/agreements/components/agreement-form-dialog'
import { AgreementPartyApplsContentPanel } from '@features/agreements/components/agreement-party-appls/agreement-party-appls-content-panel'
import { AgreementViewDialog } from '@features/agreements/components/agreement-view-dialog'
import { AgreementsSection } from '@features/agreements/components/agreements-section'
import { AgreementProvider } from '@features/agreements/context/provider/agreement-provider'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'

function AgreementsContent() {
  const selectedAgreement = useAgreementStore(
    (state) => state.selectedAgreement
  )

  return (
    <>
      <div className='flex flex-col gap-4 pb-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <AgreementsSection />
          <AgreementPartyApplsContentPanel />
        </div>
        <AgreementCoverageApplsSection
          agreementId={selectedAgreement[0]?.id ?? null}
        />
      </div>
      <AgreementFormDialog />
      <AgreementDeleteMethodDialog />
      <AgreementViewDialog />
      <AgreementCoverageInitializeDialog />
    </>
  )
}

export function AgreementsPage() {
  return (
    <AgreementProvider>
      <AgreementsContent />
    </AgreementProvider>
  )
}
