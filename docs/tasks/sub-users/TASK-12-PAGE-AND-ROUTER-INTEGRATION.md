# TASK-12: Page and Router Integration

## Objective
Assemble all components into `SubUsersPage`, provide a public barrel in `apps/iap-admin/src/features/sub-users/index.ts`, and replace the route placeholder in `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`.

## Reference Source
- `insurance-ui/src/features/sub-users/pages/sub-users-page.tsx`
- `insurance-ui/src/routes/_authenticated/sub-users/index.tsx`

## Implementation Target
1. `apps/iap-admin/src/features/sub-users/sub-users-page.tsx`
2. `apps/iap-admin/src/features/sub-users/index.ts`
3. `apps/iap-admin/src/app/router/routes/_authenticated/sub-users/index.tsx`

## Detailed Specifications

### 1. Page Composition (`sub-users-page.tsx`)
```tsx
function SubUsersContent() {
  return (
    <>
      <div className='flex flex-col sm:flex-row'>
        <div className='flex h-full w-full sm:w-1/2 sm:px-2'>
          <SubUserSection />
        </div>

        <SubUsersAgreementsProvider>
          <div className='my-4 w-full sm:my-0 sm:w-1/2 sm:px-2'>
            <SubUsersAgreementsSection />
          </div>
        </SubUsersAgreementsProvider>
      </div>

      <div className='pb-5'>
        <SubUsersAgreementPartySection />
      </div>

      <SubUserDetailsDialog />
      <SubUserFormDialog />
      <SubUserReleaseAssignmentsDialog />
    </>
  )
}

export function SubUsersPage() {
  return (
    <SubUserProvider>
      <SubUsersContent />
    </SubUserProvider>
  )
}
```

### 2. Feature Public API (`index.ts`)
```ts
export { SubUsersPage } from './sub-users-page'
export { subUserRouteSearchSchema } from './route-adapters/route-search-schema'
export { subUserService } from './services/sub-user-service'
```

### 3. Route Entry (`routes/_authenticated/sub-users/index.tsx`)
```tsx
import { SubUsersPage, subUserRouteSearchSchema } from '@features/sub-users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/sub-users/')({
  component: SubUsersPage,
  loader: () => ({
    crumb: 'subUsers',
  }),
  validateSearch: subUserRouteSearchSchema,
})
```

## Acceptance Criteria
- [ ] Route file remains completely thin without product logic.
- [ ] Direct delegation to `@features/sub-users`.
- [ ] Responsive grid structure matches reference layout.
