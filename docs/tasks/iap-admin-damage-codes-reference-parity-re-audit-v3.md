# Damage Codes reference parity re-audit v3

## Scope

Compare the complete mounted closure of
`insurance-ui/src/features/damage-codes/pages/damage-codes-page.tsx` and its
damage-code-pricing feature with the target route at `/damage-codes/`.
The reference is authoritative for user-visible UI, component behavior, API
calls, schemas, and Persian values. The target keeps its approved ownership
boundaries from `APPLICATION-ARCHITECTURE.md`.

## Verified discrepancies

1. [x] **P0 — The lower pricing section unmounts while the row pricing dialog
   is open.** The reference always mounts `DamageCodePricingsSection`; target
   conditionally removes it for `openDialog === 'pricing'`. Keep it mounted.
2. [x] **P0 — The pricing section receives the full damage-code response.**
   Reference passes a `DamageCodeSummary`. Target must derive and pass the
   same `{ id, code, title }` shape, preserving the package-owned schema type.
3. [x] **P1 — Page and section visual composition differs.** Restore the
   reference flex layout, action-button variants/classes/icon size, and
   reference-equivalent spacing while using target primitives and the existing
   application shell instead of a missing target `Main` component.
4. [x] **P1 — Form defaults and reset behavior differ.** The pricing table
   form must preserve reference `undefined` start-date defaults and reset on
   close. Align main form dialog header/scroll/date field layout with reference.
5. [x] **P1 — Date presentation differs.** Cards and detail dialogs must use
   the reference `PPpp` formatting where the reference explicitly does so.
6. [x] **P1 — Response-schema nullability differs.** `DamageCode.status` must
   match the reference optional enum rather than accepting `null`.
7. [x] **P2 — Add regression coverage.** Cover the always-mounted pricing
   section/summary mapping and corrected pricing-form defaults in focused tests.
8. [x] **P2 — Validate.** Re-run locale comparison, tests, lint, typecheck,
   production build, and `git diff --check`.

## Verified target adaptations (not discrepancies)

- Target uses feature-local Zustand stores rather than reference context
  providers, as required by target architecture.
- Contracts live in `@iap/api-types`; Zod v4 `.loose()` and the common page
  response factory replace reference-local `.passthrough()` schemas.
- The target filter service uses `transformApiFilterParams` to serialize arrays
  with the shared `__in` transport contract. This replaces the reference's
  local comma-joining logic without changing the API filter semantics.
- Target uses `@iap/ui`, `@iap/forms`, `@shared/tables`, and `@iap/dialogs`
  instead of duplicating reference-local primitives.

## Verification evidence

- Locale comparison for `damageCodes` and `damageCodePricings`: `0` missing,
  `0` mismatched values.
- `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test`: `47` files and `103` tests passed.
- `pnpm --filter iap-admin lint`, `pnpm --filter iap-admin typecheck`, and
  `pnpm --filter iap-admin exec vite build` passed.
- `git diff --check` passed.

## Completion criteria

- All listed discrepancies are resolved with source-backed behavior.
- The Persian locale diff for `damageCodes` and `damageCodePricings` is empty.
- Tests and all validation commands pass; only then are task boxes checked.
