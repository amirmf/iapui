# Task 02: Layout Contracts and Sidebar Data

## Objectives

1. Create navigation contract and data definitions for Agent panel:
   - File: `apps/iap-admin/src/shared/app-shell/agent-navigation.ts`
   - Parity with `insurance-ui/src/components/layout/data/agent-sidebar-data.ts`.
   - Items:
     1. `/agent/claim-requests/` - `sidebar.claimRequestsAgent` - FileText icon
     2. `/agent/claim-requests/create/` - `sidebar.createClaimRequests` - FilePlus icon
     3. `/agent/users/create/` - `sidebar.createInsuredUser` - UserPlus icon
2. Create navigation contract and data definitions for Customer-User panel:
   - File: `apps/iap-admin/src/shared/app-shell/customer-user-navigation.ts`
   - Parity with `insurance-ui/src/components/layout/data/customer-user-sidebar-data.ts`.
   - Items:
     1. `/customer-user/` - `sidebar.dashboard` - LayoutDashboard icon
     2. `/customer-user/claim-requests/` - `customerUser.claimRequests.nav` - FileText icon
3. Add missing translations in `apps/iap-admin/src/shared/i18n/locales/fa/common.json`:
   - Verify `sidebar.createInsuredUser` ("ثبت‌نام بیمه‌شده" or "ایجاد بیمه شده")
   - Verify `customerUser.claimRequests.nav` ("درخواست‌های خسارت")
   - Verify `panelSwitcher.panels.agent` ("پنل نماینده ثبت")
   - Verify `panelSwitcher.panels.customerUser` ("پنل بیمه‌گذار")

## Acceptance Criteria

- Navigation items match reference exact labels, paths, and icons.
- Role-based filtering utility (`canAccessPathByRole`, `canNotAccessPathByRole`) applies to all items.
- All translation keys resolve without missing key fallbacks.
