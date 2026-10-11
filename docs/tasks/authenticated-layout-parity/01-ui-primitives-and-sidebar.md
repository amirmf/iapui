# Task 01: UI Primitives & Sidebar Components in `@iap/ui`

## Reference

- `insurance-ui/src/components/ui/sidebar.tsx`
- `insurance-ui/src/components/ui/breadcrumb.tsx`
- `insurance-ui/src/components/ui/skeleton.tsx`
- `insurance-ui/src/components/ui/command.tsx` (`CommandDialog`)
- `insurance-ui/src/hooks/use-mobile.ts`

## Deliverables

1. **`useIsMobile` Hook**:
   - Location: `packages/ui/src/lib/use-mobile.ts` (or exported via `@iap/ui`)
   - Implements breakpoint detection (`768px`) with `window.matchMedia` and listener cleanup.

2. **`Skeleton` Primitive**:
   - Location: `packages/ui/src/skeleton.tsx`
   - Component: `Skeleton({ className, ...props }: React.ComponentProps<'div'>)`
   - Classes: `cn('animate-pulse rounded-md bg-muted', className)`
   - Exported from `packages/ui/src/index.ts`.

3. **`Breadcrumb` UI Primitives**:
   - Location: `packages/ui/src/breadcrumb.tsx`
   - Exports:
     - `Breadcrumb` (`nav[data-slot=breadcrumb]`)
     - `BreadcrumbList` (`ol[data-slot=breadcrumb-list]`)
     - `BreadcrumbItem` (`li[data-slot=breadcrumb-item]`)
     - `BreadcrumbLink` (`Slot / a[data-slot=breadcrumb-link]`)
     - `BreadcrumbPage` (`span[data-slot=breadcrumb-page]`)
     - `BreadcrumbSeparator` (`li[data-slot=breadcrumb-separator]`)
     - `BreadcrumbEllipsis` (`span[data-slot=breadcrumb-ellipsis]`)
   - Exported from `packages/ui/src/index.ts`.

4. **`CommandDialog` Addition**:
   - Update `packages/ui/src/command.tsx`
   - Adds `CommandDialog` composing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, and `Command`.
   - Exported from `packages/ui/src/index.ts`.

5. **`Sidebar` Primitives**:
   - Location: `packages/ui/src/sidebar.tsx`
   - Complete shadcn sidebar implementation:
     - `SidebarProvider`: handles `state` ('expanded' | 'collapsed'), `open`, `setOpen`, `openMobile`, `setOpenMobile`, `toggleSidebar`, `localStorage` key `'sidebar_state'`, keyboard shortcut `Ctrl+b` / `Cmd+b`. Sets CSS variables `--sidebar-width: 16rem`, `--sidebar-width-icon: 3rem`, `--sidebar-width-mobile: 18rem`.
     - `useSidebar`: context accessor hook with guard.
     - `Sidebar`: desktop aside / mobile Sheet with floating, inset, sidebar variants and offcanvas / icon collapsible modes.
     - `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarRail`.
     - `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` (with variants, sizes, tooltip), `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`.
     - `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarGroupContent`.
     - `SidebarTrigger`: button triggering `toggleSidebar()`.
   - Exported from `packages/ui/src/index.ts`.

## Verification Criteria

- `@iap/ui` builds without errors: `pnpm --filter @iap/ui typecheck`.
- Tests for `@iap/ui` pass: `pnpm --filter @iap/ui test`.
