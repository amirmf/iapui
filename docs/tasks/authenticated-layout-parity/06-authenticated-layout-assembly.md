# Task 06: AppSidebar & AuthenticatedLayout Assembly

## Reference

- `insurance-ui/src/components/layout/app-sidebar.tsx`
- `insurance-ui/src/components/layout/authenticated-layout.tsx`

## Deliverables

1. **`AppSidebar`**:
   - Location: `apps/iap-admin/src/shared/app-shell/app-sidebar.tsx`
   - Parity with `insurance-ui`:
     - Props: `ComponentProps<typeof Sidebar> & { navList: NavGroup[] }`
     - Uses `useAuthSession()` to obtain current user roles.
     - Filters navigation items by role using `canAccessPathByRole` and `!canNotAccessPathByRole` via `produce` from `immer`.
     - Layout:
       - `<Sidebar collapsible='icon' variant='floating' side={i18n.dir() === 'rtl' ? 'right' : 'left'}>`
       - `<SidebarHeader>` with logo images (`VITE_SIDEBAR_LOGIN_LOGO` and `VITE_CUSTOMER_APP_HEADER_LOGO`) and title `VITE_LOGIN_TITLE`.
       - `<SidebarContent>` rendering `<NavGroup key={group.title} {...group} />`.
       - `<SidebarFooter>` with `{user && <NavUser user={user} />}`.
       - `<SidebarRail />`.

2. **`AuthenticatedLayout`**:
   - Location: `apps/iap-admin/src/shared/app-shell/authenticated-layout.tsx`
   - Parity with `insurance-ui`:
     - Props: `{ children?: ReactNode }`
     - Reads `defaultOpen` from `localStorage.getItem('sidebar_state') === 'true'`.
     - Fetches `navGroups` via `useSidebarData()`.
     - Tree structure:
       ```tsx
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
               <ForcePasswordChangeDialog />
               <AuditInformationDialog />
             </SidebarProvider>
           </SearchProvider>
         </SupportFlowProvider>
       </LayoutLoading>
       ```

3. **Route Integration**:
   - Verify `apps/iap-admin/src/app/router/routes/_authenticated/route.tsx` correctly delegates to `AuthenticatedLayout`.

## Verification Criteria

- Layout renders without hydration or runtime mismatch.
- Sidebar collapses/expands smoothly with correct CSS transition and persisted state.
- Dialogs (`ForcePasswordChangeDialog`, `AuditInformationDialog`, `SupportFlowWidget`) remain accessible.
