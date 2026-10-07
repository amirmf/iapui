---
name: cascading-master-detail
description: Guide and best practices for building multi-tier cascading master-detail admin pages (e.g. Master -> Child -> Grandchild tables) with synchronized row selection, query dependency, context cleanup, and role-conditioned forms.
---

# Cascading Master-Detail Pattern

Use this skill when implementing or refactoring complex operations pages that feature hierarchical relational data tables (e.g., Parent -> Child -> Grandchild entities such as Sub-Users -> Agreements -> Parties, or Organization -> Units -> Members).

## 1. Architecture & Single Responsibility

A cascading master-detail page consists of distinct, small visual components coordinated through state providers:
- **Master Section**: The primary paginated data table, toolbar, search filtering, and record-level action dialogs.
- **Child Section(s)**: Secondary tables whose data-fetching depends on the parent's currently selected row identifier (`enabled: Boolean(selectedParentId)`).
- **Grandchild Section(s)**: Tertiary tables whose data-fetching depends on the child's currently selected row identifier.
- **Root Page Composition**: Wraps the sections in feature-scoped providers and arranges them cleanly with semantic layout components (`Main`, dividers, or grid splits).

```tsx
// features/<feature>/pages/<feature>-page.tsx
export function FeaturePage() {
  return (
    <ParentProvider>
      <ChildProvider>
        <Main>
          <ParentSection />
          <Separator className='my-6' />
          <ChildSection />
          <Separator className='my-6' />
          <GrandchildSection />
        </Main>
        <ParentDialogs />
      </ChildProvider>
    </ParentProvider>
  )
}
```

## 2. Cascaded Selection & Invalidation Lifecycle

1. **Dependent Query Execution**:
   - Child queries must specify `enabled: Boolean(selectedParentId)` and include the parent ID in their query key (`[KEY_CHILDREN, selectedParentId]`).
   - Never fetch child data when no parent row is active.

2. **Deselection & Reset Propagation**:
   - When the user selects a different parent row or deselects the current parent row, the child store **must** reset child selection, and the grandchild store must reset grandchild selection.
   - When pagination or search query params change on the master table, reset selection to avoid orphan child states.

```ts
// Example: resetting child store when parent selection changes
const setSelectedParent = (parent: Parent | null) => {
  set({ selectedParent: parent })
  useChildStore.getState().reset()
}
```

3. **Unmount Cleanup**:
   - Each provider or store must ensure its transient selection and dialog states are cleared when unmounted.
   - Use scoped context hooks and store subscriptions to prevent memory leaks across page navigations.

## 3. Form Validation with `typedZodResolver` & Payload Sanitization

1. **Typed Zod Resolver**:
   - To prevent type incompatibilities between Zod schemas and React Hook Form resolver types, wrap the resolver using a typed utility:
   ```ts
   import { zodResolver } from '@hookform/resolvers/zod'
   import type { Resolver } from 'react-hook-form'
   import type { z } from 'zod'

   export function typedZodResolver<T extends z.ZodTypeAny>(schema: T): Resolver<z.infer<T>> {
     return zodResolver(schema as never) as unknown as Resolver<z.infer<T>>
   }
   ```

2. **Conditional Field Sanitization**:
   - When forms have conditional sections (e.g. role-specific inputs such as medical council number only for doctors), sanitize the payload before calling the mutation service:
   - Strip empty strings, empty arrays, or irrelevant fields that the backend does not permit for the selected options.

## 4. Testing & Verification Checklist

- **Unit tests for services & schemas**: Verify request parameter mapping, response parsing, and error rejection on invalid schemas.
- **Store tests**: Verify reset actions, selection setting, and dialog open/close states.
- **Cascaded rendering tests**: Verify child table displays appropriate empty state when no parent is selected, and renders rows when parent is selected.
- **Typecheck & Lint**: Ensure strict ESLint compliance, including Fast Refresh constraints on context files.
