# Task 03 — header actions and columns components

## Objective
Implement focused, small presentation components for customer user claim request header actions and table columns matching reference line-by-line.

## Execution details
1. **`CustomerUserClaimRequestHeaderActions`**:
   - Location: `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-header-actions.tsx`
   - Parity with `insurance-ui/src/features/customer-user/components/customer-user-claim-request-header-actions.tsx`:
     - Props: `isLoading: boolean`, `onRefetch: () => Promise<unknown> | void`, `filters: ApiFilterParams`
     - Components:
       - `ClaimRequestExportExcelButton` from `@features/claim-requests` with `filters`
       - `Button` from `@iap/ui` (variant `outline`) with `IconRefresh` from `@tabler/icons-react` (spinning when `isLoading` is true) and `{t('claimRequests.refresh')}`
     - Layout: flex row with wrap, `gap-2`.

2. **`useCustomerUserClaimRequestColumns`**:
   - Location: `apps/iap-admin/src/features/customer-user/pages/claim-requests/components/customer-user-claim-request-columns.tsx`
   - Parity with `insurance-ui/src/features/customer-user/components/customer-user-claim-request-columns.tsx`:
     - Returns `ColumnDef<ClaimRequest>[]`
     - Columns:
       1. `extNationalCode`: TwoLineHeader (`extNationalCode` / `extMainNationalCode`), TwoLineCell with primary national code and secondary main national code. Wrapped in Link to management page if `id` exists.
       2. `extDisplayName`: TwoLineHeader (`extDisplayName` / `extCustomerName`), TwoLineCell, `longText`.
       3. `businessKey`: TwoLineHeader (`businessKey` / `extPolicyId`), TwoLineCell.
       4. `docType.id`: accessor function checking `docType` or `documents`, TwoLineHeader (`docType` / `extPlanCaption`), TwoLineCell, `longText`.
       5. `amount`: TwoLineHeader (`amount` / `totalSumAmount`), TwoLineCell with `toLocaleString('en-US')`.
       6. `status`: TwoLineHeader (`status` / `aiStatus`), cell rendering status Badge and AI status Badge (if present) with color maps from constants. `enableSorting: false`.
       7. `submitDate`: TwoLineHeader (`submitDate` / `createdAt`), TwoLineCell with `formatDate` and `formatDateTime`.
       8. `latestAssignementDisplayName`: TwoLineHeader (`latestAssignementDisplayName` / `assessedAt`), TwoLineCell, `longTextPrimary`.
       9. `extPolicyId`: TwoLineHeader (`extPolicyId` / `extContractId`), TwoLineCell.
       10. `extWorkUnitName`: TwoLineHeader (`extWorkUnitName` / `isReturn`), TwoLineCell with yes/no translation, `longTextPrimary`.
