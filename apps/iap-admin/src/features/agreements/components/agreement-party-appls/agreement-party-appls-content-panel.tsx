import { AgreementPartyApplsContent } from '@features/agreements/components/agreement-party-appls/agreement-party-appls-content'
import { AgreementPartyApplProvider } from '@features/agreements/context/provider/agreement-party-appl-provider'
import { useAgreementStore } from '@features/agreements/context/store/agreement-store'

export function AgreementPartyApplsContentPanel() {
  const agreements = useAgreementStore((state) => state.selectedAgreement)

  return (
    <AgreementPartyApplProvider>
      <AgreementPartyApplsContent
        agreements={agreements}
        userAccounts={[]}
        hasCreateButton
        hasSmallPagination
        tableWrapperClassName='max-h-85'
      />
    </AgreementPartyApplProvider>
  )
}
