# 04 — API contracts and locale closure

## Source evidence

Reference root: `/home/sadegh/Android/project/insurance-ui`.

Compared `src/features/agent-claim-requests/services/agent-claim-request-service.ts`, `data/agent-claim-request-service-schema.ts`, `src/features/claim-requests/data/claim-request-schema.ts`, `src/features/files/data/attachment-schema.ts`, `src/features/doc-types/data/doc-type-schema.ts`, `src/features/documents/data/document-schema.ts`, and `src/features/my-iap/claim-requests/data/my-claim-request-objection-schema.ts` against their target package/feature owners.

## Proven discrepancies and tasks

- [x] Restore `registeryAgentAddObjectionRequestSchema` unknown-key retention: source `.loose()`, target `.strict()`. Latest explicit exact-schema request authorizes this endpoint-scoped exception. Do not change other request schemas.
- [x] Preserve the exact source `z.any()` value schemas in full-claim document extraction and `expert_info_addon` rather than substituting `z.unknown()`.
- [x] Expand the source-extracted locale fixture through the mounted file viewer/uploader closure, including status constants and source-absent keys with literal fallbacks.
- [x] Verify nested response retention/stripping, invalid issue arrays, optional/null/empty values and API request placement.

## Verified equal / accepted architecture adaptations

`getById` and `submitObjection` have identical method, URL, body position, response parsing and signal forwarding. Form description trim/minimum and attachment nonempty validation match source; field declaration order matches.

Full response closure includes external doctor, status history, assignment history, sub-insured person, claim documents, objection role enum/objects, assessment resolution/assess enums/results, duplicate enum/detail/objects, attachment, document type and special disease enum. Fields and declaration order match source. Nullish response syntax is an accepted architecture modernization with identical acceptance. Full request schema strips unknown fields; attachments, claim documents, objections, document types retain unknown fields; assessment/duplicate/sub-insured objects strip them. Editable `documentSchema` is distinct from `claimDocumentSchema` and matches the reference.

The package status/AI-status schemas are Zod enums rather than callable translation factories; mounted response parsing uses the same enum order, values and untranslated errors as source `claimRequestStatusSchema()` / `claimRequestAiStatusSchema()`. Keep this public package representation to avoid unrelated shared-consumer changes; canonical response/request/document/attachment export names are present.

Paginated `content` remains nullish per the accepted workspace rule; pagination is not mounted on this page. Shared ownership/public imports remain mandatory.

## Verification

Focused verification passed: 17 tests across the service/contracts, locale fixture and agent constant suites. `git diff --check` passed. Integration typecheck/lint/build are recorded by the parent re-audit task.

The locale fixture now contains 62 reference-extracted values (previously 24), covering every mounted file translation and all 17 status labels. All values already match target Persian locale exactly. There are no source-absent translation keys in this inspected closure; interpolated progress/filename values use the same namespace and source keys.

`CLAIM_REQUEST_STATUS_TRANSLATION_KEYS` and `claimStatusBorderColors` preserve the reference enumeration order. `claimStatusColors` preserves all 17 token sets; the target formatter sorts CSS tokens and the backing object keys, which has no visible effect because this page performs only indexed lookup. Centralized agent re-exports prevent duplicate enum dictionaries and preserve canonical names.

No screenshot or live backend evidence is claimed here.
