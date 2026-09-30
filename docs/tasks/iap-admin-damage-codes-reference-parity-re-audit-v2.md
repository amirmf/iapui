# Damage Codes parity re-audit v2

## Scope and evidence

Re-audit the mounted closure of
`insurance-ui/src/features/damage-codes/pages/damage-codes-page.tsx` and its
damage-code-pricing children against the current `iap-admin` implementation.
Reference source is authoritative for APIs, schemas, visible behavior, and
Persian values. Target ownership follows `APPLICATION-ARCHITECTURE.md`.

## Verified discrepancies

1. [x] **P0 — Row pricing dialog is not the reference component.** Reference
   `damage-code-pricing-dialog.tsx` is a two-column dialog with local pricing
   cards, skeleton, empty state, inline create/edit form, and hard/soft delete.
   Target wraps the lower table section in a dialog. Replace it with the verified
   reference behavior using target primitives.
2. [x] **P0 — Pricing service is incomplete.** Target lacks reference
   `getByDamageCodeId`, `getById`, `softDelete(id)`, and `softDeleteBulk` APIs.
   Add identical method/path/query/body behavior and boundary schemas.
3. [x] **P0 — Pricing table toolbar is incomplete.** Target is missing the
   reference `thruDate` range and `priceType` facet filters; use exact filter ids
   and locale keys.
4. [x] **P0 — Pricing form/view parity is incomplete.** Target misses the
   selected-damage-code notice, descriptions, hidden `damageCodeId`, reference
   field labels/placeholders, full reset semantics, dual query invalidation, and
   view details (damage code, title, updated time, description).
5. [x] **P1 — Damage-code table differs.** Restore reference checkbox policy,
   column-visibility control, code-column sticky metadata, widths, status
   filterFn, date behavior, and delete-close selection reset timing.
6. [x] **P1 — Damage-code form/view differs.** Restore reference default/reset
   sequencing, visual layout, date empty fallback, header code-type line,
   separator/date cards, and every mounted translation key.
7. [x] **P1 — Pricing lower section differs.** Restore reference local table
   filter state and filters, column visibility, selection reset, selected-code
   propagation, and reference delete-dialog behavior/query invalidation.
8. [x] **P1 — API/schema parity differs.** Preserve target Zod v4 `.loose()`
   adaptation but align all reference field nullability, ISO datetime validation,
   price request `damageCodeId` type, page metadata constraints, and exported
   response aliases. Do not invent endpoint contracts.
9. [x] **P1 — Translation parity differs.** Programmatic comparison found 84
   missing `damageCodes`/`damageCodePricings` keys, including all mounted pricing
   dialog, toolbar, form, view, feedback, and delete text. Copy exact Persian
   values from `insurance-ui/src/locales/fa.json`; do not translate manually.
10. [x] **P2 — Tests are incomplete.** Add source-backed tests for newly restored
    service request placement, schema rejection, filter mappings, and mounted
    dialog/table behavior.
11. [x] **P2 — Validate.** Run reference-locale comparison, affected tests,
    lint, typecheck, build, `git diff --check`, and final UI/accessibility review.

## Non-discrepancies and target adaptations

- `@shared/tables`, `@iap/forms`, `@iap/ui`, and `@iap/dialogs` are valid
  target equivalents for reference-local primitives.
- Target contracts use Zod v4 `.loose()` instead of reference `.passthrough()`;
  this is required by target architecture and retains unknown response fields.
- Target feature-local Zustand replaces reference provider/context because target
  architecture assigns coordinated feature UI state to `model/`.
- Component names that can remain feature-local now mirror the reference:
  `DamageCodeDataTableTools`, `DamageCodePricingDataTableToolbar`,
  `DamageCodePricingRowActions`, and `DamageCodePricingDeleteMethodDialog`.
  The target keeps these under `pages/index/components/` and composes the
  shared delete dialog rather than duplicating shared UI infrastructure.

## Completion criteria

- Every direct reference child has an equivalent target component and behavior.
- Every reference API call is represented by a validated target service method.
- The locale diff contains no missing or mismatched mounted keys.
- Evidence is recorded only after all listed validation commands pass.

## Verification evidence

- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test`
  passed: 100 tests in 45 files.
- `pnpm --filter iap-admin lint` and `pnpm --filter iap-admin typecheck`
  passed; the iap-admin Vite production build also completed successfully.
- `git diff --check` passed.
- The programmatic Persian locale comparison reported `0 missing, 0 mismatched`
  for the complete `damageCodes` and `damageCodePricings` reference closure.
