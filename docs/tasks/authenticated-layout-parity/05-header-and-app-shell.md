# Task 05: Header, HeaderDate, ThemeSwitch & Breadcrumb

## Reference

- `insurance-ui/src/components/layout/header.tsx`
- `insurance-ui/src/components/layout/header-date.tsx`
- `insurance-ui/src/components/layout/breadcrumb.tsx`
- `insurance-ui/src/components/theme-switch.tsx`

## Deliverables

1. **`Breadcrumb` (Application Shell Integration)**:
   - Location: `apps/iap-admin/src/shared/app-shell/breadcrumb.tsx`
   - Uses `useMatches()` from `@tanstack/react-router` to extract `loaderData?.crumb`.
   - Composes `@iap/ui`'s `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`.
   - Renders home link (`homePageUrl || '/'`) with `t('breadcrumb.home')`.
   - Maps crumb items with translated labels (`t('breadcrumb.' + match.loaderData.crumb)`).

2. **`HeaderDate`**:
   - Location: `apps/iap-admin/src/shared/app-shell/header-date.tsx`
   - Parity with `insurance-ui`:
     - Renders formatted Persian date using `formatDate(new Date())` from `@iap/ui`.
     - Styling: `hidden px-2 text-sm text-text-primary sm:inline-block`.

3. **`ThemeSwitch`**:
   - Location: `apps/iap-admin/src/shared/app-shell/theme-switch.tsx`
   - Parity with `insurance-ui`:
     - Button with sun and moon icons with rotation animation.
     - Dropdown menu options:
       - `t('common.theme.light')` -> sets theme to 'light'
       - `t('common.theme.dark')` -> sets theme to 'dark'
       - `t('common.theme.system')` -> sets theme to 'system'
     - Uses `useThemeStore` from `@iap/theme`.

4. **`Header`**:
   - Location: `apps/iap-admin/src/shared/app-shell/header.tsx`
   - Parity with `insurance-ui`:
     - Props: `fixed?: boolean; homePageUrl?: string; className?: string; children?: ReactNode`
     - Scroll offset detection (`setOffset(document.body.scrollTop || document.documentElement.scrollTop)`).
     - Renders:
       - `<SidebarTrigger variant='outline' className='size-8 shrink-0 sm:size-7 [&_svg]:size-4' />`
       - `<Separator orientation='vertical' className='h-6' />`
       - `<Breadcrumb homePageUrl={homePageUrl} />`
       - Right actions container (`ltr:ml-auto rtl:mr-auto flex items-center gap-1`):
         - `<HeaderDate />`
         - `<AdminPanelSwitcher />` (matching variant `admin-header`)
         - `<ThemeSwitch iconClassName='size-5' />`
         - `{user && <NavUser user={user} isHeader />}`
       - `{children}`

## Verification Criteria

- Header adheres to elevation shadow changes on scroll.
- Breadcrumb renders current route hierarchy.
- Theme switch toggles html class and localStorage persistence.
- Date displays today's date formatted in Persian calendar.
