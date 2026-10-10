# 07 Full Reference Comparison

Status: audit complete; implementation tasks pending.

Reference: `insurance-ui/src/features/my-iap/claim-requests/pages/my-claim-request-create-page.tsx` and its direct form/component dependencies. Target: `apps/iap-app/src/features/my-claims/pages/create`.

## Page and route

- Reference page is formatted as readable JSX and passes only `title`, `description`, `showBackButton` to `MyClaimRequestPageHeader`; target adds a `backLink` prop and uses `/myclaims/`. Verify target router's canonical trailing-slash route and header contract against the reference behavior.
- Reference navigate target is `/myiap/myclaims`; target uses `/myclaims/`. This is an intentional app route adaptation only if the target route contract requires it; otherwise it is a parity discrepancy.
- Target page and form are compressed into one-line JSX/statements, unlike project style and reference readability. Refactor without changing behavior.

## Form behavior and API

- Reference submits `isForeign: values.isForeign` in payload. Target currently omits explicit `isForeign` from the submit payload.
- Reference uses fixed Persian translation (`i18n.getFixedT('fa')`) for invalid Sheba detection. Target uses the active translator, which can fail when locale is not Persian.
- Reference invalid-Sheba confirm dialog uses `desc`, `confirmText`, and `handleConfirm`; target uses `description`, `confirmLabel`, and `onConfirm`. Verify the `@iap/dialogs` public API and match the equivalent visual/behavioral contract exactly.
- Reference calls `onSuccess?.()` (optional callback); target requires `onSuccess`, changing component API.
- Reference resets the form after success and invalidates `['myClaimRequests']`; target does this, but verify mutation response parsing and toast translation parity.
- Reference amount conversion occurs in `onSubmit`; target service also converts `amount`, creating duplicate responsibility. Keep conversion at the same boundary as target architecture while preserving exact request payload.
- Reference `DatePicker` props are `selected`/`onSelect`; target uses `value`/`onChange`. Verify target `@iap/ui` API and ensure equivalent selected-date, clearing, editability, and max-date behavior.
- Reference required markers are explicit destructive spans; target uses literal `*`, which differs in styling/accessibility.
- Reference Alert classes include dark-mode classes and typography classes; target drops them. Restore visual class parity supported by `@iap/ui`.
- Reference `InputAmount` formatting uses `numWithComma` and `onlyNumberValue`; target uses `Input numerical numberWithComma`. This is the intended architectural equivalent, but verify emitted value, caret behavior, maxLength, and validation messages against reference.

## Child components

### MyClaimMyInsurancePolicyFormField

- Target removes reference props `label`, `placeholder`, `isRequired`, and `isFilter`; even if create page only uses `featureKey`, preserve the public component contract unless architecture intentionally scopes a create-only component.
- Target always clears `extNationalCode` as an object. Reference supports filter mode and clears to a string in filter mode; preserve behavior in shared component.
- Target adds `presentation='reference'` to `SearchableSelect`; verify this is required and does not alter reference create-page output.
- Target changed default export to named export. Match repository import/export convention or update all consumers consistently.
- Target is compressed into one line; refactor into readable small blocks.

### MyClaimMyNationalCodeFormField

- Same removed props (`label`, `placeholder`, `isRequired`, `isFilter`) and named-export mismatch.
- Target renders foreign labels using a template that can produce empty/undefined values; reference trims the composed label and has explicit branches for foreign/non-foreign values.
- Target does not reset to the empty fallback object when a selected value disappears; reference does.
- Target adds `presentation='reference'`; verify exact SearchableSelect behavior.

### MyClaimRequestFormDocTypes

- Reference uses `useDocTypesData`; target uses a feature query returning `data.content`. Confirm API response shape and loading/error behavior against reference.
- Target stores `others` in a ref but does not clear it when a later response has no `others`; reference also uses a ref, but verify lifecycle under query refresh.
- Target appends `others` with spread; reference uses `concat`; verify ordering and duplicate behavior.
- Target omits `shouldFilter={false}` only if SearchableSelect default differs; currently target sets it, verify exact prop contract.
- Target is compressed and lacks explicit empty fallback formatting; refactor.

### FileUploader

- Target is feature-local while reference consumes shared `@/features/files/components/file-uploader`; compare all UX/validation contracts line-by-line, including file signature checks, accepted extensions, HEIC conversion, progress, preview, removal, error text, object URL lifecycle, and attachment response schema.
- Verify target callback signatures (`onChange`, `onUploadingChange`) and attachment identity match reference exactly.

### MyBankAccountDialog

- Target does not render authenticated user display name in dialog description (`accountName1`, user name, `accountName2`) as reference does.
- Target dialog title/description are invalid-Sheba texts; reference uses `myiap.myBankAccount.dialog.title` and account-name description.
- Target inlines bank account form, while reference composes `MyBankAccountForm`; compare validation (IBAN), existing-account loading, add/edit API, server errors, and submit state.
- Target uses a numeric input for an IBAN; reference form contract must be followed (IBAN may contain non-numeric prefix and has dedicated schema).
- Target lacks form-level validation/error display and toast/error handling.

## Schema and services

- Target form schema imports shared schemas from `@iap/api-types`, which is architecturally correct only if those schemas are byte-for-byte contract-compatible with reference schemas; verify `attachmentSchema`, `docTypeSchema`, `subInsuredPersonSchema`, and `claimRequestYesNoSchema` fields and coercion.
- Target removed reference exports `claimRequestSchema`, `pageClaimRequestSchema`, and related types from the feature model; update consumers or expose equivalent public contracts where needed.
- Target service `create` endpoint and payload must be compared with reference: reference posts `/claim-requests`, formats date `yyyy-MM-dd`, preserves attachments and `isForeign`, then parses `claimRequestSchema`.
- Target bank account edit request is narrowed to a required `{bankAccountNumber, bankAccountType}` body; reference accepts partial account payload. Verify API contract and schema compatibility.
- Target service has additional page/delete methods unrelated to create page; ensure no regression and preserve reference response parsing.

## Translation audit

- Verify every key used by page/form/children exists in target locale files with the same key and semantic text as reference: `myiap.claimRequests.form.*`, `claimRequests.dialog.fields.*`, `claimRequests.validation.*`, `assessmentItems.validation.*`, `myiap.createClaimPage.*`, `myiap.docTypeAlert`, `common.rial`, `form.creating`, `form.uploading`, `myiap.claimRequests.create`, `myiap.myBankAccount.*`.
- Do not invent fallback `defaultValue` strings in production components; use exact reference translation keys.

## Task order

1. Fix page/form contract and visual/behavior parity.
2. Restore child-component props/exports and field edge cases.
3. Compare and align uploader contract.
4. Replace inline bank-account dialog form with architecture-compatible composed form and exact translations.
5. Verify shared schemas/API payload and translation inventory.
6. Run feature typecheck/lint and `git diff --check`.

## Implementation status — 2026-10-10

Completed: the audited behavior was reconciled with the target architecture, including fixed Persian Sheba detection, optional `onSuccess`, explicit `isForeign` payload preservation, absolute imports, public support-button usage, feature service/query ownership, outgoing claim request validation with `claimRequestRequestSchema`, and upload attachment identity handling. The target `@iap/ui` DatePicker/Input public contracts are used where their APIs differ from the legacy reference primitives.

Verification: feature-scoped TypeScript, ESLint, and `git diff --check` pass.
