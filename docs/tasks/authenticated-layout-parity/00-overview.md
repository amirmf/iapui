# AuthenticatedLayout Parity - Overview

## Objective

Implement `AuthenticatedLayout` in `apps/iap-admin` with exact reference parity to `insurance-ui` (`src/components/layout/authenticated-layout.tsx`), while strictly following `iap-ui` application architecture (`APPLICATION-ARCHITECTURE.md`), modular clean code, small reusable components, and optimal performance.

## Reference Source (`insurance-ui`)

Primary component: `insurance-ui/src/components/layout/authenticated-layout.tsx`

```tsx
export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = localStorage.getItem('sidebar_state') === 'true'
  const { navGroups } = useSidebarData()
  return (
    <LayoutLoading>
      <SupportFlowProvider>
        <SearchProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar navList={navGroups} />
            <div
              id='content'
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'sm:transition-[width] sm:duration-300 sm:ease-in-out',
                'flex min-h-screen flex-col gap-6 bg-background px-2 py-2 supports-[height:100svh]:min-h-svh sm:px-2 sm:py-4 md:pb-24',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
              )}
            >
              <Header />
              {children ? children : <Outlet />}
            </div>
            <SupportFlowWidget position='admin' />
          </SidebarProvider>
        </SearchProvider>
      </SupportFlowProvider>
    </LayoutLoading>
  )
}
```

## Architectural Placement & Module Boundaries

| Component / Capability | Reference Path (`insurance-ui`) | Target Path (`iap-ui`) | Package / Layer |
|---|---|---|---|
| `Sidebar` primitives | `src/components/ui/sidebar.tsx` | `packages/ui/src/sidebar.tsx` | `@iap/ui` |
| `Breadcrumb` primitives | `src/components/ui/breadcrumb.tsx` | `packages/ui/src/breadcrumb.tsx` | `@iap/ui` |
| `Skeleton` primitive | `src/components/ui/skeleton.tsx` | `packages/ui/src/skeleton.tsx` | `@iap/ui` |
| `CommandDialog` | `src/components/ui/command.tsx` | `packages/ui/src/command.tsx` | `@iap/ui` |
| `LayoutLoading` | `src/components/layout/layout-loading.tsx` | `apps/iap-admin/src/shared/app-shell/layout-loading.tsx` | `shared/app-shell` |
| `SearchProvider` | `src/context/search-context.tsx` | `apps/iap-admin/src/shared/app-shell/search-context.tsx` | `shared/app-shell` |
| `CommandMenu` | `src/components/command-menu.tsx` | `apps/iap-admin/src/shared/app-shell/command-menu.tsx` | `shared/app-shell` |
| `AppSidebar` | `src/components/layout/app-sidebar.tsx` | `apps/iap-admin/src/shared/app-shell/app-sidebar.tsx` | `shared/app-shell` |
| `NavGroup` | `src/components/layout/nav-group.tsx` | `apps/iap-admin/src/shared/app-shell/nav-group.tsx` | `shared/app-shell` |
| `NavUser` | `src/components/layout/nav-user.tsx` | `apps/iap-admin/src/shared/app-shell/nav-user.tsx` | `shared/app-shell` |
| `LanguageSwitcher` | `src/components/language-switcher.tsx` | `apps/iap-admin/src/shared/app-shell/language-switcher.tsx` | `shared/app-shell` |
| `SignOut` | `src/features/auth/components/sign-out.tsx` | `apps/iap-admin/src/shared/app-shell/sign-out.tsx` | `shared/app-shell` |
| `Header` | `src/components/layout/header.tsx` | `apps/iap-admin/src/shared/app-shell/header.tsx` | `shared/app-shell` |
| `HeaderDate` | `src/components/layout/header-date.tsx` | `apps/iap-admin/src/shared/app-shell/header-date.tsx` | `shared/app-shell` |
| `ThemeSwitch` | `src/components/theme-switch.tsx` | `apps/iap-admin/src/shared/app-shell/theme-switch.tsx` | `shared/app-shell` |
| `Breadcrumb` | `src/components/layout/breadcrumb.tsx` | `apps/iap-admin/src/shared/app-shell/breadcrumb.tsx` | `shared/app-shell` |
| `useSidebarData` | `src/components/layout/data/sidebar-data.ts` | `apps/iap-admin/src/shared/app-shell/data/sidebar-data.ts` | `shared/app-shell` |
| `SidebarData` types | `src/components/layout/types.ts` | `apps/iap-admin/src/shared/app-shell/types.ts` | `shared/app-shell` |
| `AuthenticatedLayout` | `src/components/layout/authenticated-layout.tsx` | `apps/iap-admin/src/shared/app-shell/authenticated-layout.tsx` | `shared/app-shell` |

## Key Rules & Workspace Invariants

1. **Security Dialogs**: In accordance with `APPLICATION-ARCHITECTURE.md`, preserve `<ForcePasswordChangeDialog />` and `<AuditInformationDialog />` from `@iap/auth` within the authenticated layout shell.
2. **Support Flow**: Utilize `@iap/support`'s `SupportFlowProvider` and `<SupportFlowWidget position='admin' />`.
3. **Panel Switcher**: Retain `AdminPanelSwitcher` or `<PanelSwitcher variant='admin-header' />` backed by `@iap/panel-switcher`.
4. **Theme Integration**: Back theme toggling via `@iap/theme` (`useThemeStore`).
5. **Clean Code & Performance**: Colocate state, optimize memoization (`useMemo` for filtered routes), avoid unnecessary rerenders, adhere to `vercel-react-best-practices`.
