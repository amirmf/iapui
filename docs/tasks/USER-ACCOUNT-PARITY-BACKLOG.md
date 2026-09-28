# User Account parity backlog

## Purpose

This document records the remaining work required to make the `iap-admin`
`/user-account` screen match the `insurance-ui` reference implementation.
Only file placement may differ where required by the `iap-ui` architecture.
API paths, request/response schemas, translations, and product behaviour must
come from the reference implementation.

## Completion criteria

The work is complete only when every item below is complete, a source-level
comparison has found no unintentional differences, and typecheck, lint, tests,
and production build all pass.

## Incomplete tasks

### 1. Create and manage account forms

- [x] Replace the shared `UserAccountFormDialog` implementation with
  reference-equivalent `PartyFormDialog`, `PartyUserAccountDialog`, and
  `UpdateUserAccountForm` responsibilities.
- [x] Implement every create-form field, default value, validation rule, and
  payload mapping from the reference `party-form-dialog.tsx`.
- [x] Implement every manage-form field, default value, validation rule,
  permission condition, and payload mapping from the reference
  `update-user-account-form.tsx`.
- [x] Place password reset and account deletion inside the manage-form flow as
  in the reference implementation.
- [x] Remove obsolete combined-form code after the replacement is wired.

### 2. Branch location selector

- [x] Complete `BranchLocationsForm` with the reference server-side branch
  search, debounce behaviour, filters, loading state, and selected-value
  handling.
- [x] Use it from both create and manage forms.

### 3. Special disease dialog

- [x] Split the current dialog into a dialog shell, insured-person list, and
  special-disease form equivalent to the three reference components.
- [x] Add reference loading, error, empty, selected-person, and disease-badge
  behaviour.
- [x] Preserve the reference query keys, mutations, invalidation, and exact
  translation keys.

### 4. Contract and service verification

- [x] Re-audit every `packages/api-types` user-account related schema against
  the reference line by line, including request strictness/unknown-field
  behaviour and response optionality.
- [x] Re-audit `userAccountService`, `partyService`, branch service, doc-type
  service, and person-special-disease service against the reference endpoint
  semantics.
- [x] Remove compatibility aliases or approximations that are no longer needed
  after the audit.

### 5. Reference tests

- [x] Adapt the reference user-account service tests to `iap-admin` transport
  and module boundaries.
- [x] Adapt the reference party service tests.
- [x] Adapt the reference party-role test, including the ticket-agent role,
  colour, translation key, and selector option.

### 6. Final parity audit

- [x] Compare every reference user-account component with its target owner.
- [x] Verify that all `parties` translation values used by this screen are
  exact copies of the reference values.
- [x] Verify that the route remains thin and that feature/module/shared/package
  ownership follows `APPLICATION-ARCHITECTURE.md`.
- [x] Run `pnpm --filter iap-admin typecheck`.
- [x] Run `pnpm --filter iap-admin lint`.
- [x] Run `pnpm --filter iap-admin test`.
- [x] Run `pnpm --filter iap-admin build`.

## Current verified state

- The reference comparison and architecture review are complete.
- `typecheck`, `lint`, `test`, and production `build` passed after the final
  source comparison.

## Follow-up component audit

The page and every component in
`insurance-ui/src/features/user-account` were compared again with their
`iap-admin` owners. File placement and shared primitive APIs differ only where
required by the target architecture.

- [x] Copied the reference `common.passwordRequirements` and `form`
  translations because the user-account forms consume them directly.
- [x] Restored the reference password-requirement help text in create, manage,
  and reset-password forms.
- [x] Restored the reference create-form submit labels (`form.creating` and
  `form.submit`), special-disease save label (`common.save`), and reset-password
  full-width submit layout.
- [x] Restored the parent-account filter's reference behaviour of deleting the
  query parameter when its selection is cleared.
- [x] Rechecked user-account, party, branch, doc-type, and
  person-special-disease endpoint paths and contract fields against the
  reference; no source-invented endpoint, request field, response field, or
  translation value remains.
- [x] Restored reference table-cell fallbacks, widths, truncation settings, and
  status presentation where target shared-table metadata required an adapted
  property name.
- [x] Restored the form-control wrapper around both parent-user selectors, the
  special-disease dialog cache lifetime and primary-person identifier, and the
  external-units empty-request validation.

## Final follow-up audit

The feature was compared again file by file with
`insurance-ui/src/features/user-account` after the earlier completion note.

- [x] Revalidated the page, toolbar, columns, row actions, all create/manage/
  reset dialogs and forms, branch selector, view dialog, delete action, and
  every special-disease dialog subcomponent.
- [x] Restored reference-equivalent delayed clearing of the selected row after
  dialog close, and prevented closing the create dialog while its mutation is
  pending.
- [x] Restored the reference badge presentation for role, account-status, and
  special-disease labels through the reusable `@iap/ui` `Badge` primitive.
- [x] Restored the toolbar spacing and branch-name fallback behaviour from the
  reference.
- [x] Preserved Zod form defaults exactly as in the reference while using
  `z.input` for React Hook Form and parsing to Zod output at submit time.
- [x] Compared `parties`, `personSpecialDiseases`, `form`, the consumed common
  keys, and `auth.validation.mobileNumberPattern` as JSON values with the
  reference Persian locale; all matched exactly. The two username validation
  keys remain intentionally unresolved because the reference locale does not
  define them.
- [x] Rechecked user-account, party, branch, doc-type, and person-special-
  disease transport paths and Zod field contracts against their reference
  owners. Request-wrapper strictness remains the explicitly required target
  architecture adaptation.
- [x] Final verification passed: `pnpm --filter iap-admin typecheck`,
  `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin test` (28 tests),
  and `pnpm --filter iap-admin build`.
