# 06 — Page composition and URL transitions

Status: Implemented and verified (2026-10-06). Priority: P1.

## Evidence and discrepancies

Source root: `insurance-ui/src/features/assessment-prompts/pages/assessment-prompts-page.tsx`.
Target root: `apps/iap-admin/src/features/assessment-prompts/assessment-prompts-page.tsx`.

1. Source composes `AssessmentPromptProvider` and `AssessmentPromptsContent`;
   target flattens both into `AssessmentPromptsPage`. Restore source component
   names with provider ownership under feature `context/provider/`.
2. Source wraps content with `flex flex-col gap-6` and `Main overflow-hidden`.
   Target omits the card entirely. Source `components/layout/main.tsx` defines
   rounded 20px card, shadow, px/py6 and sm:px/py8. Restore this focused technical
   layout capability without changing the authenticated shell globally.
3. Source actions use Tabler `IconTrash`, `IconRefresh`, `IconPlus`, size18,
   `space-x-2`, and text spans; target uses Lucide and unwrapped text.
4. Target scroll container omits source `flex-1`.
5. Shared URL hook resets page on sorting, unlike source
   `use-sync-query-params-table-filter.ts`. Set reset-on-sort false for this page.
6. Source deletion prop is `assessmentPrompts`; target calls it `rows`.
7. Source state API names are `open`, `setOpen`, and `useAssessmentPrompt`;
   target names `openDialog`, `setOpenDialog`. Coordinate task09 migration.

## Acceptance

- Match source page/card/action composition and names while keeping the route thin.
- Preserve source query key family, staleTime30000, focus-refetch false,
  signal forwarding, selection permission, refresh and create interactions.
- Add rendered page coverage, including sorting without pagination reset.
- Required package/location/import adaptations must not be described as visual parity.

## Dependencies

Task09 state API; task07 shared table presentation. Can implement layout independently.

## Completion evidence

Source page/content/provider/Main composition and action icons are restored.
Rendered page tests verify card classes, permission gating, source query defaults,
sorting without page reset and provider cleanup. Source-backed API/schema/state
migration is integrated. Combined verification is recorded in task10.
