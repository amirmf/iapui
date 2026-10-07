# TASK-08: Sub-User Form and Details Dialogs

## Objective
Implement `SubUserFormDialog` (create/update sub-user modal with validation and MultiSelect inputs) and `SubUserDetailsDialog` (readonly details modal using `ReadonlyItems`).

## Reference Source
- `insurance-ui/src/features/sub-users/components/sub-user-form-dialog.tsx`
- `insurance-ui/src/features/sub-users/components/sub-user-details-dialog.tsx`
- `insurance-ui/src/features/sub-users/data/sub-user-schema.ts`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/model/sub-user-form-schema.ts`
2. `apps/iap-admin/src/features/sub-users/components/sub-user-form-dialog.tsx`
3. `apps/iap-admin/src/features/sub-users/components/sub-user-details-dialog.tsx`

## Detailed Specifications

### 1. Form Schema (`sub-user-form-schema.ts`)
- `username`: 10 digits required (`^\d{10}$`)
- `password`: Required in create mode (min 6 chars); optional in edit mode.
- `partyFname`: Min 2 chars
- `partyLname`: Min 2 chars
- `email`: Valid email or empty/nullable
- `mobileNumber`: Iranian mobile regex (`^(\+989\d{9}|09\d{9})$`)
- `docTypeCodes`: Array with min 1 selection
- `roles`: Min 1 selection; refine: if `ROLE_DOCTOR_USER` is selected, no other role can be combined.

### 2. Form Dialog (`SubUserFormDialog`)
- Uses `useForm` with `typedZodResolver`.
- Fetches detailed sub-user if `editorId` is provided (`useSubUserByIdQuery`).
- Loads document type options via `useDocTypesData.optionsCode()`.
- MultiSelect for `roles` with automatic single-select enforcement when `ROLE_DOCTOR_USER` is chosen.
- Submits to `create` or `update` mutations.

### 3. Details Dialog (`SubUserDetailsDialog`)
- Modal rendering `ReadonlyItems` for:
  - `username`
  - `displayName`
  - `email`
  - `mobileNumber`
  - `status` (active / inactive badge text)

## Acceptance Criteria
- [ ] Complete field error messages localized via `subUsers.validation.*`.
- [ ] Doctor role exclusivity enforced both at Zod schema level and UI selection level.
- [ ] Reset on dialog close clears dirty state and values.
