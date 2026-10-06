# 08 — Form and selector closure

Status: Implemented and verified (2026-10-06). Priority: P1.

## Evidence

Source: `insurance-ui/src/features/assessment-prompts/components/assessment-prompt-form-dialog.tsx`,
`assessment-prompt-doc-type-code-field.tsx`, and their mounted SearchableSelect,
SingleSelect, DatePicker and useDocTypesData dependencies. Target: feature form,
agreement-search-select, enum-field, doc-type-code-field and package primitives.

## Verified discrepancies

1. Source form uses inline SearchableSelect agreement searches immediately;
   target mounts AgreementSearchSelect with trimmed/debounced700ms searches and
   shouldFilter=false. Reproduce actual mounted source, not a similarly named
   unused component. Selected agreement query follows currentRow agreement ID.
2. Source SearchableSelect uses translated empty/search/clear controls and hides
   options while loading. Target generic Select exposes default English empty
   text, differing filtering/loading, and no common.clear action.
3. Source doc-type and SingleSelect enums canClear defaulttrue; target disables
   clearing. Preserve scalar/null schema integration without changing the source UI.
4. Source useDocTypesData uses localStorage `doc-types:page-100` initialData,
   infinite stale/gc, and page0/size100. Target omits persistence/gc and filters
   missing codes instead of source code/title empty-string options.
5. Source dates have w240 calendars and no clear control unless onClear is
   supplied; target fields are full-width and expose an extra English clear action.
6. Header text-left and source field/layout classes differ. Target adds required
   asterisks not present in source.
7. Source agreement validation message is `Agreement is required`; target
   defaults to a generic UUID error. Local title/prompt validation keys are an
   earlier localization adaptation, not source-extracted strings. Record any
   retained architecture-driven translation adaptation explicitly.
8. Shared DialogContent/Overlay/X close control have different padding, radius,
   maximum height, overflow, background, animations and positioning. Restore
   source appearance via opt-in presentation so other target consumers stay unchanged.
9. Shared Textarea uses surface background, ring2+offset2 and destructive30;
   source uses transparent/dark-input background, ring3/ring50 without offset,
   destructive20/40 and color/box-shadow transitions. Add scoped reference
   presentation and use it on the three source form textareas. Input, Label,
   FormItem and form-label geometry were separately checked as equivalent.
10. Source PopoverContent defaults to sideOffset4, rounded-md, shadow-md,
    transform-origin, zoom and directional slide animations. Target defaults
    to sideOffset8, rounded-xl, shadow-lg and fade-only animations. Add scoped
    reference presentation for mounted scalar selectors and faceted filters.
    Normal DialogDescription was also inspected but is not mounted in this
    page's source closure: the form description is commented out and deletion
    uses AlertDialogDescription. Do not port its unmounted appearance.
11. Source calendar CSS uses card-foreground headers, a final text-primary
    weekday override, selected-date white text in both themes, and a one-pixel
    bottom arrow border. Target calendar theme differs on those rules. Add a
    reference-only calendar class with verified existing semantic tokens;
    preserve default shared calendar styling for unrelated consumers.

## Acceptance

- Compare full form field order, defaults, spacing, input direction, dates,
  pending/error/success behavior, not only successful submissions.
- Preserve source component names and locale keys, exact API search params,
  selected label resolution, and document option mapping.
- Regression tests cover loading/empty/clear controls, raw search text,
  field widths, defaults, pending and failed submits.

## Dependencies

Task09 getById signature/state names. No table file ownership.

## Completion evidence

All11 discrepancies were corrected, including mounted scalar selectors, inline
agreement search, source schema/errors, document cache, dialog/textarea/popup and
calendar theme/mobile/clear behavior. Ten form and three cache tests passed.
Final shared UI regression (including tooltip/date/default compatibility) passed;
see task10. Commented normal DialogDescription was deliberately not modified.
