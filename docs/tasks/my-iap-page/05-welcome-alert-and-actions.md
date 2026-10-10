# Task 05: Welcome Alert and Quick Actions

## Context
In `insurance-ui`, the top section of `MyIapPage` contains `MyClaimWelcomeAlert` (with dynamic user name, descriptions, and 5 action buttons) and `MyIapSupportAlert` (visible only for Hoze support policies).

## Requirements
1. **`useHasHozeSupportPolicyIds` Hook (`apps/iap-app/src/features/home/hooks/use-has-hoze-support-policy-ids.ts`)**:
   - Queries policies via `useGetMyInsurancePolicy()`.
   - Checks if any policy ID is in `supportPolicyIds`.
   - Returns boolean `hasEligiblePolicy`.

2. **`MyClaimPolicyPdfDownloadActions` (`apps/iap-app/src/features/home/components/my-claim-policy-pdf-download-actions.tsx`)**:
   - Fetches policies via `useGetMyInsurancePolicy()`.
   - Filters policies with `hasPolicyPdf(policy.id)`.
   - Returns `null` if no downloadable policies exist.
   - Renders Button (`variant='outline'`, `size='sm'`, sky border/text):
     - Icon: `Download` (`h-4 w-4`).
     - Label: `t('myiap.myIapPage.downloadPolicyPdf')`.
     - On click: downloads `/policy/${policy.id}.pdf` for each eligible policy.

3. **`MyClaimBankAccountAction` (`apps/iap-app/src/features/home/components/my-claim-bank-account-action.tsx`)**:
   - Checks `useHasHozeSupportPolicyIds()`: returns `null` if user is in Hoze support policy.
   - Manages dialog state `isDialogOpen`.
   - Renders Button (`variant='outline'`, `size='sm'`):
     - Icon: `CreditCard` (`h-4 w-4`).
     - Label: `t('myiap.myIapPage.bankAccountInfo')`.
     - On click: opens dialog.
   - Renders `<MyBankAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />`.

4. **`MyClaimWelcomeActions` (`apps/iap-app/src/features/home/components/my-claim-welcome-actions.tsx`)**:
   - Flex container with `justify-end gap-2 flex-wrap`.
   - Renders 5 action buttons in reference order:
     1. `<MyClaimPolicyPdfDownloadActions />`
     2. Medical Referral Letters:
        - Link to `/pre-auths/`.
        - Button variant='outline', size='sm', violet styled (`border-violet-500 text-violet-600 dark:border-violet-400 dark:text-violet-300`).
        - Icon: `FileText` (`h-4 w-4`).
        - Text: `t('myiap.myIapPage.medicalReferralLetters')`.
     3. `<MyClaimBankAccountAction />`
     4. Contracting Party Centers:
        - External link to `https://alborzinsurance.ir/MedicalCenters` (`target='_blank'`, `rel='noopener noreferrer'`).
        - Button variant='outline', size='sm', orange styled (`border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-300`).
        - Icon: `Building2` (`h-4 w-4`).
        - Text: `t('myiap.myIapPage.contractingPartyCenters')`.
     5. Tutorial Video:
        - Link to `/video/panel-customer-02.mp4` (`target='_blank'`, `rel='noopener noreferrer'`).
        - Button variant='outline', size='sm'.
        - Icon: `PlayCircle` (`h-4 w-4`).
        - Text: `t('myiap.myIapPage.watchTutorial')`.

5. **`MyClaimWelcomeAlert` (`apps/iap-app/src/features/home/components/my-claim-welcome-alert.tsx`)**:
   - Resolves user name from `useAuthSession()`: `user?.displayName?.trim() || user?.username || t('myiap.myIapPage.guest')`.
   - Dynamic tenant styling matching reference:
     - Border and background tint using tenant theme token or `VITE_MY_IAP_NAV_BACKGROUND`.
   - Icon: `Info` (`h-4 w-4`).
   - Title: `t('myiap.myIapPage.welcomeTitle', { name: userName })`.
   - Description:
     - `t('myiap.myIapPage.welcomeDescription')`
     - `t('myiap.myIapPage.panelIntroduction')`
     - `<MyClaimWelcomeActions />`

6. **`MyIapSupportAlert` (`apps/iap-app/src/features/home/components/my-iap-support-alert.tsx`)**:
   - Checks `useHasHozeSupportPolicyIds()`; returns `null` if false.
   - If true: renders alert with `Headphones` icon and `t('myiap.myIapPage.supportAlertDescription')`.
