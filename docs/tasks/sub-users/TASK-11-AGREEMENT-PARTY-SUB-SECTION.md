# TASK-11: Agreement Party Sub-Section

## Objective
Implement `SubUsersAgreementPartySection` connecting the selected sub-users from the left panel and selected agreements from the right panel to the shared agreement-party applications grid.

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-users-agreement-party-section.tsx`
- `insurance-ui/src/features/agreements/pages/agreement-party-appls-page.tsx`

## Implementation Target
- `apps/iap-admin/src/features/sub-users/components/sub-users-agreement-party-section.tsx`
- Export `AgreementPartyApplsContent` and `AgreementPartyApplProvider` from `apps/iap-admin/src/features/agreements/index.ts`

## Detailed Specifications
- Reads `agreements` from `useSubUsersAgreementsStore((state) => state.selectedAgreement)`.
- Reads `userAccounts` from `useSubUserStore((state) => state.selectedUserAccount)`.
- Composes:
  ```tsx
  <AgreementPartyApplProvider>
    <AgreementPartyApplsContent
      agreements={agreements}
      userAccounts={userAccounts}
      tableWrapperClassName='max-h-70'
    />
  </AgreementPartyApplProvider>
  ```

## Acceptance Criteria
- [ ] Correctly forwards selected agreements and user accounts.
- [ ] Clean isolation: table actions and selections inside agreement-party applications remain scoped to their provider.
- [ ] No layout breaks or overflow issues with `max-h-70`.
