# TASK-10: Agreements Sub-Section

## Objective
Implement the right-side agreements panel (`SubUsersAgreementsSection`), its toolbar (`SubUsersAgreementsDataTableToolbar`), and two-line column definitions (`useSubUsersAgreementsColumns`).

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-users-agreements-section.tsx`
- `insurance-ui/src/features/sub-users/components/sub-users-agreements-data-table-toolbar.tsx`
- `insurance-ui/src/features/sub-users/components/sub-users-agreements-columns.tsx`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/components/sub-users-agreements-section.tsx`
2. `apps/iap-admin/src/features/sub-users/components/sub-users-agreements-data-table-toolbar.tsx`
3. `apps/iap-admin/src/features/sub-users/components/sub-users-agreements-columns.tsx`

## Detailed Specifications

### 1. Columns (`sub-users-agreements-columns.tsx`)
- Uses `TwoLineHeader` and `TwoLineCell` from `@shared/tables`:
  1. Primary: `extContractId`, Secondary: `extPolicyId`
  2. Primary: `title`, Secondary: `extLocation`
  3. Primary: formatted `fromDate`, Secondary: formatted `thruDate`

### 2. Toolbar (`sub-users-agreements-data-table-toolbar.tsx`)
- Uses `TableFilterState` from `@shared/tables`:
  - Text filters: `title`, `extContractId`, `extPolicyId`, `extLocation`
  - Date range filters: `thruDate` (with `fromPlaceholder` and `toPlaceholder`)

### 3. Section Component (`SubUsersAgreementsSection`)
- Manages local pagination and filter state via `useTableFilterState()`.
- Fetches agreements via `agreementService.getPage(...)`.
- Updates `useSubUsersAgreementsStore.selectedAgreement` when row selection changes.
- Header includes title `agreements.title` and refresh button.

## Acceptance Criteria
- [ ] Preserves two-line cell formatting and responsive column constraints.
- [ ] Keeps agreements filtering local so it does not collide with URL query params of sub-users table.
- [ ] Correctly forwards selected agreements to store for the bottom panel.
