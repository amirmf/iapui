# TASK-08: Form Dialog and Supporting Form Fields

## Objective
Implement `AssignementRuleFormDialog` and its supporting fields: `AssignementRuleDocTypeCodeField` and `AgreementPolicyIdField`, with client-side validation, React Hook Form integration, mutation handling, and feedback toasts.

## Reference Source
- `insurance-ui/src/features/assignement-rules/data/assignement-rule-schema.ts` (`assignementRuleFormSchema`)
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-form-dialog.tsx`
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-doc-type-code-field.tsx`
- `insurance-ui/src/components/agreement/agreement-policy-id-field.tsx` & `agreement-field.tsx`

## Implementation Target
- Form schema: `apps/iap-admin/src/features/assignement-rules/model/assignement-rule-form-schema.ts`
- Doc type field: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-doc-type-code-field.tsx`
- Agreement policy field: `apps/iap-admin/src/features/assignement-rules/components/agreement-policy-id-field.tsx`
- Form dialog: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-form-dialog.tsx`
- Form tests: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-form-dialog.test.tsx`

## 1. Form Schema (`assignement-rule-form-schema.ts`)
```ts
import { assignementRuleStatusSchema } from '@iap/api-types'
import type { TFunction } from 'i18next'
import { z } from 'zod'

const assignementRuleNumericFormFields = {
  extPolicyId: z.string().optional(),
  extContractId: z.string().optional(),
  extWorkUnitCode: z.string().optional(),
  amountMin: z.string().optional(),
  amountMax: z.string().optional(),
  amountApprovedMin: z.string().optional(),
  amountApprovedMax: z.string().optional(),
}

export const assignementRuleFormSchema = (t: TFunction) =>
  z.object({
    title: z.string().trim().min(1, t('assignementRules.errors.titleRequired')),
    docTypeCode: z.string().trim().optional(),
    ...assignementRuleNumericFormFields,
    mainAssignedUserUsername: z.string().trim().optional(),
    status: assignementRuleStatusSchema,
    fromDate: z.date().nullish(),
    thruDate: z.date().nullish(),
  })

export type AssignementRuleForm = z.infer<
  ReturnType<typeof assignementRuleFormSchema>
>
```

## 2. Doc Type Code Field (`assignement-rule-doc-type-code-field.tsx`)
- Fetches doc type options using `@modules/doc-types` `docTypeService.getPage({ page: 0, size: 100 })`.
- Uses `@iap/ui`'s `Select` with `showSearch`, `clearable`, `options`, `value`, `onValueChange`.

## 3. Agreement Policy ID Field (`agreement-policy-id-field.tsx`)
- Allows selecting/searching agreements to set `extPolicyId`.
- Fetches agreements via `@features/agreements` or `@iap/api-client` `/agreements/page`.
- Supports search by title.
- In edit mode, fetches the agreement matching `extPolicyId` to resolve its display title.

## 4. Form Dialog (`assignement-rule-form-dialog.tsx`)
- **Dialog Shell:**
  - Uses `@iap/ui`'s `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`.
  - Open when `openDialog === 'create' || openDialog === 'edit'`.
  - Title: `isEdit ? t('assignementRules.dialog.edit') : t('assignementRules.dialog.create')`.
- **Form Layout:**
  Two-column grid (`grid grid-cols-1 gap-4 md:grid-cols-2`):
  1. `title`: required text input
  2. `docTypeCode`: `AssignementRuleDocTypeCodeField`
  3. `extPolicyId`: `AgreementPolicyIdField`
  4. `mainAssignedUserUsername`: text input
  5. `status`: `Select` with ACTIVE / INACTIVE options
  6. `extContractId`: numerical input
  7. `extWorkUnitCode`: numerical input
  8. `amountMin`: numerical input with comma
  9. `amountMax`: numerical input with comma
  10. `amountApprovedMin`: numerical input with comma
  11. `amountApprovedMax`: numerical input with comma
  12. `fromDate`: `DatePicker`
  13. `thruDate`: `DatePicker`
- **Mutations & Feedback:**
  - Create mutation calls `assignementRuleService.create(toRequestData(data))`.
  - Update mutation calls `assignementRuleService.update(id, toRequestData(data))`.
  - Success toasts: `t('assignementRules.messages.created')` / `t('assignementRules.messages.updated')`.
  - Standard mutation errors use the application Query Client error handler; do not override it with toast-only `onError` callbacks.
  - Awaits `refetch()`, closes dialog, resets current row.

## 5. Unit Tests
- Test validation failure when `title` is blank.
- Test data transformation (`toRequestData` and `toFormValues`).
- Test dialog open/reset synchronization.
- Test create and edit submit flows.

## Acceptance Criteria
- [ ] Field-level parity with reference project.
- [ ] Proper date object <-> string conversion.
- [ ] Numerical and comma-separated inputs format properly.
- [ ] Pending state protection disables buttons while mutating.
