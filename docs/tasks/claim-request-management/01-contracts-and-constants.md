# CRM-01 — Contracts, constants and translations

Source `features/claim-requests/data/claim-request-schema.ts`, `services/claim-request-service.ts`, `constants/claim-status-constant.ts`. Target existing `packages/api-types/src/claim-request/index.ts`, feature service and `constants/claim-request-status.ts` already own list/read-only contracts. Compare rather than replace.

- [ ] Keep ClaimRequestBaseSchema field order/nested schemas exactly inspected. Main response documents use narrow loose claimDocumentSchema; editable `features/documents/data/document-schema.ts` is a different broad stripping schema. Do not conflate them.
- [ ] Add inspected assignment, objection, partial patch, history and mounted workflow contracts under public domain package entry points; request/response parsing at service boundary. User confirmed strict outgoing validation under current architecture.
- [ ] Inspect claim-status-constant.ts line by line: source status/AI maps, resolution maps, assess-type labels/colors, duplicate-type labels, validator labels, request type, IBAN and ordered options. Keep maps centralized and typed against inferred enum unions; translate options on call, not module evaluation. Existing target status/AI/request/IBAN maps and colors match the list audit; add only missing management maps.
- [ ] Inspect source assessment-items-constant.ts for mounted editing maps; do not merge unrelated domain constants into claim status.
- [ ] Extract literal and dynamic translation keys from entire mounted closure, compare target/source Persian leaf values, add only required missing values. Preserve source-absent fallback keys explicitly even when target happens to define them.
- [ ] Verify invalid/null/empty inputs, unknown-property parsed output, enum order and mappings, nested document/history contracts, HTTP method/path/body/query and cancellation.

Core GET `/claim-requests/{id}` is already implemented as canonical getById forwarding AbortSignal. Existing inquiry/doc-type/documents/assignment-me endpoints must preserve their current consumers. New operations must be recorded in owning bounded task documents before implementation.

## Constant assessment

Central enum-to-key maps are appropriate: one translation mapping per domain, static keys with runtime translation, exhaustive type checking, and source-preserved option order. Keep colors separate from translation keys but colocated by domain. Avoid storing translated labels globally and avoid duplicated inline maps. Completion evidence will record added maps and equality tests.
