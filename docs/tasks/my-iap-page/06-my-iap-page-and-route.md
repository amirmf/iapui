# Task 06: MyIapPage and Route Integration

## Context
In `insurance-ui`, `src/routes/_app/myiap/index.tsx` delegates to `MyIapPage`.
In `apps/iap-app`, the route is `apps/iap-app/src/app/router/routes/_authenticated/index.tsx`, with pathless prefix and canonical URL `/`.

## Requirements
1. **Action Cards Grid (`apps/iap-app/src/features/home/components/home-action-card.tsx` or `my-iap-action-card.tsx`)**:
   - Supports 4 cards:
     1. Create Claim:
        - `to: '/myclaims/create/'`
        - `icon: PlusCircle`
        - `title: t('myiap.myIapPage.createClaimTitle')`
        - `description: t('myiap.myIapPage.createClaimDescription')`
     2. My Claims:
        - `to: '/myclaims/'`
        - `icon: FileText`
        - `title: t('myiap.myIapPage.myClaimsTitle')`
        - `description: t('myiap.myIapPage.myClaimsDescription')`
     3. Create Special Disease:
        - `to: '/special-diseases/create/'`
        - `icon: BadgePlus`
        - `title: t('myiap.myIapPage.createSpecialDiseaseTitle')`
        - `description: t('myiap.myIapPage.createSpecialDiseaseDescription')`
     4. My Special Diseases:
        - `to: '/special-diseases/'`
        - `search: { page: 0, nationalCode: '', diseaseName: '' }`
        - `icon: ClipboardPlus`
        - `title: t('myiap.myIapPage.mySpecialDiseasesTitle')`
        - `description: t('myiap.myIapPage.mySpecialDiseasesDescription')`
   - Wrapper: `<div className='animated-border-card'>`
   - Card: `<Card className='h-full cursor-pointer border-0 transition-colors duration-300 hover:bg-primary-50/30'>`
   - CardHeader: centered, rounded icon container (`rounded-full bg-primary/10 p-4`), `h-8 w-8 text-primary` icon, `text-xl` title.
   - CardContent: `text-center text-muted-foreground`.

2. **Main Page Component (`apps/iap-app/src/features/home/my-iap-page.tsx` & `components/home-page.tsx`)**:
   - Container: `<div className='container px-4 py-8 sm:px-6 lg:px-8'>`
   - Renders:
     - `<MyClaimWelcomeAlert />`
     - `<MyIapSupportAlert />`
     - `<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>` containing all 4 action cards.
   - Export both `MyIapPage` and `HomePage` from feature public barrel `apps/iap-app/src/features/home/index.ts`.

3. **Route Integration (`apps/iap-app/src/app/router/routes/_authenticated/index.tsx`)**:
   - Thin route file delegating to `MyIapPage` (or `HomePage`).
   - Loader returns `{ crumb: 'myiap' }`.

4. **Testing and Verification**:
   - Unit tests for IBAN checksum, bank name resolution, and form validation.
   - Component tests for `MyIapPage`, `MyClaimWelcomeAlert`, `MyClaimWelcomeActions`, `MyBankAccountDialog`.
   - Local verification: `pnpm check-type`, `pnpm lint`, `pnpm test`.
