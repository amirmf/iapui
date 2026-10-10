# Customer App Shell (`MyIapLayout`) Reference Parity

## Scope and Intent

Achieve exact reference parity between the customer portal shell in `apps/iap-app` and the reference implementation in `insurance-ui` (`src/components/layout/my-iap-layout.tsx` and related subcomponents), fully compliant with `iap-ui` architecture (`docs/architecture/APPLICATION-ARCHITECTURE.md` and `docs/architecture/SUPPORT-INTEGRATION.md`).

Key requirements:
- Decompose monolithic/inlined layout logic into small, focused, single-responsibility components for readability and performance.
- Exact parity with reference component names, APIs, schemas, translation keys, and visual design (using `ui-ux-pro-max` and Tailwind).
- Dynamic theme background colors (`VITE_MY_IAP_NAV_BACKGROUND` / `DARK`) for header and mobile bottom navigation.
- Full 4-panel switcher support (Evaluation, Agent, Customer, Customer-User).
- Seamless Support Flow integration (`SupportFlowProvider` and `SupportFlowWidget`).

## Reference Mapping

| Reference (`insurance-ui`) | Target (`apps/iap-app`) | Responsibility |
| --- | --- | --- |
| `src/components/layout/my-iap-layout.tsx` | `src/shared/app-shell/my-iap-layout.tsx` | Root layout shell composing header, content, footer, bottom nav, support, dialogs |
| `src/components/layout/layout-loading.tsx` | `src/shared/app-shell/layout-loading.tsx` | Authentication session loading screen |
| `src/components/layout/my-iap-header.tsx` | `src/shared/app-shell/my-iap-header.tsx` | Fixed branded header with nav links, panel switcher, user actions |
| `src/components/layout/my-iap-user-actions.tsx` | `src/shared/app-shell/my-iap-user-actions.tsx` | Theme switch and user profile dropdown (avatar, name, email, sign out) |
| `src/components/layout/my-iap-footer.tsx` | `src/shared/app-shell/my-iap-footer.tsx` | Desktop footer with navigation links and copyright |
| `src/components/layout/my-iap-bottom-nav.tsx` | `src/shared/app-shell/my-iap-bottom-nav.tsx` | Mobile fixed bottom navigation bar with active theme colors and bot trigger |
| `src/components/layout/panel-switcher.tsx` & `panel-registry.ts` | `src/shared/app-shell/app-panel-switcher.tsx` | Multi-panel switcher supporting all 4 authorized panels |

## Architectural Decisions

1. **Component Granularity**:
   - Split `AppShell` and `AppHeader` into dedicated components: `MyIapLayout`, `LayoutLoading`, `MyIapHeader`, `MyIapUserActions`, `MyIapFooter`, `MyIapBottomNav`.
   - Maintain backward compatibility: export `AppShell` as an alias of `MyIapLayout`.

2. **Styling & Theming**:
   - Header is `fixed top-0 z-50 w-full` with dynamic `background` inline style bound to `theme === 'dark' ? VITE_MY_IAP_NAV_BACKGROUND_DARK : VITE_MY_IAP_NAV_BACKGROUND`.
   - Spacer `<div className='h-14 w-full' />` rendered right below fixed header.
   - Mobile bottom nav active indicator uses dynamic `activeColor` (`VITE_MY_IAP_NAV_BACKGROUND` / `DARK`).

3. **URL Routing Conventions in `iap-app`**:
   - As per `APPLICATION-ARCHITECTURE.md` and `SUPPORT-INTEGRATION.md`, the customer portal removed the `/myiap` path prefix:
     - Home: `/` (reference: `/myiap`)
     - My Claims: `/myclaims/` (reference: `/myiap/myclaims`)
     - Create Claim: `/myclaims/create/` (reference: `/myiap/myclaims/create`)
     - Pre-auths: `/pre-auths/` (or special-diseases: `/special-diseases/`)

4. **Security Dialogs**:
   - `ForcePasswordChangeDialog` and `AuditInformationDialog` remain mounted in `MyIapLayout` per `iap-ui` architecture.

5. **Translations**:
   - Use exact translation keys from reference (`myiap.brand`, `myiap.nav.*`, `myiap.footer.*`, `auth.login.loading`, `common.signOut`, `common.theme.toggle`).

## Task Index

- `01-layout-loading.md`: Extract `LayoutLoading` component with spinner and translated status.
- `02-my-iap-header-and-nav.md`: Implement `MyIapHeader` with dynamic background, logo, links, and spacer.
- `03-my-iap-user-actions.md`: Implement `MyIapUserActions` with user dropdown, avatar fallback, and theme toggle.
- `04-my-iap-footer.md`: Implement `MyIapFooter` with desktop links and copyright.
- `05-my-iap-bottom-nav.md`: Implement `MyIapBottomNav` with active color indicators and bot action.
- `06-panel-switcher-parity.md`: Expand `AppPanelSwitcher` to handle all 4 application panels.
- `07-my-iap-layout-assembly.md`: Assemble `MyIapLayout`, export `AppShell` alias, update `_authenticated/route.tsx`.
- `08-locales-and-env-types.md`: Update `vite-env.d.ts` and ensure all required locale keys are present.
- `09-verification-and-tests.md`: Run typecheck, lint, build, and add layout unit tests.
