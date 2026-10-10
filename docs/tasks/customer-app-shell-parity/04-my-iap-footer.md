# Task 04: MyIapFooter

## Objective

Update the customer portal footer (`MyIapFooter`) to match `insurance-ui` (`src/components/layout/my-iap-footer.tsx`), including desktop navigation links and localized copyright statement.

## Reference Implementation

In `insurance-ui/src/components/layout/my-iap-footer.tsx`:
```tsx
export function MyIapFooter() {
  const { t } = useTranslation()

  const footerLinks = [
    { to: '/myiap', label: t('myiap.nav.home') },
    { to: '/myiap/myclaims', label: t('myiap.nav.myClaims') },
    { to: '/myiap/myclaims/create', label: t('myiap.nav.createClaim') },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className='hidden border-t bg-card md:block'>
      <div className='container px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <nav className='flex flex-wrap items-center gap-2'>
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-primary-600 dark:hover:text-primary-50'
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className='text-sm text-gray-600 dark:text-gray-400'>
            {t('myiap.footer.copyright', {
              year: currentYear,
              company: import.meta.env.VITE_LOGIN_COMPANY,
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/my-iap-footer.tsx`
- Alias export: `export { MyIapFooter as AppFooter }` in `app-footer.tsx`.
- Footer navigation links: `/`, `/myclaims/`, `/myclaims/create/`.
- Styling: responsive flex container, hover styles aligned with `@iap/ui` theme colors.
- Copyright text with dynamic year and `VITE_LOGIN_COMPANY`.
