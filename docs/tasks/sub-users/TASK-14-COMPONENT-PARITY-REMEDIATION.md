# TASK-14: Component Parity Remediation

Remediate all verified discrepancies between `insurance-ui` and `iap-admin` to achieve 100% exact parity.

## Sub-tasks

### 14.1 Route & Breadcrumbs Parity
- Update `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`:
  - Change `crumb: 'subUsers'` to `crumb: 'sub-users'`.
  - Import default `SubUsersPage` from `@features/sub-users/pages/sub-users-page`.
- Add `"sub-users": "ارزیابان من"` to `apps/iap-admin/src/shared/i18n/locales/fa/common.json` under `"breadcrumb"`.

### 14.2 Page & Context Structure Parity
- Add `apps/iap-admin/src/features/sub-users/pages/sub-users-page.tsx` with default export `SubUsersPage` matching reference layout.
- Add `apps/iap-admin/src/features/sub-users/context/sub-user-context.tsx`:
  - Exports `useSubUserStore`, `useSubUser`, and default `SubUserProvider`.
- Add `apps/iap-admin/src/features/sub-users/context/sub-users-agreements-context.tsx`:
  - Exports `useSubUsersAgreementsStore`, `useSubUsersAgreements`, and default `SubUsersAgreementsProvider`.
- Update `apps/iap-admin/src/features/sub-users/index.ts` to export `SubUsersPage`, `useSubUser`, `useSubUsersAgreements`, etc.

### 14.3 SubUserFormDialog Exact Parity
- In `apps/iap-admin/src/features/sub-users/components/sub-user-form-dialog.tsx`:
  - Integrate `typedZodResolver` using `@hookform/resolvers/zod`.
  - Use `<Form {...form}>` from `@iap/forms`.
  - Align Doctor role selection logic:
    `const hasDoctor = values.includes(DOCTOR_USER_ROLE); field.onChange(hasDoctor ? [DOCTOR_USER_ROLE] : values)`.
  - Align mutation logic: build `finalData` with `email: null` initially, append `password` and `email` only if truthy, call `refetch()`, `toast.success`, `setOpen(null)`, and invalidate `sub-users`.

### 14.4 SubUserRowActions Exact Parity
- In `apps/iap-admin/src/features/sub-users/components/sub-user-row-actions.tsx`:
  - Mutation signature: `mutationFn: async (target: SubUser) => subUserService.disable(target.id)`.
  - Button click handler: `toggleUser(user)`.

### 14.5 SubUserSection & AgreementsSection Button & Hook Parity
- In `apps/iap-admin/src/features/sub-users/components/sub-user-section.tsx`:
  - Refresh button: `disabled={isLoading}` with `<IconRefresh className='mr-2 h-4 w-4' />`.
- In `apps/iap-admin/src/features/sub-users/components/sub-users-agreements-section.tsx`:
  - Use `useSubUsersAgreements`.
  - Refresh button: `disabled={isLoading}` with `<IconRefresh className='mr-2 h-4 w-4' />`.
- In `apps/iap-admin/src/features/sub-users/components/sub-users-agreement-party-section.tsx`:
  - Use `useSubUsersAgreements((state) => state.selectedAgreement)`.

### 14.6 Model Type Aliases
- Export `CreateSubUserPayloadType` and `UpdateSubUserPayloadType` from `model/sub-user-form-schema.ts`.

## Verification Criteria
- [x] `vitest run src/features/sub-users` passes.
- [x] `pnpm typecheck` passes.
- [x] `pnpm lint` passes.
- [x] `pnpm format:check` passes.
- [x] `pnpm --filter iap-admin build` passes.
