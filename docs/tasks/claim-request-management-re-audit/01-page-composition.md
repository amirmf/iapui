# ClaimRequestManagementPage composition parity audit

Reference: `/home/sadegh/Android/project/insurance-ui/src/features/claim-requests/pages/claim-request-management-page.tsx`
Target: `/home/sadegh/.codex/worktrees/claim-request-management/iap-ui/apps/iap-admin/src/features/claim-requests/pages/claim-request-management/claim-request-management-page.tsx`

## Direct composition inventory

The mounted order and props are identical in the loading, query-error, header action row, information list, two-column card/attachments layout, previous request conditional, and documents section. The target preserves the reference component names and uses the target architecture's feature page component paths and public UI/layout imports.

| Reference mounted component | Target mounted component | Result |
|---|---|---|
| `ClaimRequestManagementPending` | `ClaimRequestManagementPending` | exact |
| `ClaimRequestManagementQueryError(error)` | `ClaimRequestManagementQueryError(error)` | exact |
| `ClaimRequestLastStatusSection` | same | exact |
| `ClaimRequestAssignSection` | same | exact |
| `ClaimRequestRegisteredByAgentSection` | same | exact |
| `ClaimRequestQuickButtons` | same | exact |
| `ClaimRequestInfoList(refetch, data, viewDetailsAdjustmentLink)` | same props; URL slash differed | fixed below |
| `ClaimRequestAssessmentItemsSection` | same | exact |
| `ClaimRequestDoctorResponses` | same | exact |
| `ClaimRequestReviewSwitcherSection` | same | exact |
| `ClaimRequestManagementError` | same | exact |
| `ClaimRequestObjectionSection` | same | exact |
| `ClaimRequestManagementActionBtn` | same | exact |
| `ClaimRequestAttachmentsSection` | same | exact |
| `ClaimRequestManagementPrevRequest` conditional on `createdBy` | same | exact |
| `ClaimRequestDocumentsSection` | same | exact |

## Verified behavior details

- `useParams` route source string matches the reference route.
- Loading and error branch ordering matches the reference.
- Documents and attachments are guarded with `Array.isArray`.
- Header and body class names, card width classes, and child ordering match.
- The reference's commented-out `ClaimRequestStatusHistorySection` is non-rendering source commentary and is intentionally not a target behavior.
- Target removes reference-only document/attachment type assertions because target API schemas already expose the validated arrays; this does not change runtime composition.

## Discrepancy fixed

The target passed `/claim-requests/$claimRequestId/claim-request-management/` (with trailing slash) to `ClaimRequestInfoList.viewDetailsAdjustmentLink`, while the reference passes `/claim-requests/$claimRequestId/claim-request-management` (without trailing slash). The target now uses the exact reference string.

Completion criteria: direct mounted component names, order, conditional branches, props, class composition, and reference URL value match; target ownership/import boundaries remain architecture-compliant.

## Target router typing note

The target router's generated `Link` contract only accepts canonical trailing-slash route literals. The reference's no-slash value is retained at runtime and supplied with a narrow literal assertion at this page boundary so the generated route type remains satisfied; no target component behavior is changed.
