# My Claims: API and schema contracts

Status: implemented; focused contract tests and API-types typecheck passed. Full integration checks are recorded by the page task.

## Verified sources

- `insurance-ui/src/features/my-iap/claim-requests/services/my-claim-request-service.ts`: `getPage`, `delete`.
- `insurance-ui/src/features/my-iap/claim-requests/data/my-claim-request-schema.ts`: re-exports shared `claimRequestSchema` and `pageClaimRequestSchema`; create-form schema is outside this single-page scope.
- `insurance-ui/src/features/claim-requests/data/claim-request-schema.ts`: complete response closure.
- `insurance-ui/src/features/my-iap/claim-requests/data/sub-insured-person-schema.ts`.
- Existing `packages/api-types/src/insurance-policy/index.ts` policy summary.

## Small implementation tasks

1. Reuse public `claimRequestSchema`, `pageClaimRequestSchema`, `ClaimRequest`, `PageClaimRequest`, `claimRequestIdSchema`, and `claimRequestVoidResponseSchema`. Do not duplicate the full response schema in the application.
2. Add `myClaimRequestPageRequestSchema` under the Claim Request package domain, based on the shared strict page request factory with service defaults page 0 and size 10. The page requests size 9 explicitly. Preserve filters as backend filter inputs; strip UI-only controls in the application, and serialize via `transformApiFilterParams`.
3. Add `insurancePoliciesRequestSchema` (strict empty object), `insurancePoliciesResponseSchema` (existing policy schema array), `subInsuredPeopleRequestSchema` (strict numeric policyId), and exact `subInsuredPersonSchema`/`subInsuredPeopleResponseSchema`. Lookup ID is required nullable number; nationalCode/fullName are required strings; isForeign is nullish Y/N. Lookup unknown properties are stripped.
4. The owning feature service validates requests and responses. GET `/my/iap/claim-requests/page-full` carries page/size/filter query parameters and AbortSignal; DELETE `/my/iap/claim-requests/{id}` carries the selected ID in the path. Filter lookup GET endpoints are `/my/iap/my-policies` and `/my/iap/sub-insured-people/{policyId}`.

## Field-by-field closure audit

The existing shared base matches the source's fields, field order, primitive types, arrays and nullish acceptance after normalizing `.nullable().optional()` to `.nullish()`. `z.any()` for arbitrary record values is implemented as `z.unknown()` with the same runtime acceptance. Top-level Claim Request is a stripping object in both projects.

Nested externalDoctor, statusHistory, assignmentHistory and objections are loose in both projects. Nested subInsuredPeople, duplicate details, duplicates and AI assessment results are stripping objects in both. claimDocument retains unknown keys; extractedData retains arbitrary values. Existing imported docType, attachment and special-disease schemas remain their shared public owners.

Accepted architecture differences: page content is nullish and consumed with `content ?? []`; pagination metadata remains nullish under the workspace's existing page factory, while the reference requires metadata. Requests are strict and page/size are validated by the accepted common request contract. Reference enum factory translation callbacks are not called by the response schema, so reuse existing enum schemas without inventing form validation.

## Verification

`apps/iap-app/src/features/my-claims/utils/my-claims-contracts.test.ts` covers pagination defaults, invalid page/size, strict unknown request rejection, nullish content, invalid status, malformed nested history and objection role, unknown-key retention/stripping, and required lookup fields. The app test command passed 21 tests; `pnpm --filter @iap/api-types typecheck` passed. No live backend behavior is claimed by these checks.

