# Task 02: Layout Loading & Search Provider / Command Menu

## Reference

- `insurance-ui/src/components/layout/layout-loading.tsx`
- `insurance-ui/src/context/search-context.tsx`
- `insurance-ui/src/components/command-menu.tsx`

## Deliverables

1. **`LayoutLoading` Component**:
   - Location: `apps/iap-admin/src/shared/app-shell/layout-loading.tsx`
   - Parity with `insurance-ui`:
     - Reads `isLoading`, `isAuthenticated`, and `user` from `useAuthSession()`.
     - Displays `Loader2 className='h-8 w-8 animate-spin'` and translated text `t('auth.login.loading')` (with fallback `t('shell.loading')`).
     - Returns `children` once loaded and authenticated.

2. **`SearchProvider` & `useSearch` Context**:
   - Location: `apps/iap-admin/src/shared/app-shell/search-context.tsx`
   - Parity with `insurance-ui`:
     - Context type: `{ open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }`.
     - `useEffect` for keyboard shortcut: `Ctrl+k` / `Cmd+k` toggles `open`.
     - Renders `SearchContext.Provider`, `children`, and mounts `<CommandMenu />`.
     - Exports `useSearch()` hook with fail-fast validation.

3. **`CommandMenu` Component**:
   - Location: `apps/iap-admin/src/shared/app-shell/command-menu.tsx`
   - Parity with `insurance-ui`:
     - Uses `useSearch()` to read `open` and `setOpen`.
     - Uses `useThemeStore` from `@iap/theme` for theme switching.
     - Uses `useNavigate()` from `@tanstack/react-router`.
     - Uses `useSidebarData()` for navigation groups and items.
     - Renders:
       - `<CommandDialog modal open={open} onOpenChange={setOpen}>`
       - `<CommandInput placeholder={t('command.placeholder', 'Type a command or search...')} />`
       - `<CommandList>` with `<ScrollArea>`
       - `<CommandEmpty>No results found.</CommandEmpty>`
       - Navigation items mapped to `<CommandItem>` triggering `navigate({ to: item.url })`.
       - `<CommandSeparator />`
       - `<CommandGroup heading='Theme'>` with Light, Dark, System triggers.

## Verification Criteria

- Keyboard shortcuts (`Ctrl+k` / `Cmd+k`) toggle the command palette.
- Navigating selects route and closes the dialog.
