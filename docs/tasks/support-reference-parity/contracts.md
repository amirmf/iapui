> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

# Support contracts and services

Historical implementation evidence. The fresh complete audit and final integrated results are in [reaudit.md](reaudit.md).

## Evidence and scope

Reference files inspected directly:

- `insurance-ui/src/features/support/data/support-flow-schema.ts`
- `insurance-ui/src/features/support/data/my-iap-ticket-schema.ts`
- `insurance-ui/src/features/support/services/support-service.ts`
- `insurance-ui/src/features/tickets/data/ticket-schema.ts` (existing shared response owner)

Target contracts belong in `packages/api-types/src/support/index.ts` and the
My-IAP section of `packages/api-types/src/tickets/index.ts`. Transport belongs in
`packages/support/src/services/support-service.ts`. The former service location
remains a compatibility re-export. No routes or translation values belong here.

## Granular tasks

1. Restore canonical `supportResponseDataSchema`, `supportSelectableQuestionSchema`,
   `SupportResponseData`, `SupportSelectableQuestion`, and `SupportOptionsPage`
   exports. Preserve nullable optional response fields and string/object/string-array
   context values. Verify unknown context object fields are retained, unsupported
   scalar values fail, and request unknown keys are stripped.
2. Replace the generic option page with the source field-by-field schema. Verify
   omitted content succeeds, null content fails, malformed items fail, fractional
   metadata fails, and nested pageable sort is validated. All source optional
   numeric metadata is integer and non-nullable.
3. Restore My-IAP request query contracts: optional unrestricted integer page/size,
   required string-record filters for the list, no filters on message queries,
   UUID ticket paths. Do not change the operations-ticket contracts.
4. Restore service signatures to `options?: { signal?: AbortSignal }`. Verify
   POST `/support/answer` includes `withCredentials: true`; POST
   `/support/my/answer` does not add it. Both parse payloads/responses.
5. Verify GET `/my/iap-ticket/tickets/{ticketId}`, GET
   `/my/iap-ticket/tickets/{ticketId}/messages` with direct query pagination,
   and GET `/my/iap-ticket/tickets/page-full` with flattened string filters.
   Cancellation is forwarded for every method. Invalid requests fail before HTTP;
   invalid responses fail after HTTP.

## Completion criteria and validation

Implemented source contracts and services. Seven focused contract/transport tests
passed; `@iap/api-types` typecheck passed. Tests live in the admin Support
service integration owner and import workspace public APIs. Final focused suite, affected typechecks, lint/architecture and diff checks
are complete; integrated evidence is recorded in `verification.md`.
No browser or live-backend equivalence is claimed by these contract checks.

The scoped acceptance decision is recorded in
`docs/architecture/SUPPORT-REFERENCE-CONTRACT.md`.

## Workspace-wide optional content adjustment

The user separately required `content` to always be optional. The common
`createPageResponseSchema` now validates optional arrays without changing
metadata or unknown-key behavior. Its focused test covers missing content,
empty arrays, null rejection, and invalid item rejection. Three existing admin
agreement lookup consumers now safely read an absent collection (optional
chaining for the selected first item and mapped options). No other behavior
was changed. Application typechecks initially reported only active Support
UI-port errors after those three consumers were repaired; final integrated
verification belongs to the task coordinator.
