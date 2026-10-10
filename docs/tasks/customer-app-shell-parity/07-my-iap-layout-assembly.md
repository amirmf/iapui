# Task 07: MyIapLayout Assembly

## Objective

Assemble the complete `MyIapLayout` shell in `apps/iap-app/src/shared/app-shell/my-iap-layout.tsx` composed of `LayoutLoading`, `SupportFlowProvider`, `MyIapHeader`, `MyIapFooter`, `MyIapBottomNav`, `SupportFlowWidget`, `ForcePasswordChangeDialog`, and `AuditInformationDialog`.

## Reference Implementation

In `insurance-ui/src/components/layout/my-iap-layout.tsx`:
```tsx
export function MyIapLayout({ children }: Props) {
  return (
    <LayoutLoading>
      <SupportFlowProvider>
        <div className='flex min-h-screen flex-col'>
          <MyIapHeader />
          <main className='flex flex-1 flex-col bg-background pb-16 md:pb-0'>
            {children ? children : <Outlet />}
          </main>
          <MyIapFooter />
          <MyIapBottomNav />
          <SupportFlowWidget />
        </div>
      </SupportFlowProvider>
    </LayoutLoading>
  )
}
```

## Target Implementation Specification

- File path: `apps/iap-app/src/shared/app-shell/my-iap-layout.tsx`
- Alias in `app-shell.tsx`: `export { MyIapLayout, MyIapLayout as AppShell } from './my-iap-layout'`
- Updates `apps/iap-app/src/app/router/routes/_authenticated/route.tsx` to use `MyIapLayout`.
- Preserves accessibility attributes (`dir='rtl'`, `id='main-content'`, `tabIndex={-1}`).
- Mounts `ForcePasswordChangeDialog` and `AuditInformationDialog` from `@iap/auth`.
- Wraps body with `SupportFlowProvider` and mounts `SupportFlowWidget` from `@iap/support`.
