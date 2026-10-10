# Customer User Claim Request Management Parity — Implementation & Verification Tasks

Target: `/customer-user/claim-requests/$claimRequestId/claim-request-management/` in `iap-admin` (under `_customer-user` panel layout partition).
Reference: `insurance-ui/src/routes/customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx` and `insurance-ui/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx`.
Worktree: `.worktrees/customer-user-claim-request-management` from `main` (branch `codex/customer-user-claim-request-management`).
Status: **COMPLETED** (Verified with unit tests, typecheck, lint, architecture check, and production build).

## Task Index

1. [Task 01 — Route Parity and Pending Skeleton](TASK-01-ROUTE-PARITY-AND-PENDING-SKELETON.md)
2. [Task 02 — Page File Path and Exports](TASK-02-PAGE-FILE-PATH-AND-EXPORTS.md)
3. [Task 03 — Customer User Summary and Utils](TASK-03-CUSTOMER-USER-SUMMARY-AND-UTILS.md)
4. [Task 04 — Child Components Parity Audit](TASK-04-CHILD-COMPONENTS-PARITY-AUDIT.md)
5. [Task 05 — Boundary Test and Verification](TASK-05-BOUNDARY-TEST-AND-VERIFICATION.md)

## Parity Scope & Component Inventory

| Reference Component / Hook | Target File in `iap-admin` | Responsibility | Parity Status |
| --- | --- | --- | --- |
| `src/routes/customer-user/claim-requests/$claimRequestId/claim-request-management/index.tsx` | `apps/iap-admin/src/app/router/routes/_customer-user/customer-user/claim-requests/$claimRequestId.claim-request-management/index.tsx` | Route entry with query prefetching, `ClaimRequestManagementPanelPending`, error component, breadcrumb `claim-request-management` | Verified |
| `src/features/customer-user/hooks/use-customer-user-claim-request.ts` | `apps/iap-admin/src/features/customer-user/hooks/use-customer-user-claim-request.ts` | Query options and hook for fetching claim request by id via `claimRequestService.getById` with key `['customerUserClaimRequest', claimRequestId]` | Verified |
| `src/features/customer-user/pages/customer-user-claim-request-management-page.tsx` | `apps/iap-admin/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx` | Single-page management view composing status, assign, info list, assessment items, doctor responses, duplicates, errors, objections, attachments, history, documents | Verified |
| `src/features/customer-user/components/customer-user-claim-request-summary.tsx` | `apps/iap-admin/src/features/customer-user/components/customer-user-claim-request-summary.tsx` | Claim request summary card component | Verified |
| `src/features/customer-user/utils/customer-user-claim-routes.ts` | `apps/iap-admin/src/features/customer-user/utils/customer-user-claim-routes.ts` | Customer user claim route helpers | Verified |
| `src/features/claim-requests/components/claim-request-last-status-section.tsx` | `@features/claim-requests` (`ClaimRequestLastStatusSection`) | Status display badge with dialog trigger | Verified |
| `src/features/claim-requests/components/claim-request-assign-section.tsx` | `@features/claim-requests` (`ClaimRequestAssignSection`) | Assigned user badges (assigned user, main assessment user) | Verified |
| `src/features/claim-requests/components/claim-request-info-list.tsx` | `@features/claim-requests` (`ClaimRequestInfoList`) | Claim request metadata cards, mobile link, adjustment link | Verified |
| `src/features/claim-requests/components/claim-request-assessment-items-section.tsx` | `@features/assessment-items` (`ClaimRequestAssessmentItemsSection`) | Assessment items overview | Verified |
| `src/features/claim-requests/components/claim-request-doctor-responses.tsx` | `@features/claim-requests` (`ClaimRequestDoctorResponses`) | Responses from doctor user | Verified |
| `src/features/claim-requests/components/duplicated/claim-request-duplicated-section.tsx` | `@features/claim-requests` (`ClaimRequestDuplicatedSection`) | Duplicate claim request warnings with badge and image dialog | Verified |
| `src/features/claim-requests/components/claim-request-management-error.tsx` | `@features/claim-requests` (`ClaimRequestManagementError`) | Validation and Fanavaran error dialogues | Verified |
| `src/features/claim-requests/components/claim-request-objection-section.tsx` | `@features/claim-requests` (`ClaimRequestObjectionSection`) | Policyholder / expert objection chat & form | Verified |
| `src/features/claim-requests/components/claim-request-attachments-section.tsx` | `@features/claim-requests` (`ClaimRequestAttachmentsSection`) | Attachment file viewer section | Verified |
| `src/features/claim-requests/components/claim-request-management-prev-request/index.tsx` | `@features/claim-requests` (`ClaimRequestManagementPrevRequest`) | Previous requests history table by user id | Verified |
| `src/features/claim-requests/components/claim-request-documents-section.tsx` | `@features/claim-requests` (`ClaimRequestDocumentsSection`) | Documents list section | Verified |
| `src/features/claim-requests/components/claim-request-management-panel-pending.tsx` | `@features/claim-requests` (`ClaimRequestManagementPanelPending`) | Skeleton loading state without header buttons (panel mode) | Verified |
| `src/features/claim-requests/components/claim-request-management-query-error.tsx` | `@features/claim-requests` (`ClaimRequestManagementQueryError`) | Query error state | Verified |
| `src/features/customer-user/customer-user-import-boundary.test.ts` | `apps/iap-admin/src/features/customer-user/customer-user-import-boundary.test.ts` | Automated test guarding feature boundary between customer-user and agent-claim-requests | Verified |

## Verification Results

| Check | Command | Result |
| --- | --- | --- |
| Customer User Tests | `pnpm --filter iap-admin test src/features/customer-user` | 7 test files, 20 tests passed |
| Panel Routes Tests | `pnpm --filter iap-admin test src/shared/router/panel-routes.test.ts` | 1 test file, 12 tests passed |
| TypeScript Check | `pnpm --filter iap-admin typecheck` | 0 errors |
| ESLint | `pnpm --filter iap-admin lint` | 0 errors |
| Architecture Check | `pnpm architecture:check` | Architecture check passed (0 violations) |
| Production Build | `pnpm --filter iap-admin build` | Succeeded in ~24s |
