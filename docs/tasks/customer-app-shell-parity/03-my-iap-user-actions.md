# Task 03: MyIapUserActions

## Objective

Implement `MyIapUserActions` matching `insurance-ui` (`src/components/layout/my-iap-user-actions.tsx`).

## Reference Implementation

In `insurance-ui/src/components/layout/my-iap-user-actions.tsx`:
```tsx
export function MyIapUserActions() {
  const { user } = useAuth()
  const { i18n } = useTranslation()
  const name = user?.displayName?.trim() || user?.username || ''
  const email = user?.email ?? ''

  return (
    <div className='flex items-center gap-3'>
      <ThemeSwitch triggerClassName='text-white hover:bg-white/20 dark:hover:bg-white/20 hover:text-white dark:hover:text-white' />
      {user && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className='group text-white hover:bg-white/20 hover:text-white dark:hover:bg-white/20 dark:hover:text-white'
            asChild
          >
            <Button variant='ghost' className='relative flex items-center gap-2 px-0 py-0 sm:px-3 sm:py-2'>
              <Avatar className='size-8'>
                {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={name} /> : null}
                <AvatarFallback className='bg-transparent'>
                  <User className='size-5 sm:size-4' />
                </AvatarFallback>
              </Avatar>
              <span className='hidden text-sm font-medium sm:inline-block'>{name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={i18n.dir() === 'rtl' ? 'start' : 'end'} className='w-40'>
            <DropdownMenuLabel>
              <div className='grid flex-1 text-sm leading-tight ltr:text-left rtl:text-right'>
                <p className='text-sm font-medium leading-none'>{name}</p>
                {email && <p className='text-xs leading-none text-muted-foreground'>{email}</p>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LanguageSwitcher />
            <DropdownMenuSeparator />
            <SignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/my-iap-user-actions.tsx`
- Consumes `useAuthSession()` from `@iap/auth` for `user` and `logout`.
- Uses `ThemeSwitcher` from `@iap/theme`.
- Displays user trigger button with avatar (or fallback `UserRound` / `User` icon from `lucide-react`) and display name.
- Renders `DropdownMenu` from `@iap/ui`:
  - `DropdownMenuLabel` with name and email (if present).
  - `DropdownMenuSeparator`.
  - Sign out item (`DropdownMenuItem`) with `LogOut` icon and `t('common.signOut')`, calling `logout()`.
