# Customer Portal Shell Architecture

## Purpose

This document establishes the architecture, layout contracts, and design tokens for the customer portal (`apps/iap-app`), maintaining parity with `insurance-ui` (`src/components/layout/my-iap-*`) and conforming to `docs/architecture/APPLICATION-ARCHITECTURE.md`.

## Layout Hierarchy

The primary layout component is `MyIapLayout` (`apps/iap-app/src/shared/app-shell/my-iap-layout.tsx`). For backwards compatibility with initial implementations, `AppShell` is re-exported from `app-shell.tsx` as an alias.

```text
MyIapLayout
├── LayoutLoading
└── SupportFlowProvider
    └── <div className="flex min-h-screen flex-col bg-background text-foreground" dir="rtl">
        ├── MyIapHeader (fixed top-0 z-50 w-full, dynamic background style)
        ├── Spacer div (h-14 w-full)
        ├── <main className="flex flex-1 flex-col bg-background pb-16 md:pb-0" id="main-content" tabIndex={-1}>
        │     {children ?? <Outlet />}
        │   </main>
        ├── MyIapFooter (desktop nav links + copyright)
        ├── MyIapBottomNav (fixed bottom-0, active indicator style with activeColor)
        ├── SupportFlowWidget (floating bot launcher)
        ├── ForcePasswordChangeDialog
        └── AuditInformationDialog
```

## Route Conventions

As documented in `APPLICATION-ARCHITECTURE.md` and `SUPPORT-INTEGRATION.md`, the customer portal removed the `/myiap` path prefix:
- Home: `/` (reference: `/myiap`)
- My Claims: `/myclaims/` (reference: `/myiap/myclaims`)
- Create Claim: `/myclaims/create/` (reference: `/myiap/myclaims/create`)
- Special Diseases: `/special-diseases/` (reference: `/myiap/special-diseases`)
- Pre-Authorizations: `/pre-auths/` (reference: `/myiap/pre-auths`)

## Theming & Tenant Configuration

The customer navigation bar (`MyIapHeader`) and mobile bottom navigation active indicators apply dynamic background/accent colors defined per tenant in `tenants/<tenant>/brand.json`:
- `VITE_MY_IAP_NAV_BACKGROUND` (light mode)
- `VITE_MY_IAP_NAV_BACKGROUND_DARK` (dark mode)

These variables are resolved at build time via `tools/prepare-tenant.mjs`.

## Multi-Panel Switcher

`AppPanelSwitcher` registers all 4 authorized applications and partitions:
1. **Evaluation** (`admin`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/`)
2. **Registration Agent** (`agent`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/agent/claim-requests/`)
3. **Customer** (`app`): `VITE_IAP_APP_DOMAIN_URL` (`/`)
4. **Policyholder / Customer User** (`customerUser`): `VITE_IAP_ADMIN_DOMAIN_URL` (`/customer-user/`)
