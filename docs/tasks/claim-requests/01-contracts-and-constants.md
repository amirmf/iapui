# CRP-2026-01 — Contracts and enum constants

Evidence: reference features/claim-requests/data/claim-request-schema.ts, claim-request-document-receipt-schema.ts, services/claim-request-service.ts, services/core-ai-service.ts, constants/claim-status-constant.ts, constants/person-special-diseases-constant.ts. Target packages/api-types/src/claim-request/index.ts and features/claim-requests/constants/claim-request-status.ts.

- [x] Fix specialDiseases: reference is nullish array of PersonSpecialDiseasesEnum, target incorrectly accepts object arrays. Reuse existing person-special-disease enum public contract.
- [x] Compare attachments (filename,fileType,fileSize,uploadDate,minioObjectName,bucketName required), document dataJsonSchema (string), extractedData (record), full docType response fields, nested AI/duplicate objects. Exact source response stripping/retention and field/issue order are verified; strict request objects/common pagination remain architecture adaptations documented below.
- [x] Preserve canonical mounted constant names, key values and option order. Source status options: SUBMITTED,IN_REVIEW,IN_ASSESSMENT,DELEGATED,DEDICATED_TO_USER,APPROVED,REJECTED,FAILED_FETCH_API,SENT,SENT_FAILED,PAID,TERMINATED,RETURN,PAYMENT_REJECTED,PAYMENT_RETURN,PAYMENT_RETURN_RESEND,DELETED. AI options: APPROVED,RETURN,REVIEW_REQUIRED,REVIEW_REQUIRED_SUBMIT_INFO_DUPLICATED,REVIEW_REQUIRED_IMAGE_DUPLICATED,REVIEW_REQUIRED_IMAGE_DIGITALLY_EDITED,RETURN_NO_COVERAGE,RETURN_MAX_CEILING,REJECT. Request MAIN,ADJUSTMENT; IBAN Y,N.
- [x] Keep enum translations centralized in feature constants; reusable disease presentation belongs to an application module if shared. Never store translated labels at module evaluation time.
- [x] Verify actual enum arrays, invalid values, nested fields and constant mapping equality against reference. Preserve existing consumers through deliberate compatibility exports if necessary.

API list evidence: GET /claim-requests/page-lite; POST /claim-requests/{id}/assignments/me; POST /claim-requests/{id}/assignments/me/status; POST /claim-requests/doc-type; DELETE /claim-requests/{id}; DELETE /claim-requests/bulk-delete (body array); POST /claim-requests/objections-bulk; POST /core-ai/workflows/data-extraction/start/bulk; POST /outpatient-doc-acceptances/generate-and-send-bulk (query claimRequestIds); POST /claim-requests/policy-details/bulk (body claimRequestIds); POST /claim-requests/{id}/status-change-notifications; GET /claim-requests/page-lite/excel. Canonical source service names include getPageLite/getById/submitObjectionsBulk/bulkStartDataExtractionWorkflow; existing target aliases must not imply different endpoint semantics.

## Final mounted contract audit

The final audit ports `ClaimRequestBaseSchema` field order and nested contracts from
`insurance-ui/src/features/claim-requests/data/claim-request-schema.ts`. Top-level
claims, AI assessment results, duplicate groups/details, and sub-insured people
strip unknown fields; doctor, assignment/status/objection history, documents,
attachments and document types retain them as the source does. Shared attachment
and document-type schemas were inspected field by field and already match.
Canonical response/list/document/request names and source bulk-objection/new-
assignment request names are exported with existing domain aliases retained.
The reference's `updateDocTypeRequestSchema` collides with the existing document-
type public contract, so the claim operation deliberately keeps
`updateClaimRequestDocTypeRequestSchema`.

Architecture adaptations remain explicit: requests are strict objects, request
and response pagination use the common factories, `.nullish()` replaces equivalent
nullable/optional chains, `.loose()` replaces passthrough, and record values use
`z.unknown()` instead of `z.any()` without changing accepted values. Common page
metadata remains nullable/optional by the accepted architecture convention.
API status/AI enums remain static package schemas so they do not depend on application i18next types; translated form enum factories remain feature-owned and preserve source translated errors.
Non-reference ID/array minimum and trimming constraints have been removed; source
Core AI schema messages, workflow trimming and service sanitization are preserved.

The canonical service methods are `getPageLite`, `getById`,
`submitObjectionsBulk`, `exportDocumentReceipt`, and
`coreAiService.bulkStartDataExtractionWorkflow`. Existing method aliases retain
consumer compatibility. Excel export now accepts the source `{ filters, signal }`
options and validates the Blob. All mounted endpoint responses are parsed,
including no-content mutations through the explicit void response contract.

Verification: service/receipt tests pass (6 tests); claim-request plus affected
Formio tests pass (13 files, 42 tests), including the runtime reference schema,
Persian locale, and enum mapping comparisons. Run reference-dependent tests with
`INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui`. API-types
package typecheck, affected service lint, and `git diff --check` pass. Application typecheck also passes after the canonical Excel caller integration. Parent integration repeats workspace checks over the final combined changes.

Final verification: complete admin suite passed (193 files / 549 tests); shared UI passed 58 tests and forms passed 11 tests. After the final memoization/URL-adapter edit, 24 affected files / 71 tests passed, including three new URL transition tests. Workspace typecheck, lint and architecture checks passed; final affected-file lint and git diff --check passed. Source/automated coverage only; no browser screenshots or live backend check.
