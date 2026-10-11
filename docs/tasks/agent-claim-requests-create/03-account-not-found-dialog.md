# Task 03: Account Not Found Dialog

## 1. Objective

Implement `AgentClaimRequestAccountNotFoundDialog` in `apps/iap-admin/src/features/agent-claim-requests/pages/create/components/agent-claim-request-account-not-found-dialog.tsx` with exact visual and behavioral parity to `insurance-ui`.

## 2. Reference Implementation

In `insurance-ui/src/features/agent-claim-requests/components/agent-claim-request-account-not-found-dialog.tsx`:
- Triggered when the inquiry query returns a 404 Axios error (`isAxiosError(error) && error.response?.status === 404`).
- Uses `ConfirmDialog` with:
  - `title`: `t('agent.claimRequests.create.accountNotFound.title')`
  - `desc`: Compound text highlighting `«ثبت‌نام بیمه‌شده»` in bold.
  - `confirmText`: `t('agent.claimRequests.create.accountNotFound.understood')`
  - `footerChildren`: Secondary outline `Button` navigating to `/agent/users/create` (`t('agent.claimRequests.create.accountNotFound.registerInsured')`).
  - `hideCancelButton: true`
  - `handleConfirm: () => onOpenChange(false)`

## 3. Implementation in `iap-admin`

- In `iap-admin`, route paths use trailing slashes: `/agent/users/create/`.
- Ensure `ConfirmDialog` from `@iap/dialogs` cleanly renders the secondary action in the footer, or compose with `AlertDialog` primitives from `@iap/ui` ensuring exact visual parity.
- Props:
  ```ts
  interface AgentClaimRequestAccountNotFoundDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
  ```

## 4. Verification

Unit tests in `agent-claim-request-account-not-found-dialog.test.tsx`:
- Renders title, description parts, and both buttons when open.
- Clicking "understood" calls `onOpenChange(false)`.
- Clicking "register insured" navigates to `/agent/users/create/`.
