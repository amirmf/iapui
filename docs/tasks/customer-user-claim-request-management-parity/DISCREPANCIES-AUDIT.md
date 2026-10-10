# Customer User Claim Request Management — Discrepancies & Line-by-Line Parity Audit

Target Page: `/customer-user/claim-requests/$claimRequestId/claim-request-management/`
Reference: `insurance-ui`
Target: `iap-admin` (Worktree: `.worktrees/customer-user-claim-request-management`, branch `codex/customer-user-claim-request-management`)

---

## 1. Route Entry Discrepancies (`index.tsx`)

| Aspect | Reference (`insurance-ui`) | Current Target (`iap-admin`) | Discrepancy & Resolution |
| --- | --- | --- | --- |
| Route File Path | `src/routes/customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx` | `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx` | Target uses standard pathless prefix `_customer-user` with flat `$claimRequestId.claim-request-management/index.tsx` as per `APPLICATION-ARCHITECTURE.md`. |
| `pendingComponent` | `ClaimRequestManagementPanelPending` | `ClaimRequestManagementPending` | **DISCREPANCY**: Reference uses `ClaimRequestManagementPanelPending` (header skeleton without action buttons), whereas target used `ClaimRequestManagementPending`. Must update to `ClaimRequestManagementPanelPending`. |
| Component Import | `import CustomerUserClaimRequestManagementPage from '@/features/customer-user/pages/customer-user-claim-request-management-page'` | `import { CustomerUserClaimRequestManagementPage } from '@features/customer-user'` | Target should support direct default import from `@features/customer-user/pages/customer-user-claim-request-management-page`. |
| `loader` | Query prefetch via `customerUserClaimRequestQueryOptions(params.claimRequestId)` with `staleTime: 'static'`, returns `{ crumb: 'claim-request-management' }` | Same | Aligned. |
| `errorComponent` | `({ error }) => <ClaimRequestManagementQueryError error={error} />` | Same | Aligned. |
| `pendingMs` / `pendingMinMs` | `200` / `200` | Same | Aligned. |

---

## 2. Page File Placement & Exports

| Aspect | Reference (`insurance-ui`) | Current Target (`iap-admin`) | Discrepancy & Resolution |
| --- | --- | --- | --- |
| File Path | `src/features/customer-user/pages/customer-user-claim-request-management-page.tsx` | `apps/iap-admin/src/features/customer-user/pages/claim-request-management/customer-user-claim-request-management-page.tsx` | **DISCREPANCY**: In reference, all customer-user pages are flat under `pages/` (`customer-user-dashboard-page.tsx`, `customer-user-claim-requests-page.tsx`, `customer-user-claim-request-management-page.tsx`). Move/mirror to `pages/customer-user-claim-request-management-page.tsx`. |
| Export Type | `export default function CustomerUserClaimRequestManagementPage()` | Named + default export | Provide `export default function CustomerUserClaimRequestManagementPage` with named export support. |

---

## 3. Missing Customer-User Components & Utilities in Feature

| Component / Utility | Reference Path | Current Target Path | Discrepancy & Resolution |
| --- | --- | --- | --- |
| `CustomerUserClaimRequestSummary` | `src/features/customer-user/components/customer-user-claim-request-summary.tsx` | *Missing* | **DISCREPANCY**: Component exists in reference `features/customer-user/components/`. Implement `customer-user-claim-request-summary.tsx` with identical schema and translations. |
| `customer-user-claim-routes.ts` | `src/features/customer-user/utils/customer-user-claim-routes.ts` | `pages/claim-requests/utils/customer-user-claim-routes.ts` | **DISCREPANCY**: Reference places routes under `features/customer-user/utils/`. Provide `utils/customer-user-claim-routes.ts` at feature root level. |
| `customer-user-import-boundary.test.ts` | `src/features/customer-user/customer-user-import-boundary.test.ts` | *Missing* | **DISCREPANCY**: Reference contains boundary test verifying zero cross-feature imports between `customer-user` and `agent-claim-requests`. Port boundary test. |

---

## 4. Line-by-Line Child Component Audit

| # | Reference Child Component | Sub-tree & Props | Target State | Parity Status |
| --- | --- | --- | --- | --- |
| 1 | `ClaimRequestLastStatusSection` | `statusHistory={claimRequest.statusHistory \|\| []}`, `status={claimRequest.status}`, `extPaymentDate={claimRequest.extPaymentDate}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-last-status-section.tsx` | 100% Match |
| 2 | `ClaimRequestAssignSection` | `claimRequest={claimRequest}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-assign-section.tsx` | 100% Match |
| 3 | `ClaimRequestInfoList` | `data={claimRequest}`, `refetch={refetch}`, `viewDetailsAdjustmentLink='/agent/claim-requests/$claimRequestId/claim-request-management'` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-info-list.tsx` | 100% Match |
| 4 | `ClaimRequestAssessmentItemsSection` | `claimRequest={claimRequest}`, `claimRequestId={claimRequestId}` | `@features/assessment-items` (`ClaimRequestAssessmentItemsSection`) | 100% Match |
| 5 | `ClaimRequestDoctorResponses` | `assignmentHistory={claimRequest.assignmentHistory}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-doctor-responses.tsx` | 100% Match |
| 6 | `ClaimRequestDuplicatedSection` | `claimRequest={claimRequest}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/duplicated/claim-request-duplicated-section.tsx` | 100% Match |
| 7 | `ClaimRequestManagementError` | `claimRequest={claimRequest}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-management-error.tsx` | 100% Match |
| 8 | `ClaimRequestObjectionSection` | `claimRequest={claimRequest}`, `claimRequestId={claimRequestId}`, `refetch={refetch}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-objection-section.tsx` | 100% Match |
| 9 | `ClaimRequestAttachmentsSection` | `attachments={filteredAttachements}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-attachments-section.tsx` | 100% Match |
| 10 | `ClaimRequestManagementPrevRequest` | `userId={claimRequest.createdBy}`, `claimRequestId={claimRequestId}`, `claimRequest={claimRequest}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-management-prev-request/index.tsx` | 100% Match |
| 11 | `ClaimRequestDocumentsSection` | `claimRequestId={claimRequestId}`, `documents={documents}` | `apps/iap-admin/src/features/claim-requests/pages/claim-request-management/components/claim-request-documents-section.tsx` | 100% Match |
