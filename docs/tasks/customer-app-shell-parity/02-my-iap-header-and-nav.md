# Task 02: MyIapHeader & Navigation

## Objective

Refactor `AppHeader` into `MyIapHeader` matching `insurance-ui` (`src/components/layout/my-iap-header.tsx`), featuring dynamic theme-based background color, spacer container, logo, navigation links, panel switcher, and user actions.

## Reference Implementation

In `insurance-ui/src/components/layout/my-iap-header.tsx`:
```tsx
export function MyIapHeader() {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const navLinks = useMemo(() => [
    { to: '/myiap', label: t('myiap.nav.home'), exact: true },
    { to: '/myiap/myclaims', label: t('myiap.nav.myClaims'), exact: true },
    { to: '/myiap/special-diseases', label: t('myiap.nav.specialDiseases'), exact: false },
    { to: '/myiap/myclaims/create', label: t('myiap.nav.createClaim'), exact: false },
  ], [t])

  return (
    <>
      <header
        className='fixed top-0 z-50 w-full border-b border-transparent shadow-md'
        style={{
          background:
            theme === 'dark'
              ? import.meta.env.VITE_MY_IAP_NAV_BACKGROUND_DARK
              : import.meta.env.VITE_MY_IAP_NAV_BACKGROUND,
        }}
      >
        <div className='container flex h-14 items-center px-4 sm:px-6 lg:px-8'>
          <Link to='/myiap' className='flex items-center gap-3'>
            <img
              src={import.meta.env.VITE_LOGIN_LOGO}
              alt={import.meta.env.VITE_LOGIN_COMPANY}
              className='h-10 w-10 min-w-10 object-cover object-center'
            />
            <span className='font-semibold tracking-tight text-white text-white/95 md:hidden lg:inline-block lg:text-lg'>
              {t('myiap.brand', { company: import.meta.env.VITE_LOGIN_COMPANY })}
            </span>
          </Link>
          <div className='flex-1 md:hidden' />
          <nav className='ms-8 hidden flex-1 items-center gap-1 sm:gap-2 md:flex lg:gap-4'>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-white/10 hover:text-white'
                activeOptions={{ exact: link.exact, includeSearch: false }}
                activeProps={{ className: 'bg-white/20 ring-1 ring-white/20' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <PanelSwitcher variant='header' />
          <MyIapUserActions />
        </div>
      </header>
      <div className='h-14 w-full' />
    </>
  )
}
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/my-iap-header.tsx`
- Preserves backwards compatibility by also exporting `AppHeader = MyIapHeader` from `app-header.tsx`.
- Uses `useThemeStore((state) => state.theme)` from `@iap/theme`.
- Background style dynamically applies `VITE_MY_IAP_NAV_BACKGROUND` and `VITE_MY_IAP_NAV_BACKGROUND_DARK`.
- Renders `<div className='h-14 w-full' />` spacer.
- Navigation links mapped for `iap-app` routes (`/`, `/myclaims/`, `/myclaims/create/`, and pre-auths/special-diseases).
- Embeds `<AppPanelSwitcher />` with inverted tone.
- Embeds `<MyIapUserActions />`.
