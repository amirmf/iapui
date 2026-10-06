# Outpatient acceptance nested dialog parity repair

Scope: the existing outpatient-doc-acceptances worktree. Reference root: `/home/sadegh/Android/project/insurance-ui/src/features/outpatient-doc-acceptances/`. Application implementation remains under the target feature and uses public workspace primitives.

## Verified discrepancies and implementation

- [x] P0 — `components/outpatient-claim-form-dialog.tsx`: replace the invented claim-code-only shell with the source's 28 fields, initial values, enum options, create/update branching, pending close guard, acceptance `currentRow.id`, invalidation, toast, and reset sequence.
- [x] P0 — `components/outpatient-claim-view-dialog.tsx`: replace the independently fetched, truncated object dump with source-exact explicit fields from `currentRow.outpatientClaim`, including translated booleans.
- [x] P0 — `components/issuance-form-dialog.tsx`: replace the static paragraph with the source's 25 fields, defaults, claim/doc acceptance identifiers, create/update behavior, pending close guard, and success sequence.
- [x] P0 — `components/issuance-view-dialog.tsx`: replace the truncated object dump with source-exact explicit fields from `currentRow.outpatientClaim.issuance`, including damage count and translated booleans.
- [x] P0 — `components/damage-cases-dialog.tsx`: replace the invented list shell with source query enablement and cached acceptance identifier, refresh/create actions, deletion confirmation, source query keys, and mounted nested form/view dialogs.
- [x] P0 — `components/damage-cases-table.tsx`: replace the null placeholder with the source table's five data columns and view/edit/delete actions. Forward the exact source loading/empty translation keys and literal fallbacks.
- [x] P0 — `components/dmg-case-form-dialog.tsx`: replace the null placeholder with all 48 source fields, initial values, boolean defaults, create/update mutations, and success/pending behavior.
- [x] P0 — `components/dmg-case-view-dialog.tsx`: replace the null placeholder with all explicit source detail fields.
- [x] P0 — `stores/damage-cases-dialog-store.ts`: port source mode/selection/selectCase/reset behavior into target `context/store/damage-cases-dialog-store.ts`.
- [x] P1 — Keep parent forms focused: move unchanged source field JSX into six-field groups beneath the existing public Form provider. Preserve field order, names, input types, decimal steps, labels, checkbox semantics, and layout classes.
- [x] P1 — Use the source resolver bridge for controlled string form values with preprocessing schemas. Runtime schema validation remains through zodResolver; the bridge matches source typing semantics.

## Evidence

Programmatic source comparisons verified form field names, order, and static translation keys: claim 28 fields; issuance 25; damage case 48. The three new rendered tests in `components/outpatient-nested-dialogs.test.tsx` pass: claim submission uses the acceptance identifier rather than its external identifier, invalidates and closes after success; issuance rejection keeps the dialog open; damage actions select the same original case with view/edit/delete modes. Scoped ESLint passes. Final integrated typecheck and all-feature verification are recorded by the parent parity task.

The source forms and views were read directly, including the source SingleSelect and SimpleDataTable loading/empty/clear behavior. No new product fields, inferred labels, or independent detail-fetch flows were introduced. Live backend and pixel-perfect checks remain outside the accepted scope.
