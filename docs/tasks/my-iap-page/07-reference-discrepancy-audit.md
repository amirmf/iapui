# Task 07: Exact Reference Parity & Discrepancy Audit

## Objective
Comprehensive component-by-component, line-by-line audit comparing `MyIapPage` and its dependency tree between reference `insurance-ui` (`src/routes/_app/myiap/index.tsx`, `src/features/my-iap/claim-requests/pages/my-iap-page.tsx`, and `src/features/my-iap/claim-requests/components/`) and `apps/iap-app`.

---

## Component-by-Component Discrepancy Matrix

| Component | Element / Logic | Reference (`insurance-ui`) | Discrepancy / Required Action |
| --- | --- | --- | --- |
| **`MyIapPage`** | Card Layout & Structure | In reference, each of the 4 cards has `<Link to='...' className='no-underline'><div className='animated-border-card'><Card className='h-full cursor-pointer border-0 transition-colors duration-300 hover:bg-primary-50/30'><CardHeader className='flex flex-col items-center space-y-4 text-center'><div className='rounded-full bg-primary/10 p-4'><Icon className='h-8 w-8 text-primary' />...` | Align card markup and classes to match reference exactly, eliminating differences in padding, flex direction, and icon container. |
| **`MyIapPage`** | Icons | Card 1: `PlusCircle`<br>Card 2: `FileText`<br>Card 3: `BadgePlus aria-hidden='true'`<br>Card 4: `ClipboardPlus aria-hidden='true'` | Match exact Lucide icons and `aria-hidden` attributes. |
| **`MyIapPage`** | Search parameters | Card 4 uses `search={{ page: '0', nationalCode: '', diseaseName: '' }}` | Update string page `'0'` to match reference parameter format. |
| **`MyClaimWelcomeAlert`** | Container classes | `Alert className='mb-6 border-primary/50 bg-primary/5 dark:bg-primary/10'` | Match exact Alert class and tenant theme inline style. |
| **`MyClaimWelcomeActions`** | Layout spacing | `div className='flex w-full flex-wrap justify-end gap-2'` (no top margin) | Remove extraneous `mt-4` class to match reference layout. |
| **`MyClaimWelcomeActions`** | Referral Letters button | Violet button with `border-violet-500 text-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-400 dark:text-violet-300 dark:hover:bg-violet-950/30 dark:hover:text-violet-200`, `Link to='/pre-auths/'` with `gap-2` | Verify exact class parity. |
| **`MyClaimWelcomeActions`** | Contracting centers button | Orange button with `border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-400 dark:text-orange-300 dark:hover:bg-orange-950/30 dark:hover:text-orange-200` | Verify exact class parity and `rel='noopener noreferrer'`. |
| **`MyBankAccountDialog`** | Name styling | `<span className='font-medium text-text-primary'> {user?.displayName} </span>` | Match reference typography class `text-text-primary`. |
| **`IbanBankNameDescription`** | Primitive | Uses `<FormDescription>{bankName}</FormDescription>` from form primitives | Use `FormDescription` rather than custom `<p>`. |
| **`MyBankAccountForm`** | Editing payload | Passes `{ ...myBankAccountQuery?.data, ...payload }` to `editMyBankAccount` | Match reference mutation payload assembly. |
| **`MyIapSupportAlert`** | Title classes | `line-clamp-none whitespace-normal break-words font-semibold` | Preserve exact typography classes. |

---

## Action Items & Resolution Status
1. [x] **Card Layout & Structure**: Updated `HomeActionCard` so that `<Link className='no-underline'>` directly wraps `<div className='animated-border-card'><Card className='h-full cursor-pointer border-0 transition-colors duration-300 hover:bg-primary-50/30'>` with `<div className='rounded-full bg-primary/10 p-4'>` for icon container.
2. [x] **Card 4 Search Params**: Updated `search={{ page: '0', nationalCode: '', diseaseName: '' }}` matching reference string format.
3. [x] **MyClaimWelcomeActions**: Removed extraneous `mt-4` class to match reference `flex w-full flex-wrap justify-end gap-2`.
4. [x] **MyClaimWelcomeAlert**: Removed `mt-2` class on second paragraph to match reference paragraph styling.
5. [x] **MyBankAccountDialog**: Updated user name span to use `font-medium text-text-primary`.
6. [x] **IbanBankNameDescription**: Updated to render `FormDescription` imported from `@iap/forms`.
7. [x] **MyBankAccountForm**: Updated edit mutation to merge `{ ...myBankAccountQuery?.data, ...payload }`.
8. [x] **Verification**: All 18 test suites (67 tests) in `iap-app` pass, `pnpm architecture:check` passes, `pnpm --filter iap-app lint` passes, `pnpm --filter iap-app typecheck` passes, `pnpm build:app` passes, and Prettier code formatting passes.
