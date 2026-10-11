---
name: authenticated-app-shell
description: Guide for building, maintaining, and extending operations panel routes, navigation, and pages within AuthenticatedLayout in iap-admin with exact reference parity to insurance-ui and compliance with application architecture.
---

# Authenticated App Shell & Layout

Use this skill when implementing, extending, or maintaining pages and navigation that live inside the operations partition (`_authenticated`) of `apps/iap-admin`, or modifying app shell navigation, breadcrumbs, search menu, and header controls.

## Architecture and Structure

The operations partition (`_authenticated`) provides the primary management experience in `iap-admin`. All routes under this partition render inside `AuthenticatedLayout`.

### 1. Component Assembly

`AuthenticatedLayout` (`apps/iap-admin/src/shared/app-shell/authenticated-layout.tsx`):
- **`LayoutLoading`**: Handles auth initialization and displays localized loading spinner.
- **`SupportFlowProvider` & `SupportFlowWidget`**: Injects chat and support flow capability from `@iap/support`.
- **`SearchProvider` & `CommandMenu`**: Provides global search with `Ctrl+K`/`Cmd+K` keyboard shortcut, theme switching, and quick navigation.
- **`SidebarProvider`**: Manages responsive collapsed/expanded state with persistence in `localStorage['sidebar_state']`.
- **`AppSidebar`**: Renders navigation links, role-filtered items (`canAccessPathByRole`), collapsible sections, and `NavUser` in the sidebar footer.
- **`#content` Container**: Responsive container with CSS variable width transitions:
  - `peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]`
  - `peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]`
- **`Header`**: Sticky header with elevation scroll tracking, `SidebarTrigger`, `Breadcrumb`, `HeaderDate`, `ThemeSwitch`, and `NavUser`.
- **Mandatory Security Dialogs**: Retains `<ForcePasswordChangeDialog />` and `<AuditInformationDialog />` from `@iap/auth` as required by `APPLICATION-ARCHITECTURE.md`.

### 2. Navigation Data and Parity

Navigation configuration lives in `apps/iap-admin/src/shared/app-shell/data/sidebar-data.ts`:
- Each item defines `title: t('sidebar.<key>')`, `url`, and a Lucide icon.
- For items with sub-routes or child views (e.g. details, edit), set `matchDescendants: true`.
- If an item requires default query parameters, specify `filter` (e.g. `{ status: 'SUCCESS' }`).
- Navigation helpers live in `apps/iap-admin/src/shared/app-shell/nav-utils.ts`:
  - `isNavItemActive(href, item, mainNav)`: Canonicalizes URLs, handles query params, matches trailing slashes and sub-routes.
  - `createLinkWithFilter(url, filter)`: Appends search query parameters safely.

### 3. Route Breadcrumbs

Breadcrumb navigation is automatically integrated via TanStack Router matches in `apps/iap-admin/src/shared/app-shell/breadcrumb.tsx`:
- Thin route files declare a loader returning `{ crumb: '<crumbKey>' }`.
- Breadcrumb labels are translated using `t('crumb.<crumbKey>', { defaultValue: t('breadcrumb.<crumbKey>') })`.
- If no crumb loader is defined, the component falls back to title-casing the URL pathname segment.

### 4. Code Standards & Rules

- **`component-props-in-body`**: In UI components, do NOT destructure props in the function signature:
  ```tsx
  // Correct:
  export function MyComponent(props: MyProps) {
    const { id, title } = props
    // ...
  }

  // Incorrect:
  export function MyComponent({ id, title }: MyProps) { ... }
  ```
- **Fast Refresh (ESLint)**: Keep pure functions (such as `isNavItemActive`, `createLinkWithFilter`) in utility files (`nav-utils.ts`), not inside files that export React components.
- **Class composition**: Always use the `cn` helper imported from `@iap/ui`. Do not assemble classes with template strings or inline ternaries.
- **Translations**: Always add visible strings to both `fa/common.json` and `en/common.json`.
