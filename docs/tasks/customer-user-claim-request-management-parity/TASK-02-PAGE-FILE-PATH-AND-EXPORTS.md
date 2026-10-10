# Task 02 — Page File Path and Exports

## Objective
Place `CustomerUserClaimRequestManagementPage` at `apps/iap-admin/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx` with default export matching reference `insurance-ui/src/features/customer-user/pages/customer-user-claim-request-management-page.tsx`.

## Details
- In reference, pages in customer-user are flat:
  - `pages/customer-user-dashboard-page.tsx`
  - `pages/customer-user-claim-requests-page.tsx`
  - `pages/customer-user-claim-request-management-page.tsx`
- Ensure `customer-user-claim-request-management-page.tsx` exists directly at `src/features/customer-user/pages/customer-user-claim-request-management-page.tsx` with `export default function CustomerUserClaimRequestManagementPage()`.
- Keep backward compatibility in `pages/claim-request-management/` and feature barrel `index.ts`.
