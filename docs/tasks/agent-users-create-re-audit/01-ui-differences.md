# Agent User Signup: shared UI re-audit

Status: page-scoped corrections implemented after this audit. Reference root: `/home/sadegh/Android/project/insurance-ui`. Target root: `/home/sadegh/.codex/worktrees/agent-user-create/iap-ui`.

## Evidence inventory

Reference entry: `src/routes/agent/users/create.tsx`; page: `src/features/agent-users/pages/agent-user-signup-page.tsx`; form: `src/features/agent-users/components/agent-user-signup-form.tsx`. Shared mounted closure: `src/components/ui/{card,input,tabs,form,label,button}.tsx`. Layout: `src/components/layout/agent-layout.tsx`. CSS: `src/styles/{index,_base,_tokens}.scss`, `tailwind.config.ts`, `package.json`.

Target: `apps/iap-admin/src/features/agent-users/`, `packages/ui/src/{card,input,tabs,label,button}.tsx`, `packages/forms/src/{components/form,fields/text-field}.tsx`, `apps/iap-admin/src/shared/app-shell/agent-layout.tsx`, `apps/iap-admin/src/styles/base/_document.scss`, `packages/tailwind-config/tailwind.preset.ts`.

Both repositories currently declare Tailwind **3.4.17**; the reference is not using Tailwind 4. Its source contains v4-shaped classes, but that does not prove those classes compile. The source and target both configure `container` padding of `2rem` and `0.75` spacing of `0.1875rem`. Do not convert the target to Tailwind 4 as a parity fix.

## UI-01: CardTitle and CardDescription element parity

- [x] Restore source tag semantics for this page using public scoped primitives.
- Source `CardTitle` and `CardDescription` render `div`; target renders `h2` and `p` respectively.
- Their class sets are otherwise equal. `Card`, `CardHeader`, and `CardContent` have equivalent mounted class sets and matching slots; `CardFooter` and `CardAction` are not mounted here.
- Completion: source presentation renders title/description as `div`, retaining target defaults for unrelated consumers. Verify actual tags and class sets.

## UI-02: Tabs root and keyboard-focus parity

- [x] Preserve source Tabs root slot and trigger focus declaration.
- Reference `Tabs` wraps Radix Root with `data-slot='tabs'` and `flex flex-col gap-2`. Target exports Radix Root directly; page duplicates the classes but omits the slot.
- Target `TabsList` omits source `w-fit`; the page explicitly uses `w-full`, so mounted width is already equivalent. Adding `w-fit` without considering `cn` merging is not a visible fix for this page.
- Reference trigger includes `focus-visible:outline-ring`; target omits it and adds unconditional `outline-none`. Both include `focus-visible:outline-1`. Match the source focus declaration with a scoped capability and verify keyboard focus.
- Trigger dimensions, active background overrides, labels, order, and RTL list props otherwise match.
- Completion: mounted root slot/classes and keyboard focus classes match source; existing Tabs consumers retain their behavior.

## UI-03: Mobile Input typography and autofill

- [x] Apply source mobile typography to the signup page's four Inputs.
- Source `_base.scss` sets `font-size: 14px !important` on inputs below 768px. Target `_document.scss` sets `16px` without `!important`. The primitive itself has `text-base md:text-sm` in both repositories; identical primitive classes therefore do not guarantee identical mobile rendering.
- Source `src/styles/_utilities.scss:143–147` autofill always uses white inset background. Target uses `--color-surface` and additionally sets `-webkit-text-fill-color`. This is a verified declaration difference; check actual light/dark/autofill rendering before deciding a scoped override is necessary.
- Source and target Input class sets are otherwise equal for this page. Numerical normalization, comma formatting and maxLength differences are unmounted here and must not be reported as signup behavior defects.
- Completion: below 768px all four mounted Inputs compute to 14px like source; desktop remains 14px via `md:text-sm`. Verify without globally changing unrelated forms.

## UI-06: Source font fallback

- [x] Preserve the reference page's actual font fallback in page-scoped styling.
- Reference `_base.scss` overrides `--font-app` to `'Vazir', sans-serif` for `:root.font-vazirmatn` (and every other font selector). Its available Persian font-face is named `Vazirmatn`; therefore this declaration can fall back to the browser sans-serif font. Target uses `Vazirmatn` directly. Preserve this source declaration rather than silently correcting its font-name mismatch.
- Completion: page scope uses `'Vazir', sans-serif`; unrelated target pages retain their existing font.

## UI-04: FormMessage error semantics

- [x] Preserve the reference FormMessage body-selection semantics in scoped reference presentation.
- Source chooses `String(error?.message ?? '')` whenever an error exists. Target chooses `children` whenever `error.message` is falsy. This is an error-branch difference; the signup form currently supplies no fallback children.
- Target adds `role='alert'`; source does not. Record or restore this in scoped reference presentation for exact markup parity.
- FormItem, FormLabel, FormDescription and Label class sets match. Required stars are actual children in both mounted forms, so target's unmounted `required` pseudo-star capability is not a discrepancy.
- Target FormControl clones its child and adds `data-form-field`; reference uses Radix Slot. IDs, described-by and invalid attributes match the mounted Inputs. Extra tracking data is an architecture adaptation, not a demonstrated visual defect.
- Completion: error body and reference markup semantics tested, while normal target accessibility behavior remains available.

## UI-05: Ancestor layout evidence

- [x] Audit and correct source-backed page host declarations; browser placement verification is a stated limit. Original task: verify page placement with the actual AgentLayout at matching viewport sizes and account/sidebar state; scope any correction deliberately.
- Source content ancestor is `flex h-svh flex-col gap-6 ... px-2 py-2 sm:px-2 sm:py-4` and mounts the Outlet directly after Header.
- Target content ancestor uses `min-h-dvh p-2 ... sm:p-4 lg:mr-72`; Outlet is inside an additional `main.mx-auto.w-full.max-w-[1600px].py-6`. This produces different horizontal shell padding at >=640px, different content width rules, different height behavior, and nested main landmarks around the page's own main.
- Source width responds to sidebar peer state and persisted `sidebar_state`; target uses fixed breakpoint margins and local state. These are layout-owned differences, not omissions in AgentUserSignupPage JSX.
- Do not invent page-specific negative margins from these declarations alone. Browser comparison should establish exact page impact and avoid replacing other accepted panel behavior without evidence.
- Completion: record screenshots/computed placement at mobile/tablet/desktop; implement only verified page-scope differences or explicitly document layout-owned outstanding scope.

## Components with no mounted discrepancy found

- `AgentUserSignupPage`: same container, header/title/description translations, Card composition and CardContent child.
- `AgentUserSignupForm`: same field DOM order and `space-y-6`, same submit wrapper `flex justify-end`, same pending text and disabled state. Extracted groups return fragments, so no extra DOM wrapper changes spacing.
- `Button`: page already opts into reference presentation, restoring source disabled background/text and pointer behavior. Submit explicitly specifies `type='submit'`. Mounted primary/default variant and size classes are equivalent.
- `Label`: class set and Radix behavior match for this page.
- `TextField`: renders the same FormField → FormItem → FormLabel → FormControl → Input → optional FormDescription → FormMessage structure as source explicit JSX.

This audit is source evidence only. No screenshot or live-backend parity is implied.

## Additional source declaration audit before final fixes

Target body sets font-synthesis:none, text-rendering:optimizeLegibility and antialiasing; source body leaves browser defaults. Restore auto values in the signup page scope with the source font fallback. Restore source white autofill inset and remove target forced text fill through scoped CSS. Preserve source default FormMessage markup through optional reference presentation forwarded by TextField; other form consumers retain role=alert. These are source declaration/markup differences; no screenshot equivalence is asserted.

## UI-07: Dark card border token

- [x] Restore source global border token on the mounted Card.
- Source `_base.scss` applies border-border to every element. Target document styles do not apply that base declaration; Card's bare border utility therefore inherits Tailwind's default gray-200 border, including dark mode. Add `border-border` to the signup Card only so its border follows the source dark/light token. Inputs already specify border-input and tabs specify border-transparent; no other bare bordered element mounts in this form.
- Verify the source declaration and target compiled border class; preserve shared Card defaults.

## Completion evidence

Card title/description opt into public as=div; Tabs root slot restored and TabsTrigger reference presentation restores focus declarations; TextField forwards reference FormMessage semantics. CSS module restores source font declaration/rendering defaults, mobile size and white autofill inset. Signup Card explicitly uses border-border. Default Card/Tabs/Form consumers retain their presentation and pass shared-package regressions.

UI-05 host declaration differences are corrected by task 03. Existing sidebar/header/session composition remains the accepted host architecture, with independent route coverage. Whole-shell screenshot comparison is not claimed; browser autofill and viewport screenshots remain verification limits rather than invented evidence.
