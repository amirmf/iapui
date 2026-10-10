# Task 05: MyIapBottomNav

## Objective

Update the mobile bottom navigation bar (`MyIapBottomNav`) to achieve parity with `insurance-ui` (`src/components/layout/my-iap-bottom-nav.tsx`), applying active navigation colors from the tenant theme and bot support trigger.

## Reference Implementation

In `insurance-ui/src/components/layout/my-iap-bottom-nav.tsx`:
```tsx
export function MyIapBottomNav() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { hasInitialQuestions, openSupport, isOpen } = useSupportFlow()

  const navLinks = [
    { to: '/myiap', label: t('myiap.nav.home'), icon: Home, exact: true },
    { to: '/myiap/myclaims', label: t('myiap.nav.myClaims'), icon: FileText, exact: true },
    { to: '/myiap/myclaims/create', label: t('myiap.nav.createClaim'), icon: PlusCircle, exact: false },
    { to: '/myiap/special-diseases', label: t('myiap.nav.specialDiseases'), icon: FileText, exact: false },
  ]

  const activeColor =
    theme === 'dark'
      ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
      : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-card md:hidden dark:border-gray-800'>
      <div className='flex h-16 items-center justify-around'>
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.exact, includeSearch: false }}
              className='flex h-full w-full flex-col items-center justify-center gap-1 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
              activeProps={{
                className: 'border-t-2',
                style: { color: activeColor, borderColor: activeColor },
              }}
            >
              <Icon className='h-6 w-6' />
              <span className='truncate px-1 text-xs font-medium'>{link.label}</span>
            </Link>
          )
        })}
        {hasInitialQuestions ? (
          <button
            type='button'
            className='flex h-full w-full flex-col items-center justify-center gap-1 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
            style={isOpen ? { color: activeColor, borderColor: activeColor } : undefined}
            onClick={() => openSupport()}
            aria-label={t('supportFlow.openLabel')}
          >
            <IconBot className='size-6' />
            <span className='truncate px-1 text-xs font-medium'>{t('supportFlow.bottomNavLabel')}</span>
          </button>
        ) : null}
      </div>
    </nav>
  )
}
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/my-iap-bottom-nav.tsx`
- Alias export: `export { MyIapBottomNav as AppBottomNavigation }` in `app-bottom-navigation.tsx`.
- Uses `useThemeStore((state) => state.theme)` from `@iap/theme`.
- Computes `activeColor` using `VITE_MY_IAP_NAV_BACKGROUND` and `VITE_MY_IAP_NAV_BACKGROUND_DARK`.
- Navigation items mapped to customer URLs.
- Uses `useSupportFlowStore` from `@iap/support` for `hasInitialQuestions`, `isOpen`, `openSupport` to render the bot action button matching reference styles and active state.
