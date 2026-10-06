# Assignment Rules Reference Contract Decision

## Scope and Accepted Decision

On 2026-10-06 the user chose the inspected `insurance-ui` contract for the admin `/assignement-rules/` page, including API/schema/component names, Persian translation keys/values, and form/table behavior. Existing architecture boundaries continue to govern ownership: routes stay thin, feature internals are not imported cross-feature, and shared contracts belong in `@iap/api-types`.

## Contract and Architecture Implications

- **API Contracts & Validation:**
  - Contracts live in `@iap/api-types/src/assignement-rule/index.ts` (`assignementRuleSchema`, `assignementRuleRequestSchema`, `assignementRulePageRequestSchema`, `assignementRuleIdsSchema`).
  - Request payloads convert `fromDate` and `thruDate` to ISO string representations via `toPayload()`.
  - Service methods (`getPage`, `getById`, `create`, `update`, `delete`, `bulkDelete`) use `/assignement-rules` endpoint namespace and default pagination size `30`.

- **State Management & Fast Refresh:**
  - Feature state lives in `context/assignement-rule-context.tsx`, exporting `AssignementRuleProvider`, `useAssignementRuleStore`, and `useAssignementRule`.
  - To maintain React Fast Refresh compliance alongside named hook/store exports in a `.tsx` file, mark the exports with `// eslint-disable-next-line react-refresh/only-export-components`.

- **Form & Field Interactions:**
  - Form state uses `useForm<AssignementRuleForm>` with Zod schema `assignementRuleFormSchema(t)` translating error messages.
  - Number fields (`extPolicyId`, `extContractId`, `extWorkUnitCode`, `amountMin`, `amountMax`, etc.) use helper formatting with `numberWithComma` or `numerical`.
  - Lookup field `AgreementPolicyIdField` uses debounced search (`useDebouncedValue`), edit fallback lookup (`extPolicyId`), and `@iap/ui`'s `SearchableSelect`.
  - Status select uses `@iap/ui`'s `SingleSelect` with `ACTIVE` and `INACTIVE` values.
  - Dates use `DatePicker` with `clearable` and `presentation='reference'`.

- **Delete & Bulk Delete Dialogs:**
  - Uses `@iap/dialogs` `ConfirmDialog` with `presentation='reference'` and `variant='error'`.
  - Bulk delete dialog reflects reference title with `IconTrash` and destructive styling.

## Reusable Reference Page Parity Patterns

1. **Exact Parity Checklist:**
   Always inspect reference component hierarchy: route -> page -> context/store -> toolbar -> columns -> dialogs -> fields -> contracts -> translations.
2. **Translation Key Consistency:**
   Ensure identical casing (e.g. `assignementRules` keeping the reference spelling) and verify translations between reference `fa.json` and target `common.json`.
3. **Icons & Controls:**
   Use `@tabler/icons-react` icons matching reference (`IconTrash`, `IconRefresh`, `IconPlus`, `IconEdit`).
4. **Mock Hoisting in Vitest:**
   When mocking services in tests, wrap mock functions used inside `vi.mock` with `const { mockFn } = vi.hoisted(() => ({ mockFn: vi.fn() }))`.
