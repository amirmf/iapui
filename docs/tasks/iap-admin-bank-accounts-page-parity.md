# iap-admin bank accounts page parity

## Scope

- Target route: `apps/iap-admin/src/app/router/routes/_authenticated/bank-account/index.tsx`
- Reference entry point: `insurance-ui/src/routes/_authenticated/bank-account/index.tsx`
- Reference page: `insurance-ui/src/features/bank-accounts/pages/bank-accounts-page.tsx`
- Reference source of truth: the mounted bank-accounts closure, including API
  contracts, Zod schemas, Persian translations, table URL state, CSV export,
  selection, dialogs, mutation sequencing, and row actions.

## File-by-file parity audit — 2026-09-30

The previous implementation was reviewed again against every directly mounted
reference file:

- `pages/bank-accounts-page.tsx`
- `data/bank-account-schema.ts`
- `context/bank-account-context.tsx`
- `services/bank-account-service.ts`
- every file in `components/`
- `hooks/use-export-csv.ts` and its `use-pivot-export-store` dependency
- `routes/_authenticated/bank-account/index.tsx`
- mounted `bankAccounts` locale namespace and the referenced `common` keys

### Confirmed differences requiring implementation

| ID | Reference source | Target source | Verified discrepancy | Status |
| --- | --- | --- | --- | --- |
| BA-01 | `bank-account-service.ts` | feature service | `getPage` defaults `size` to `1000` in the reference; target uses `40`. | Complete |
| BA-02 | `bank-account-schema.ts` | `@iap/api-types/bank-account` | The target page-response schema requires `content`, retains extra unknown fields, and adds nullable metadata; reference has a stripping object with every page property optional. | Complete |
| BA-03 | `bank-account-schema.ts` | `@iap/api-types/bank-account` | Target renamed `yesNoSchema` to `bankAccountValiditySchema`; source-compatible public schema naming is missing. | Complete |
| BA-04 | `bank-accounts-page.tsx` | target page | Target always mounts the delete dialog and relies on a no-op confirmation; reference mounts it only while `currentRow` exists. | Complete |
| BA-05 | delete/bulk-delete dialogs | target dialogs | Target invalidates a query instead of calling the reference `refetch` callback, changing the post-mutation timing and prop model. | Complete |
| BA-06 | delete/bulk-delete dialogs | target dialogs | Target uses the target dialog's `error` variant, which injects a different status icon; reference renders a destructive title with `IconTrash`. | Complete |
| BA-07 | header and row actions | target actions | Target uses Lucide icons and a wrapping header container; reference uses Tabler `IconTrash`/`IconRefresh` and non-wrapping `flex items-center gap-2`. | Complete |
| BA-08 | `bank-account-export-csv-button.tsx` | target export button | Target creates CSV rows eagerly with `useMemo`, maps an absent `isValid` to “no”, and uses a different icon. Reference creates rows on click, leaves absent `isValid` as “no” through its exact conditional translation expression, and uses `IconDownload`. | Complete |
| BA-09 | `hooks/use-export-csv.ts` | target shared CSV hook | Target has a local state + module `Set` and custom manual CSV serialization. Reference uses a Zustand per-key store, lazy-loads `xlsx`, converts via `utils.aoa_to_sheet`/`sheet_to_csv`, and saves through `file-saver`. | Complete |
| BA-10 | `bank-account-data-table-toolbar.tsx` | target toolbar | Target builds enum options from a local translation-key constant; reference declares the two source options explicitly. Rendered labels match, but the implementation model differs. | Complete |
| BA-11 | `bank-account-columns.tsx` | target columns | Target does not explicitly set `enableSorting: false` and `enableHiding: false` for the actions column as the reference does. | Complete |
| BA-12 | target router generated file | `routeTree.gen.ts` | A production build reformatted the generated route tree. This is unrelated generated churn and must not be kept as a hand-authored page change. | Generated artifact; no manual page implementation change. |

### Verified equivalent or intentional architecture mappings

| Reference responsibility | Target mapping | Result |
| --- | --- | --- |
| `Main` page container | `BankAccountsPageSurface` | Its rendered Tailwind surface classes are identical to `Main` without the reference-only fixed/header variant; retain target owner. |
| reference Zustand provider/store | target feature Zustand provider/store | Same dialog, row-selection, cleanup, and updater behaviour. |
| `useSyncQueryParamsTableFilter` | target feature table-state adapter | Both preserve the reference `page`, `size`, `sort`, and `direction` URL contract and its 40-row page default. |
| page query | `useBankAccountsData` | Query key, abort signal, cache times, and window-focus policy match. |
| table, filter, button, and dialog primitives | target public shared primitives | Required target architecture mapping; no source behaviour is invented. |
| reference `softDelete` and `getById` service methods | not mounted by `BankAccountsPage` | Out of scope: no page component invokes them. |
| `bankAccounts.*` locale values | target Persian locale | Exact namespace parity is already covered by a source-backed test. |

### API and translation provenance

- API method/path/body/query evidence comes only from the reference service.
- Schema field names, optionality, enum values, and Zod parsing behaviour come
  only from the reference schema.
- Persian values come only from `insurance-ui/src/locales/fa.json`; no labels
  are translated or inferred locally.
- The reference contains no bank-account-specific constants file. The target
  enum translation constant was therefore removed from the mounted page so the
  component model matches the reference.

## Tasks

| Priority | Task | Completion evidence | Status |
| --- | --- | --- | --- |
| P0 | Record the full mounted closure and every parity difference before modifying production code. | File-by-file audit above; BA-01 through BA-12 are traceable to source paths. | Complete |
| P0 | Align API defaulting and public schemas to the reference source. | BA-01 through BA-03; focused tests cover default size, optional page content, schema stripping, enum/schema exports, and invalid data. | Complete |
| P0 | Align page composition, actions, dialogs, and mutation success sequencing. | BA-04 through BA-07 and BA-11 are aligned with the source. | Complete |
| P0 | Replace the CSV implementation with the reference export pipeline and exact button behaviour. | BA-08 through BA-09 use the same package versions and export pipeline as the reference. | Complete |
| P1 | Restore explicit source toolbar options and remove only the unproven target-only constant usage. | BA-10 option order/value/label now mirrors the source. | Complete |
| P0 | Run focused tests, full iap-admin tests, typecheck, lint, production build, Prettier, and `git diff --check`. | `INSURANCE_UI_REFERENCE_PATH=/home/sadegh/Android/project/insurance-ui pnpm --filter iap-admin test` passed 46 files / 106 tests. Typecheck, lint, Prettier check, production build, and `git diff --check` pass. The production build emits only existing Rollup/Zod annotation and chunk-size warnings. | Complete |

## Architecture decisions

- `src/app` remains a route-only composition boundary; the root-only page is
  owned directly by `features/bank-accounts`.
- Public, cross-application contracts live in `@iap/api-types`; transport
  behaviour is feature-local because no other target feature consumes it.
- The target shared table/filter/dialog primitives replace equivalent
  reference-local primitives. No visual or endpoint behaviour is invented.
- The enum translation constant did not have a source equivalent, so it was
  removed. The mounted page keeps the reference's explicit options and keys.

## Completion criteria

- `/bank-account/` has parity with every mounted, source-backed reference
  behaviour.
- Components are small, page/feature-scoped, accessible, and use existing
  target primitives where equivalent.
- The feature validates API boundaries with Zod v4 and does not bypass package
  public APIs.
- No reference-only behaviour or untranslated text is introduced.
