> Current response contract (2026-10-07): paginated `content` uses `.nullish()` across the workspace. Missing values and `null` are accepted; present array items are validated. This supersedes earlier optional-only and null-rejection statements, including exact-reference acceptance claims for this field.

> Current ownership decision (2026-10-07): My-IAP belongs exclusively to `iap-app`. No My-IAP routes, pages, or placeholders are registered in `iap-admin`. Earlier placeholder descriptions below are superseded. Shared Support ticket views and backend contracts remain in scope.

# Fresh Support API and schema audit

Date: 2026-10-07. This document supersedes the initial contract audit for the
Support widget and its mounted tickets closure. My-IAP pages remain placeholders
under the accepted user scope; their existing widget API contracts are included.

## Source-to-target file map

| Reference under `insurance-ui/src/` | Target under `iap-ui/` | Result |
| --- | --- | --- |
| `features/support/data/support-flow-schema.ts` | `packages/api-types/src/support/index.ts` (flow section) | Same exported schema/type names, property order, optional/null rules, enums, nested page sort/pageable fields, unknown-property stripping and context object retention. |
| `features/support/data/my-iap-ticket-schema.ts` | `packages/api-types/src/tickets/index.ts` (My-IAP section) | Same three exported request schemas/types; UUID path validation, required query object/string filters, optional integer page/size without limits/defaults and stripped unknown properties. |
| `features/tickets/data/ticket-schema.ts` | `packages/api-types/src/tickets/index.ts` (tickets section) | Source contract section is identical, including nested users, messages, status and assignment histories, enum order, UUID user identifiers, nullable metadata and loose response objects. |
| `features/claim-requests/data/claim-request-schema.ts` (`claimRequestStatusSchema()` dependency) | `packages/api-types/src/claim-request/index.ts` (`claimRequestStatusSchema`) | Same ordered values; runtime source factory is loaded in the differential suite. Support accepts arbitrary status strings after the claim/ticket enum alternatives, as the reference does. |
| `constants/tickets-constant.ts` (`SUPPORT_REQUIRED_PARAM_INPUT_DISPLAY_VALUES`) | `packages/api-types/src/support/index.ts` (`supportRequiredParamInputDisplaySchema`) | Ordered `TEXT`, `LIST`, `NOINPUT` values match; actual source constant is loaded in the differential suite. |
| `features/support/services/support-service.ts` | `packages/support/src/services/support-service.ts` | Same service export/method names and all request/response schemas; transport client is obtained through the target package public API. |

The target service also has a compatibility public re-export at
`packages/support/src/support-service.ts`; it delegates to the same implementation.
All contracts are exposed through `@iap/api-types` and service through
`@iap/support`, preserving target architecture.

Support administration contracts appearing below the flow section in the target
Support contract file are separate features and are not contracts reached by
`src/features/support` in the reference.

## API comparison

| Method | HTTP | Path | Placement and options |
| --- | --- | --- | --- |
| `publicAnswer` | POST | `/support/answer` | Parsed flow payload body, forwarded signal, `withCredentials: true`. |
| `myAnswer` | POST | `/support/my/answer` | Parsed flow payload body and forwarded signal. |
| `getMyIapTicketById` | GET | `/my/iap-ticket/tickets/{ticketId}` | Parsed UUID path and forwarded signal. |
| `getMyIapTicketMessages` | GET | `/my/iap-ticket/tickets/{ticketId}/messages` | Parsed query `{page?, size?}` and forwarded signal. |
| `getMyIapTickets` | GET | `/my/iap-ticket/tickets/page-full` | Query `{page, size, ...filters}` in source order, including filter-key override behavior; forwarded signal. |

Every operation parses its response using the corresponding source-matching
schema. Invalid requests fail before transport. No additional endpoint or request
parameter has been introduced.

## Verification and corrections

No production API/schema discrepancy was found. Added
`apps/iap-admin/src/features/support/services/reference-contract-parity.test.ts`
to strengthen evidence beyond hand-written target-only expectations:

- Loads and evaluates actual local reference TypeScript schemas.
- Checks all 29 exported schemas from the complete reference tickets contract,
  flow contract and My-IAP contract.
- Recursively exercises nested object/array/record/union/enum values, absent/null,
  wrong primitives, malformed integers and multi-field failures.
- Compares acceptance, parsed output and complete ordered validation issues.
- Loads the actual reference service and compares each of its five operations
  with the target service, including stripping, signal/credentials, query filter
  overrides and parsed response.

Zod v4 `.loose()` versus reference `.passthrough()` and `.nullish()` versus
`.nullable().optional()` are architectural adaptations, with equivalent behavior
verified by the differential suite. Optional `content` follows the accepted
architecture and already matches this source; its null acceptance is separately
preserved (Support options reject null, ticket pages accept null).

This is contract and mocked transport verification, not a live-backend test or
browser rendering claim.

Final validation: 41 focused Support contract/transport tests passed, including
34 fresh source-differential tests; `@iap/api-types` and `iap-admin` typechecks
passed. Focused ESLint and `git diff --check` passed. No production file needed
correction in this audit scope.

Final integrated checks after all audit corrections are recorded in [reaudit.md](reaudit.md).
