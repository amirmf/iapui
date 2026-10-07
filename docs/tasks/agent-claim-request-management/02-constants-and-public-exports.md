# Task 02: Constants and Public Exports

## Objective

1. Review and align constant definitions for status, duplicates, objection roles, and AI assessments between reference `src/constants/claim-status-constant.ts` and target constants.
2. Export shared claim-request-management subcomponents through `@features/claim-requests` public barrel (`apps/iap-admin/src/features/claim-requests/index.ts`) so that `@features/agent-claim-requests` can import them without architecture boundary violations.

## Constant Alignment

Reference `src/constants/claim-status-constant.ts`:
- Status colors & border colors: `claimStatusColors`, `claimStatusBorderColors`
- Translation keys: `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS`
- Duplicate type maps: `CLAIM_REQUEST_DUPLICATE_TYPE_TRANSLATION_KEYS`, `CLAIM_REQUEST_DUPLICATE_TYPE_BADGE_COLORS`, `CLAIM_REQUEST_DUPLICATE_TYPE_BOX_COLORS`
- Objection roles: `CLAIM_REQUEST_OBJECTION_ROLE_TYPE_TRANSLATION_KEYS`
- AI Assessment maps: `AI_ASSESSMENT_RESULT_RESOLUTION_TYPE_TRANSLATION_KEYS`, `AI_ASSESSMENT_RESULT_ASSESS_TYPE_TRANSLATION_KEYS`

Target files:
- `apps/iap-admin/src/features/agent-claim-requests/constants/agent-claim-request-constant.ts`: already defines `claimStatusColors`, `claimStatusBorderColors`, `CLAIM_REQUEST_STATUS_TRANSLATION_KEYS`, and `getClaimRequestStatusOptions`.
- `apps/iap-admin/src/features/claim-requests/model/claim-request-status.ts`: already defines duplicate, AI assessment, and objection status translation and color mappings.

## Public Barrel Exports from `@features/claim-requests`

To adhere to `APPLICATION-ARCHITECTURE.md` and `tools/check-architecture.mjs` (`feature-public-api-only` rule), add the following exports to `apps/iap-admin/src/features/claim-requests/index.ts`:

- `ClaimRequestLastStatusSection`
- `ClaimRequestAssignSection`
- `ClaimRequestInfoList`
- `ClaimRequestAssessmentItemsSection`
- `ClaimRequestDoctorResponses`
- `ClaimRequestDuplicatedSection`
- `ClaimRequestManagementError`
- `ClaimRequestObjectionSection`
- `ClaimRequestAttachmentsSection`
- `ClaimRequestManagementPrevRequest`
- `ClaimRequestDocumentsSection`
- `ClaimRequestManagementPanelPending`
- `ClaimRequestManagementQueryError` (already exported)
