# Comprehensive Discrepancy Matrix: `AppShell` vs `MyIapLayout`

This document details every discrepancy between `AppShell` in `apps/iap-app` and `MyIapLayout` in `insurance-ui`, establishing the exact specifications required for parity.

---

## 1. Structural Comparison

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Component Name** | `MyIapLayout` | `AppShell` | Create `my-iap-layout.tsx` (`MyIapLayout`), export `AppShell` alias for backwards compatibility. |
| **Loading Wrapper** | Dedicated `LayoutLoading` wrapping the layout tree | Inlined inside `AppShell` | Extract `LayoutLoading` component in `layout-loading.tsx`. |
| **Loading Translation** | `auth.login.loading` ("در حال بررسی نشست...") | `shell.loading` | Use `t('auth.login.loading')` (with fallback to `t('shell.loading')`). |
| **Support Context** | `<SupportFlowProvider>` wraps layout | Missing provider, mounts compatibility `<SupportWidget>` | Wrap layout in `<SupportFlowProvider>` and mount `<SupportFlowWidget />` from `@iap/support`. |
| **Main Content Container** | `<main className='flex flex-1 flex-col bg-background pb-16 md:pb-0'>{children ? children : <Outlet />}</main>` | `<main className='flex flex-1 flex-col pb-16 md:pb-0' id='main-content' tabIndex={-1}><Outlet /></main>` | Support both `children` and `<Outlet />`, maintain `id='main-content'` and `tabIndex={-1}` for accessibility. |
| **Security Dialogs** | Mounted in root route | Mounted in layout | Maintain `<ForcePasswordChangeDialog />` and `<AuditInformationDialog />` per `iap-ui` architecture. |

---

## 2. Header Discrepancies (`MyIapHeader` vs `AppHeader`)

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Positioning** | `fixed top-0 z-50 w-full border-b border-transparent shadow-md` | `sticky top-0 z-50 border-b border-primary-700 bg-primary` | Change to `fixed top-0 z-50 w-full border-b border-transparent shadow-md`. |
| **Dynamic Background** | `style={{ background: theme === 'dark' ? VITE_MY_IAP_NAV_BACKGROUND_DARK : VITE_MY_IAP_NAV_BACKGROUND }}` | Hardcoded Tailwind `bg-primary` | Apply dynamic `style` attribute reading theme store and tenant env variables. |
| **Header Spacer** | `<div className='h-14 w-full' />` rendered after `<header>` | Missing | Render `<div className='h-14 w-full' />` after `<header>` to prevent layout shift. |
| **Logo & Brand** | `h-10 w-10 min-w-10 object-cover object-center`, text `font-semibold tracking-tight text-white text-white/95 md:hidden lg:inline-block lg:text-lg` | `size-10 shrink-0 object-contain`, `hidden text-sm font-semibold tracking-tight sm:inline lg:text-lg` | Match reference styling, classes, and responsive visibility (`md:hidden lg:inline-block`). |
| **Mobile Spacer** | `<div className='flex-1 md:hidden' />` between logo and actions | Missing | Add `<div className='flex-1 md:hidden' />`. |
| **Desktop Nav Classes** | `ms-8 hidden flex-1 items-center gap-1 sm:gap-2 md:flex lg:gap-4` | `mr-auto hidden gap-1 md:flex` | Match reference flex-1 and gap classes. |
| **Desktop Nav Items** | 1. Home (`/`)<br>2. My Claims (`/myclaims/`)<br>3. Special Diseases (`/special-diseases/`)<br>4. Create Claim (`/myclaims/create/`) | 1. Home<br>2. My Claims<br>3. Create Claim | Add Special Diseases (`specialDiseases`) link. |
| **User Actions** | Separate `<MyIapUserActions />` component | Inlined inside header | Extract to `MyIapUserActions`. |

---

## 3. User Actions Discrepancies (`MyIapUserActions`)

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Component Placement** | Dedicated `my-iap-user-actions.tsx` | Inlined in `app-header.tsx` | Create `my-iap-user-actions.tsx`. |
| **Trigger Presentation** | Ghost button with `Avatar` (image or fallback `User` icon) + name | Plain icon span + text span | Ghost button with `Avatar` and name text (`hidden text-sm font-medium sm:inline-block`). |
| **Profile Menu** | `DropdownMenu` with name, email, separators, LanguageSwitcher, and SignOut | No dropdown menu; separate logout icon button | Implement `DropdownMenu` containing `DropdownMenuLabel` (name + email), separator, and sign out item. |
| **Sign Out Item** | `<DropdownMenuItem variant='destructive' onSelect={...}><LogOut /><span>{t('common.signOut')}</span></DropdownMenuItem>` | Icon button outside dropdown | Move sign out inside `DropdownMenu` as destructive menu item. |
| **Theme Toggle** | `<ThemeSwitch triggerClassName='text-white hover:bg-white/20 dark:hover:bg-white/20 hover:text-white dark:hover:text-white' />` | Basic `<ThemeSwitcher />` | Pass transparent white hover classes to theme switcher. |

---

## 4. Footer Discrepancies (`MyIapFooter` vs `AppFooter`)

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Navigation Links** | `<nav className='flex flex-wrap items-center gap-2'>` with Home, My Claims, Create Claim | Completely missing | Add desktop navigation links with reference hover styles. |
| **Layout** | `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between` | Simple single-paragraph container | Implement flex row container separating nav links and copyright. |
| **Copyright Text** | Dynamic year and `VITE_LOGIN_COMPANY` | Dynamic year and `VITE_LOGIN_COMPANY` | Maintained. |

---

## 5. Mobile Bottom Navigation Discrepancies (`MyIapBottomNav`)

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Active Tab Color** | Dynamic `activeColor` (`VITE_MY_IAP_NAV_BACKGROUND` / `DARK`) applied to `color` and `borderColor` | Static Tailwind `border-primary text-primary` | Apply inline style with `activeColor` in `activeProps`. |
| **Navigation Items** | 1. Home (`Home`, exact)<br>2. My Claims (`FileText`, exact)<br>3. Create Claim (`PlusCircle`)<br>4. Special Diseases (`FileText`) | 1. Home<br>2. My Claims<br>3. Create Claim | Add Special Diseases tab. |
| **Support Flow Trigger** | Button with `IconBot`, dynamic `activeColor` when `isOpen`, click calls `openSupport()` | Inflexible `<SupportNavigationButton />` | Implement custom support button matching reference design and active styling. |

---

## 6. Panel Switcher Discrepancies (`AppPanelSwitcher`)

| Feature | Reference (`insurance-ui`) | Current Target (`iap-app`) | Required Parity Implementation |
| :--- | :--- | :--- | :--- |
| **Panel Coverage** | 4 panels: Evaluation, Agent, Customer, Customer-User | 2 panels: Customer, Evaluation | Register all 4 panels with role permissions. |
| **Display Order** | 1. Evaluation (`admin`)<br>2. Agent (`agent`)<br>3. Customer (`app`)<br>4. Customer-User (`customerUser`) | 1. Customer (`app`)<br>2. Evaluation (`admin`) | Order: Evaluation, Agent, Customer, Customer-User. |
| **Visual Tone** | Tone inverted for high-contrast navbar | `tone='inverted'` | Maintained. |

---

## 7. Locales & Environment Discrepancies

| Key / Variable | Reference Value | Current Target Value | Action |
| :--- | :--- | :--- | :--- |
| `auth.login.loading` | "در حال بررسی نشست..." | Missing in `iap-app` | Add to `fa/common.json`. |
| `myiap.nav.specialDiseases` | "بیماری‌های خاص" | Missing in `iap-app` | Add to `fa/common.json`. |
| `panelSwitcher.panels.agent` | "پنل نماینده ثبت" | Missing in `iap-app` | Add to `fa/common.json`. |
| `panelSwitcher.panels.customerUser` | "پنل بیمه‌گذار" | Missing in `iap-app` | Add to `fa/common.json`. |
| `VITE_MY_IAP_NAV_BACKGROUND` | Defined in tenant brand | Missing in `vite-env.d.ts` | Add to `vite-env.d.ts`. |
| `VITE_MY_IAP_NAV_BACKGROUND_DARK` | Defined in tenant brand | Missing in `vite-env.d.ts` | Add to `vite-env.d.ts`. |
