# Task 02 — Contracts, constants and translation evidence

## Sources and ownership

Reference: `insurance-ui/src/features/claim-requests/data/{claim-request-schema,core-ai-schema,claim-request-document-receipt-schema}.ts`, `services/{claim-request-service,core-ai-service}.ts`, `src/constants/{claim-status,person-special-diseases}-constant.ts`, and `src/locales/fa.json`.
Target: `packages/api-types/src/claim-request/`, feature `services/`, `constants/`, `model/`, and application locale. Management-only endpoints and translations are excluded from this single-page scope.

## Verified discrepancies and tasks

- [x] Replace the nested-schema parity test's target dependency substitution with execution of the actual reference doc-type, attachment and special-disease modules. The previous test could hide a nested dependency discrepancy. Compare nested field shape, invalid inputs, stripping and retained properties against independent source definitions.
- [x] Extend translation verification to source-driven mounted claim-page components, rather than extracting only keys already implemented in the target. Exclude management components reachable through broad barrels: import reachability alone does not prove mounting.

- [x] Add the mounted ticket inspector contracts/services absent from target: `getSubInsuredPeople` GET `/claim-requests/{id}/sub-insured-people`, and `getAfterCalculationResult` POST `/claim-requests/get-after-calculation-result` with `{claimRequestId, assessmentItemId?}` and `DmgCase[]` response. Copy the mounted detail/adjustment/Fanavaran translation branches verbatim. Existing `dmgCaseSchema` is reusable and has the same fields. Restored missing assessment-item `claimRequestAdjustment`, `overrideInsuredPersonId`, `toothType` and `jaw`, with the exact source adjustment enum, nested fields and order; copied tooth-assessment and float-coverage translations.

## Explicit retained architecture adaptations

These are concrete differences, not claims of byte-identical schema parity. Existing architecture requires strict outgoing object schemas, package-owned contracts, and shared page factories. Existing decisions retain these conventions:

1. Source page metadata (`totalElements`, `totalPages`, `size`, `number`, `first`, `last`, `numberOfElements`, `empty`) is required; target factory permits null/undefined metadata. Content/item validation is equivalent. Exact metadata acceptance remains an architecture exception.
2. Source bulk-objection, status-assignment and claim doc-type update requests retain unknown keys (`loose`); target requests reject unknown keys (`strict`). Source assign-new strips unknown keys; target rejects them. Core-AI source strips unknown request keys; target rejects them. Normal mounted UI payloads contain only documented keys.
3. Source `claimRequestStatusSchema(t?)` and `claimRequestAiStatusSchema(t?)` are translated factories. Package contracts are static enums; feature form factories supply translated validation. Enum order and values match.
4. Claim doc-type update source export is `updateDocTypeRequestSchema` / `UpdateDocTypeRequest`, colliding with the existing doc-type-domain public export. Target uses domain-qualified exports. Source-compatible names cannot both occupy the same flat package public namespace.
5. `.nullish()` replaces `.nullable().optional()`; `.loose()` replaces deprecated `.passthrough()`; `z.unknown()` replaces record `z.any()`. These preserve source acceptance/output for the inspected fields.
6. Services validate outgoing/incoming transport in accordance with architecture; source Excel returns data without Blob validation, whereas target validates Blob. Source void endpoints ignore response data; target parses an unknown-to-undefined response contract.

## Confirmed equivalent transport and constants

GET page-lite, Excel and document-receipt paths/query placement; GET detail; POST assign-to-me, assign-to-me/status, assign-new query params, objections-bulk body, Fanavaran IDs body, generate-and-send IDs query; DELETE single and bulk IDs body; POST Core-AI bulk path and trimmed payload fields match the reference. Reference service aliases (`getPageLite`, `getById`, `submitObjectionsBulk`, `exportDocumentReceipt`) are exposed.

Status/AI/request-type/IBAN translation mappings and disease mapping/order are centralized. Keeping translation keys in constants rather than eagerly translated values preserves host-language updates and keeps reusable package schemas independent of application locale. Source-absent `actions.view` and `messages.docTypeUpdateFailed` remain literal-key fallbacks.

## Evidence

Verified: 4 focused files / 14 tests pass (independent nested claim/assessment source schemas, source-driven list translation keys, services including inspector requests and invalid responses). Scoped service/model lint passes; `git diff --check` passes. Full integrated typecheck and remaining mounted ticket UI translation coverage are verified by the parent integration task. This task contains source/contract evidence only, not browser or live-backend evidence.
