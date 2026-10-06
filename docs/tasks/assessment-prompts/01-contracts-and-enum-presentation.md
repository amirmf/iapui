# 01 — Contracts and enum presentation

Status: Implemented; source parity corrections documented in task09.

## Goal and reference

Use `src/features/assessment-prompts/data/assessment-prompt-schema.ts` and
`src/constants/assessment-prompts-constant.ts` from insurance-ui as evidence.

## Acceptance and implementation

- Exact ruleState/status/placeType values and source option ordering.
- Canonical source schema names, UUID/integer checks, nullish fields, nested
  stripping and source object field order.
- Form validation uses exact source English literals, not invented translations.
- Backend contracts belong to `@iap/api-types`; labels belong to the feature
  `constants/assessment-prompts-constant.ts`.
- Unknown request keys strip; page content is nullish per the user's explicit
  source-contract decision. Prior strict/factory assumptions are superseded.

## Evidence

Eight contract regression tests, two enum constant tests, and a direct comparison
of17 exported schemas on33 inputs each (561 comparisons) verify parsed output and
validation issue code/path/message/order. Final common checks are in task10.
