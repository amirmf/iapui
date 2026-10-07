# Parity Audit Discrepancies: /sub-users/

Comparison between reference `insurance-ui` and target `iap-admin`.

## 1. Route & Navigation Discrepancies
- **File**: `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`
  - **Ref**: `loader: () => ({ crumb: 'sub-users' })`
  - **Target**: `loader: () => ({ crumb: 'subUsers' })`
  - **Impact**: Breadcrumbs fail to look up Persian title `"ارزیابان من"`.
  - **Ref**: Component imported as default export from `@/features/sub-users/pages/sub-users-page`.
  - **Target**: Imported from `@features/sub-users`.
- **File**: `apps/iap-admin/src/shared/i18n/locales/fa/common.json`
  - **Discrepancy**: Missing `"breadcrumb": { "sub-users": "ارزیابان من" }`.

## 2. Directory Structure & Exports Discrepancies
- **Page Placement**:
  - **Ref**: `src/features/sub-users/pages/sub-users-page.tsx`
  - **Target**: `apps/iap-admin/src/features/sub-users/sub-users-page.tsx`
  - **Fix**: Provide `pages/sub-users-page.tsx` with default export `SubUsersPage` and export from feature barrel.
- **Context Structure**:
  - **Ref**:
    - `src/features/sub-users/context/sub-user-context.tsx` (exports `useSubUserStore`, `useSubUser`, default `SubUserProvider`).
    - `src/features/sub-users/context/sub-users-agreements-context.tsx` (exports `useSubUsersAgreementsStore`, `useSubUsersAgreements`, default `SubUsersAgreementsProvider`).
  - **Target**: Separated into `context/store/` and `context/provider/` without root context files and without alias `useSubUsersAgreements`.
  - **Fix**: Add root context barrels/facades exporting exact functions and default providers.

## 3. SubUserFormDialog Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-user-form-dialog.tsx`
  - **Resolver**:
    - **Ref**: Uses `typedZodResolver(isEdit ? updateSubUserPayloadSchema(t) : createSubUserPayloadSchema(t))`
    - **Target**: Used custom inline async resolver.
    - **Fix**: Use `typedZodResolver`.
  - **Form Wrapper**:
    - **Ref**: `<Form {...form}>` from `@iap/forms`.
    - **Target**: `<FormProvider {...form}>`.
  - **Doctor User Exclusivity**:
    - **Ref**:
      ```tsx
      onChange={(roles) => {
        field.onChange(
          roles.includes(DOCTOR_USER_ROLE)
            ? [DOCTOR_USER_ROLE]
            : roles
        )
      }}
      ```
    - **Target**: Used conflicting multi-branch conditions.
    - **Fix**: Align exactly with reference ternary logic.
  - **Mutation Payload Assembly**:
    - **Ref**:
      ```tsx
      const finalData = {
        username: payload.username,
        email: null,
        partyFname: payload.partyFname,
        partyLname: payload.partyLname,
        mobileNumber: payload.mobileNumber,
        docTypeCodes: payload.docTypeCodes,
        roles: payload.roles,
        hasAccessToAllBranch: payload.hasAccessToAllBranch ?? null,
      }
      if (payload.password) finalData.password = payload.password
      if (payload.email) finalData.email = payload.email
      ```
    - **Target**: Used `email || null` instead of explicit null defaulting and truthy assignment.
  - **Mutation Success Lifecycle**:
    - **Ref**:
      ```tsx
      onSuccess: () => {
        toast.success(t('subUsers.messages.saveSuccess'))
        setOpen(null)
        refetch()
        queryClient.invalidateQueries({ queryKey: ['sub-users'] })
      }
      ```
    - **Target**: Called `setCurrentRow(null)` prematurely and lacked `refetch()`.

## 4. SubUserRowActions Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-user-row-actions.tsx`
  - **Ref**:
    ```tsx
    const { mutate: toggleUser } = useMutation({
      mutationFn: async (target: SubUser) => subUserService.disable(target.id),
      onSuccess: () => {
        toast.success(t('subUsers.messages.statusUpdateSuccess'))
        queryClient.invalidateQueries({ queryKey: ['sub-users'] })
      },
    })
    ```
    Called as: `onClick={() => toggleUser(user)}`
  - **Target**: Passed `user.id` through external hook.
  - **Fix**: Align mutation function signature to accept `user: SubUser` directly.

## 5. SubUserSection Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-user-section.tsx`
  - **Refresh Button**:
    - **Ref**: `<Button variant='outline' onClick={() => refetch()} disabled={isLoading}><IconRefresh className='mr-2 h-4 w-4' />{t('subUsers.actions.refresh')}</Button>`
    - **Target**: Added `isFetching ? 'animate-spin' : ''` and `disabled={isLoading || isFetching}`.
    - **Fix**: Match reference props and styling.

## 6. SubUsersAgreementsSection Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-users-agreements-section.tsx`
  - **Context Hook**:
    - **Ref**: `useSubUsersAgreements`
    - **Target**: `useSubUsersAgreementsStore`
    - **Fix**: Use `useSubUsersAgreements`.
  - **Refresh Button**:
    - **Ref**: `disabled={isLoading}` with `<IconRefresh className='mr-2 h-4 w-4' />`.
    - **Target**: Had additional animation class.

## 7. SubUsersAgreementPartySection Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-users-agreement-party-section.tsx`
  - **Context Hook**:
    - **Ref**: `useSubUsersAgreements((state) => state.selectedAgreement)`
    - **Target**: `useSubUsersAgreementsStore((state) => state.selectedAgreement)`
    - **Fix**: Use `useSubUsersAgreements`.

## 8. SubUserReleaseAssignmentsDialog Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/components/sub-user-release-assignments-dialog.tsx`
  - **Ref**:
    ```tsx
    const releaseAssignmentsMutation = useMutation({
      mutationFn: (userId: string) =>
        subUserService.releaseAssignments({ userId }),
      onSuccess: async () => {
        toast.success(t('subUsers.messages.releaseAssignmentsSuccess'))
        await queryClient.invalidateQueries({ queryKey: ['sub-users'] })
        onClose()
      },
    })
    ```
  - **Target**: Extracted hook with slightly different lifecycle sequencing.
  - **Fix**: Keep exact mutation lifecycle and `onClose` callback order.

## 9. Model & Schema Type Naming Discrepancies
- **File**: `apps/iap-admin/src/features/sub-users/model/sub-user-form-schema.ts`
  - **Ref**: Type names `CreateSubUserPayloadType`, `UpdateSubUserPayloadType`.
  - **Target**: `CreateSubUserPayload`, `UpdateSubUserPayload`.
  - **Fix**: Re-export both naming variants.
