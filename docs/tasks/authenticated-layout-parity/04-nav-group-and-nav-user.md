# Task 04: NavGroup, NavUser, LanguageSwitcher & SignOut

## Reference

- `insurance-ui/src/components/layout/nav-group.tsx`
- `insurance-ui/src/components/layout/nav-user.tsx`
- `insurance-ui/src/components/language-switcher.tsx`
- `insurance-ui/src/features/auth/components/sign-out.tsx`

## Deliverables

1. **`NavGroup` Component**:
   - Location: `apps/iap-admin/src/shared/app-shell/nav-group.tsx`
   - Parity with `insurance-ui`:
     - Renders `SidebarGroup`, optional `SidebarGroupLabel`.
     - Subcomponents:
       - `SidebarMenuLink`: For single nav links (`NavLink`). Uses `SidebarMenuButton` with `Link to={createLinkWithFilter(item.url, item.filter)}`. Closes mobile sidebar on click.
       - `SidebarMenuCollapsible`: For collapsible items when sidebar is expanded. Renders `Collapsible` with trigger button, chevron rotation, and `SidebarMenuSub` containing sub-items.
       - `SidebarMenuCollapsedDropdown`: For collapsible items when sidebar is collapsed in icon mode. Renders `DropdownMenu` trigger and content floating beside the collapsed icon.
     - `isNavItemActive(href, item)` helper supporting exact matches, query params, prefix matching with `matchDescendants`, trailing slash tolerance (`href.replace(/\/$/, '') === item.url?.replace(/\/$/, '')`), and active child detection.
     - Unit tests: Colocated in `apps/iap-admin/src/shared/app-shell/nav-group.test.ts`.

2. **`NavUser` Component**:
   - Location: `apps/iap-admin/src/shared/app-shell/nav-user.tsx`
   - Parity with `insurance-ui`:
     - Props: `{ user: AuthUser; isHeader?: boolean }`
     - Uses `useSidebar()` to detect mobile vs desktop placement (`side={isMobile ? 'bottom' : 'right'}`).
     - Renders user avatar (with fallback icon), user displayName/username and email.
     - When `isHeader` is true, hides label on small screens and integrates into the header bar.
     - Dropdown contains:
       - Header label with user details.
       - `DropdownMenuSeparator`.
       - `<LanguageSwitcher />`.
       - `DropdownMenuSeparator`.
       - `<SignOut />`.

3. **`LanguageSwitcher`**:
   - Location: `apps/iap-admin/src/shared/app-shell/language-switcher.tsx`
   - Toggles language between `fa` and `en` via `i18n.changeLanguage()`.

4. **`SignOut`**:
   - Location: `apps/iap-admin/src/shared/app-shell/sign-out.tsx`
   - Destructive dropdown menu item with `LogOut` icon and `t('common.signOut')`.
   - Calls `logout()` from `useAuthSession()`.

## Verification Criteria

- Active nav links reflect router location accurately.
- Collapsible submenus open/close correctly.
- LanguageSwitcher and SignOut perform expected actions.
