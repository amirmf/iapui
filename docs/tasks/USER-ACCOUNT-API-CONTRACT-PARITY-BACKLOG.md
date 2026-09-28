# User Account API contract parity backlog

## Purpose

This backlog records the API-contract parity gaps found after the `/user-account`
screen implementation review. It is intentionally separate from implementation
work: every endpoint, request schema, response schema, and translation must be
copied from `insurance-ui`, with only file ownership adapted to `iap-ui`.

## Source of truth

- Reference repository: `/home/sadegh/Android/project/insurance-ui`
- Target worktree: `/home/sadegh/.codex/worktrees/iap-user-account`
- Target application: `apps/iap-admin`

## Rules

- Do not invent endpoints, request fields, response fields, translation keys,
  or validation rules.
- Keep Zod v4 response schemas loose where the reference uses `passthrough()`.
- Keep request schemas strict where the reference endpoint contract is strict.
- Use `getApiClient()` in target service tests; do not introduce
  `createApiClient()` into `iap-admin` services.
- Add focused service tests before marking an item complete.

## Priority 1 — Correct contract ownership

### 1. Restore the `isCheat` schema owner

- [x] Compare `claimRequestYesNoSchema` in the reference with the target
  equivalent.
- [x] Export the reference-equivalent schema from its correct target owner.
- [x] Replace `claimRequestIbanStatusSchema` in
  `packages/api-types/src/user-account/index.ts`.
- [x] Add a regression test proving the user-account request schemas use the
  correct contract.

Acceptance criteria:

- `updateUserAccountPayloadSchema`, `updateWithPartyPayloadSchema`, and
  `registerWithPartyPayloadSchema` refer to the reference-equivalent Yes/No
  schema, not the IBAN-specific schema.

## Priority 2 — Complete reusable branch service parity

### 2. Add omitted branch endpoints and contracts

- [x] Compare `insurance-ui/src/features/branches/services/branch-service.ts`
  and its data schema with the target module and `@iap/api-types` contracts.
- [x] Add reference-equivalent create, update, delete, and sync endpoint
  request/response schemas under `packages/api-types/src/branch/`.
- [x] Add the corresponding methods to
  `apps/iap-admin/src/modules/branches/services/branch-service.ts`.
- [x] Preserve existing page search semantics used by `/user-account`.
- [x] Add service tests covering paths, payload mappings, and boundary
  validation.

Acceptance criteria:

- Every branch endpoint present in the reference service is represented by a
  validated target contract and `getApiClient()` service method.

## Priority 3 — Complete reusable doc-type service parity

### 3. Add omitted doc-type endpoints and contracts

- [x] Compare the reference doc-type schema/service line by line with
  `packages/api-types/src/doc-type/` and the target module service.
- [x] Add get-by-id, create, update, inline update, schema update, submission
  example update, delete, soft-delete, and bulk-delete contracts and methods.
- [x] Preserve reference payload preprocessing and response validation.
- [x] Add service tests for validation and transport semantics.

Acceptance criteria:

- The target doc-type module exposes every reference service operation through
  validated request and response schemas.

## Priority 4 — Complete reusable special-disease service parity

### 4. Add omitted special-disease endpoints and contracts

- [x] Compare the reference person-special-disease schema/service line by line
  with `packages/api-types/src/person-special-disease/` and the target module.
- [x] Add page, get-by-id, delete, bulk-delete, and soft-delete contracts and
  methods.
- [x] Keep the existing `/user-account` insured-person and national-code flows
  unchanged.
- [x] Add service tests covering request validation, paths, and response
  parsing.

Acceptance criteria:

- The target special-disease module exposes every reference operation and
  retains the current user-account behavior.

## Priority 5 — Resolve inherited username validation localization

### 5. Decide the handling of missing reference keys

The reference code calls `auth.validation.usernameMaxLength` and
`auth.validation.usernamePattern`, but its Persian locale does not define those
keys. The target intentionally preserves that reference behavior today.

- [x] Decision: preserve exact parity and leave the two keys unresolved because
  they are absent from the reference Persian locale.
- [x] No translation resources were added; the reference does not provide
  approved values.
- [x] Add a regression test for the chosen behavior.

Acceptance criteria:

- There is an explicit decision and no guessed localized text.

## Completion checks

- [x] Recompare all affected API types and services against the reference.
- [x] Run `pnpm --filter iap-admin typecheck`.
- [x] Run `pnpm --filter iap-admin lint`.
- [x] Run `pnpm --filter iap-admin test`.
- [x] Run `pnpm --filter iap-admin build`.
