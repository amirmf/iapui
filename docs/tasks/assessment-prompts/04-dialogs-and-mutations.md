# 04 — Create/edit/view/delete dialogs

Status: Implemented; source corrections are documented in tasks08/09.

## Reference

Mounted source form, doc-type field, view and delete-method dialog. The unused
BulkDeleteDialog and AgreementSearchSelect are not implementation requirements.

## Acceptance and implementation

- Source form fields/order/defaults, scalar selections and null place-type.
- Source inline SearchableSelect behavior: immediate raw agreement search,
  row-backed selected label, translated loading/empty/clear.
- Source cached document-type hook and source schema validation messages.
- Footer-only pending protection, synchronous close/reset, source date/dialog
  presentation.
- Source view fields and empty-vs-null semantics; source badges.
- Source delete-method/confirmation layout, reset300ms and fire-and-forget
  invalidation before close/toast; retain selected-only safeguard and retry.
- Mutations use global error feedback and feature-owned success feedback.

## Evidence

Ten form tests, two view tests, three deletion-wrapper tests, two real shared
delete-confirmation integration tests, three document-cache tests and UI primitive
tests. See task10 for final combined checks and disclosed safeguards.
