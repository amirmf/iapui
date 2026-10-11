# Task 08: Full Parity Audit and Discrepancies Plan

## Reference Comparison Target
- Reference Page: `insurance-ui/src/routes/agent/claim-requests/create.tsx`
- Reference Feature Page: `insurance-ui/src/features/agent-claim-requests/pages/agent-claim-requests-create-page.tsx`
- Reference Form: `insurance-ui/src/features/agent-claim-requests/components/agent-claim-request-form.tsx`
- Reference Dialog: `insurance-ui/src/features/agent-claim-requests/components/agent-claim-request-account-not-found-dialog.tsx`
- Reference Fields:
  - `agent-claim-request-inquiry-national-code-form-field.tsx`
  - `agent-claim-request-ext-policy-id-form-field.tsx`
  - `agent-claim-request-ext-national-code-form-field.tsx`
  - `agent-claim-request-form-doc-types.tsx`
- Reference UI & Schema:
  - `insurance-ui/src/components/ui/input-amount.tsx`
  - `insurance-ui/src/features/agent-claim-requests/data/agent-claim-request-form-schema.ts`
  - `insurance-ui/src/locales/fa.json`

---

## Detailed Discrepancies Inventory

### Discrepancy 1: Missing `InputAmount` Component & Currency / Persian Word Display
- **Reference**: Uses `InputAmount` from `@/components/ui/input-amount.tsx` with:
  - `<Input numerical numberWithComma className="pe-8" ... />`
  - Inner currency badge `<Unit unit="rial" />` positioned `absolute left-2 top-[20%]` showing `common.rial` ("ریال")
  - Footer converted Persian text: `numberToPersianWords(finalValue / 10)` + `common.toman` ("تومان")
  - Uses `numWithComma(field.value || '')` and `onlyNumberValue(event.target.value)`
- **Current Target**: Used basic `Input` with no `InputAmount`, no unit badge, no Persian number-to-words footer, and arbitrary `maxLength={11}`.
- **Resolution Task**:
  1. Implement `packages/ui/src/lib/number-utils.ts` (`numberToPersianWords`, `numWithComma`, `onlyNumberValue`, `persianToEnglishDigits`, `arabicToEnglishDigits`).
  2. Implement `packages/ui/src/input-amount.tsx` with full visual parity to reference.
  3. Export from `@iap/ui` and re-export utilities in `@iap/shared-lib`.
  4. Use `InputAmount` in `AgentClaimRequestForm`.

### Discrepancy 2: Missing Translation Key `common.toman`
- **Reference**: Uses `t('common.toman')` ("تومان") for amount in Tomans.
- **Current Target**: `common.toman` was absent in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
- **Resolution Task**:
  Add `"toman": "تومان"` to the `"common"` section in `common.json`.

### Discrepancy 3: `ConfirmDialog` Prop Aliases in `AgentClaimRequestAccountNotFoundDialog`
- **Reference**: Passes `desc`, `confirmText`, and `handleConfirm` to `ConfirmDialog`.
- **Current Target**: `ConfirmDialog` in `packages/dialogs/src/confirm-dialog.tsx` only accepted `description`, `confirmLabel`, and `onConfirm`.
- **Resolution Task**:
  Add `desc?: ReactNode`, `confirmText?: ReactNode`, and `handleConfirm?: () => void` as first-class aliases in `ConfirmDialogProps` in `packages/dialogs/src/confirm-dialog.tsx`.

### Discrepancy 4: `DatePicker` Prop Aliases (`selected`, `onSelect`)
- **Reference**: Passes `selected={field.value}` and `onSelect={field.onChange}` to `DatePicker`.
- **Current Target**: `packages/ui` `DatePicker` only accepted `value` and `onChange`.
- **Resolution Task**:
  Add `selected?: Date` and `onSelect?: (date: Date | undefined) => void` as aliases in `DatePickerProps` in `packages/ui/src/date-picker.tsx` and ensure `presentation="reference"` can be applied.

### Discrepancy 5: Schema Contract Types & Schema Alignments
- **Reference**:
  - Exports `MyClaimRequestPayload = Omit<AgentClaimRequestFormValues, 'extNationalCode'> & { extNationalCode: string }`.
  - Uses `defaultValues: Partial<AgentClaimRequestFormValues>` exactly as defined in `agent-claim-request-form.tsx`.
- **Current Target**: `MyClaimRequestPayload` was omitted.
- **Resolution Task**:
  Export `MyClaimRequestPayload` in `agent-claim-request-form-schema.ts`.

### Discrepancy 6: Page File Location & Default Export Parity
- **Reference**: `src/features/agent-claim-requests/pages/agent-claim-requests-create-page.tsx`
- **Current Target**: `apps/iap-admin/src/features/agent-claim-requests/pages/create/agent-claim-requests-create-page.tsx`
- **Resolution Task**:
  Provide both the modular directory and a re-export at `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-requests-create-page.tsx` to satisfy exact reference path expectations while maintaining workspace architecture.

---

## Parallel Execution Plan

### Track A: UI & Shared Primitives (Parallel Track 1)
- Implement `packages/ui/src/lib/number-utils.ts` and unit tests.
- Implement `packages/ui/src/input-amount.tsx` and unit tests.
- Update `packages/ui/src/index.ts` to export `InputAmount` and numeric helpers.
- Re-export helpers in `packages/shared-lib/src/index.ts`.
- Update `packages/dialogs/src/confirm-dialog.tsx` with `desc`, `confirmText`, `handleConfirm`.
- Update `packages/ui/src/date-picker.tsx` with `selected`, `onSelect` prop aliases.

### Track B: Translations & Schemas (Parallel Track 2)
- Add `"toman": "تومان"` to `apps/iap-admin/src/shared/i18n/locales/fa/common.json`.
- Add `MyClaimRequestPayload` and align defaultValues in `agent-claim-request-form-schema.ts`.

### Track C: Component Refinements & Integration (Dependent on Tracks A & B)
- Refactor `AgentClaimRequestForm.tsx` to use `InputAmount` (`numWithComma`, `onlyNumberValue`) and `DatePicker` (`selected`, `onSelect`).
- Refactor `AgentClaimRequestAccountNotFoundDialog.tsx` to use `desc`, `confirmText`, `handleConfirm`.
- Add `apps/iap-admin/src/features/agent-claim-requests/pages/agent-claim-requests-create-page.tsx` re-export.
- Update tests for `AgentClaimRequestForm`, `InputAmount`, and `ConfirmDialog`.
- Run full verification (`typecheck`, `lint`, `test`, `build`).
