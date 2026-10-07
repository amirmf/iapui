# TASK-09: Page Composition and Route Integration

## Objective
Compose the single-root-route page `SupportQuestionsPage` and integrate it into the TanStack Router route at `apps/iap-admin/src/app/router/routes/_authenticated/support-questions/index.tsx`.

## Scope of Work

### 1. `support-questions-page.tsx`
- Location: `apps/iap-admin/src/features/support-questions/support-questions-page.tsx`
- Structure:
  ```tsx
  export default function SupportQuestionsPage() {
    return (
      <SupportQuestionProvider>
        <div className='space-y-6 pb-5'>
          <SupportQuestionsSection />
          <div className='grid gap-6 lg:grid-cols-2'>
            <SupportPagesSection />
            <SupportFeaturesSection />
          </div>
        </div>
      </SupportQuestionProvider>
    )
  }
  ```

### 2. Feature Public API `index.ts`
- Location: `apps/iap-admin/src/features/support-questions/index.ts`
- Exports `SupportQuestionsPage` (both default and named) as well as any necessary public types.

### 3. Route File Replacement
- Location: `apps/iap-admin/src/app/router/routes/_authenticated/support-questions/index.tsx`
- Replaces the placeholder page with:
  ```tsx
  import SupportQuestionsPage from '@/features/support-questions'
  import { createFileRoute } from '@tanstack/react-router'

  export const Route = createFileRoute('/_authenticated/support-questions/')({
    component: SupportQuestionsPage,
  })
  ```

## Verification Criteria
- Route mounts `SupportQuestionsPage` correctly under `_authenticated` layout.
