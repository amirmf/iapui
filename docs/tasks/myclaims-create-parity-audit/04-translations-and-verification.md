# Task 04 — Translation and verification parity

Use only keys verified in `insurance-ui`: `myiap.claimRequests.form.*`, `myiap.createClaimPage.*`, `claimRequests.dialog.fields.*`, `claimRequests.validation.*`, `assessmentItems.validation.amountItemMin/Max`, `myiap.docTypeAlert`, `form.creating/uploading`, `myiap.claimRequests.create`, and `claimRequests.messages.created`.

Verify every Persian value against the reference locale, run focused tests/typecheck/lint, and compare the rendered field order and loading/error behavior.

## Verification result

`pnpm --dir apps/iap-app exec tsc -b` reports no errors for the create-page feature, service, model, or route. `git diff --check` passes. Existing unrelated translation typing diagnostics are outside this feature.
