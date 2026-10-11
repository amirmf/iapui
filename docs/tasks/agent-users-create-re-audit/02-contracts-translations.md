# 02 — Signup contracts, translations and inherited transport audit

Audit date: 2026-10-11. Status: source audit and correction tasks complete; focused verification passed. The task inventory was recorded before implementation.

Reference root: `/home/sadegh/Android/project/insurance-ui`.
Target root: `/home/sadegh/.codex/worktrees/agent-user-create/iap-ui`.

## Inspected closure

Read every line of reference `src/features/agent-users/data/agent-signup-schema.ts`, `src/features/agent-users/services/agent-user-service.ts`, `src/features/agent-users/components/agent-user-signup-form.tsx`, `src/features/auth/data/auth-schema.ts` nationality definition, `src/utils/typed-zod-resolver.ts`, `src/utils/api-client.ts`, `src/utils/handle-server-error.ts`, `src/constants/party-constant.ts`, `src/lib/i18n.ts`, and the mounted global mutation handler in `src/main.tsx`. Compared target feature schema/service/query/constants/form components and their shared API/i18n/error dependencies. Relevant skills: `reference-page-parity`; architecture documents: `APPLICATION-ARCHITECTURE.md`, `LOCALIZATION.md`, and the accepted signup request-stripping decision.

## Confirmed equal contracts (do not invent changes)

| Responsibility | Reference | Target | Result |
| --- | --- | --- | --- |
| Request schema name | `agentSignupRequestSchema` | `packages/api-types/src/agent-user/index.ts` | Exact name and field order |
| Request phone | trimmed string, `/^(\+989\d{9}|09\d{9})$/` | public shared regex, same expression | Equal acceptance/output |
| Request identifier | trimmed string, min 1, no digit/length/checksum constraint | Same | Equal |
| Request password | string, min 6, max 255, nonblank refinement, no trim output | Same operation order | Equal |
| Nationality | `nationalityTypeSchema`, enum `IR`, `FOREIGN`, default `IR` | Same public schema options/order/default | Equal |
| Unknown request keys | `z.object` strips | `z.object` strips | Equal; explicitly approved exception |
| Form schema | `createAgentSignupFormSchema` | Same name in feature model | All field definitions, translated messages, field order and superRefine issue order are equal |
| Form confirmation | required string, then `passwordsMatch` custom issue on `confirmPassword` | Same | Equal |
| Response | `agentSignupResponseSchema = z.undefined()` | Same | Equal |
| Empty HTTP response normalization | `data === '' ? undefined : data` | Same | Equal; null/object/array/nonempty string are rejected |
| Service | default `agentUserService`, method `signup` | Same default export and method | Equal |
| HTTP method/path/body | POST `/claim-request-registery-agent/users`, parsed request in body, no query | Same | Equal |
| Submit request projection | phoneNumber, nationalCode, password, nationalityType; no confirmPassword | Same | Equal |
| Success sequence | reset defaults, then translated success toast | Same | Equal |
| Mutation errors | inherited global handler, no local onError | Same composition | Handler differences recorded below |

Programmatic JSON comparison run during this audit reports `agent.users` Persian subtree equality and `breadcrumb.agentUserSignup` equality. Every key/value in that subtree, including validation messages, pending action and success toast, is verbatim source data. No locale edits are warranted for the successful Persian page path.

## Constants line audit

Reference `src/constants/party-constant.ts` was reread in full. It is **not imported by AgentUserSignupForm**. Its nationality map uses `parties.nationality.ir` and `parties.nationality.foreign`; signup itself uses `agent.users.nationality.ir` and `agent.users.nationality.foreign`. Target feature `constants/agent-user-constant.ts` correctly preserves the latter keys and IR → FOREIGN order. Copying the party map into signup would create a key discrepancy. Remaining party role/type/status and agreement relationship/role maps are outside this page closure. The target unused option helper is an implementation convenience, not reference behavior; it does not change the mounted page.

## Concrete correction tasks

### C1 — Preserve forced-password transport rejection (P1)

- [x] Before the signup POST reaches transport, preserve the reference guard: when `auth.user?.isPasswordChangeForced === 'Y'` and the request URL is not `/auth/change-password`, reject with `CanceledError('Password change is required before other requests.')`.
- Evidence: reference `src/utils/api-client.ts` request interceptor performs this check. Target `packages/api-client/src/api-client.ts` reads only an access token; `apps/iap-admin/src/main.tsx` configures only that token reader. Target `ForcePasswordChangeDialog` cancels queries but does not cancel signup mutations or add this transport guard.
- Ownership: implement through an application-configured public shared-client capability, or a narrowly scoped signup service guard if integration requires page-only scope. Do not import application auth state into api-client.
- Acceptance: a forced-password signup performs zero POSTs and rejects with the exact cancellation message; ordinary authenticated signup still sends the same endpoint/body. Verify the change-password request remains allowed if implementing shared transport parity.

### C2 — Preserve signup failure literal fallback (P2)

- [x] Preserve source fallback `Something went wrong!` for the signup mutation failure when extraction yields undefined.
- Evidence: reference `src/utils/handle-server-error.ts` defines this literal; target `apps/iap-admin/src/shared/errors/handle-server-error.ts` defines `خطایی رخ داد. لطفاً دوباره تلاش کنید.`. The page has no mutation-level handler, so these literals are reachable through its global mutation failure path.
- Acceptance: no-message/canceled failure uses the reference literal for this signup operation. Backend supplied messages remain extracted unchanged. Keep standard global error ownership and avoid duplicate local toast handling.
- Scope: prefer a scoped global-mutation error presentation option; do not rewrite other features' accepted error wording without need.

### C3 — Preserve source HTTP 304 additional toast (P2)

- [x] For the signup mutation's AxiosError response status 304, preserve the extra toast text `Content not modified!`.
- Evidence: reference `src/main.tsx` global mutation onError calls the standard handler then emits this exact literal. Target `apps/iap-admin/src/shared/query/query-client.ts` emits `محتوا تغییری نکرده است.` instead.
- Acceptance: handler sequencing and the extra source literal match; no third toast is added. Scope the presentation to this mutation if needed.

### C4 — Close source error-extraction edge differences (P2)

- [x] Preserve source `{ status: 204 }` special-case extraction to `Content not found.` before generic object extraction.
- [x] Preserve source AxiosError message-only cancellation recognition (case-insensitive `canceled` / `cancelled`) even when code/name do not mark cancellation.
- Evidence: reference `src/utils/handle-server-error.ts` checks generic object status 204 before AxiosError handling; target `packages/api-client/src/extract-error-message.ts` checks only `error.response?.status`. Reference checks Error.message after its AxiosError code/name checks; target returns early from the AxiosError branch before the message-only check.
- Acceptance: these exact source-backed edge inputs produce the same extraction outputs; ordinary response message collection order, deduplication and digit-only filtering remain equal.

### C5 — Strengthen simultaneous validation evidence (P2, verification gap)

- [x] Verify exact issue arrays for multiple invalid fields together, missing/null/wrong-type fields, blank short password, and blank/mismatched confirmPassword.
- Evidence: source and target schema operations/field order currently match. Existing target tests assert selected issue containment, not complete array order; this is a verification gap, not a proven schema bug.
- Acceptance: request/form acceptance, stripped output and full issue order match direct execution of the reference schemas for the selected inputs. Do not change schema rules merely to add tests.

## Accepted infrastructure differences

Reference supports saved `en`/`fa`, dynamic tenant locale loading, `fallbackLng: false`, and English page resources. Target `docs/architecture/LOCALIZATION.md` explicitly requires Persian-only applications. Target i18n therefore supports only `fa` and uses `fa` fallback. This is an accepted architecture difference, not a missing English-copy task; do not add an English application journey during this page correction.

Shared client initialization is architecture-specific: target obtains the configured singleton at call time, reference creates a client at service module initialization. Both use JSON Content-Type, current Bearer token, the same API base URL fallback, and `paramsSerializer.indexes = null`. PATCH sanitation in reference is irrelevant to this POST-only page. No page-level query/filter/pagination API exists here.

## Limits

C1 is scoped to `agentUserService.signup`, after request parsing and before POST, using the public `@iap/auth` store. It does not alter transport defaults for other features. C2–C3 opt into reference literals through signup mutation meta consumed by the existing global mutation handler; no feature mutation-level error toast was added. C4 uses optional `extractErrorMessage` reference presentation and preserves unchanged defaults. C5 captures six full issue arrays by transpiling and executing the inspected reference schema with its exact dependency definitions, then compares them to the target schema; all 14 model tests pass. The fixture is `features/agent-users/test/fixtures/agent-signup-validation.reference.json`.

Verification: 35 tests passed across signup model/service and shared reference query error tests. Admin typecheck passed. The service tests cover cancellation before transport and normal endpoint/body/response acceptance. The shared error tests verify opt-in source literals, unchanged defaults, message cancellation, generic status204 and 304 toast ordering. This document does not claim browser screenshots or backend calls.
