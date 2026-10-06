# 09 — Schema names, state API and deletion closure

Status: Implemented and verified (2026-10-06). Priority: P1.

## Reference evidence

Source assessment-prompt data/service/context and delete-method components;
`insurance-ui/src/components/dialogs/delete-method-dialog.tsx`, agreements schema
and service. Target api-types domains, feature services/store, @iap/dialogs.

## Verified discrepancies

1. Source page schema names are pageAssessmentPromptSchema,
   pageAssessmentPromptsRequestSchema and PageAssessmentPrompt. Target makes
   invented names canonical and source names aliases. Use source names internally.
2. Source nested sort/pageable z.object strips unknown properties; target loose
   retains them. Page totalPages,size,number,numberOfElements require integers;
   target common factory currently permits fractional values.
3. DTO id/agreementId use source z.uuid; target z.string().uuid differs.
4. Agreement page source name is pageAgreementSchema/PageAgreement and its
   metadata fields are required. Target names/default factory loosen metadata.
5. Source getById signature is `(id, options?: { signal })`, not `(id, signal)`.
   Source page input requires filters. Agreement search must not trim raw input.
6. Source store public names open/setOpen/useAssessmentPrompt and provider are
   missing. Target clears currentRow on create unlike source (clears only on null).
7. Delete wrapper prop rows differs from source assessmentPrompts.
8. Delete selection grid/max-width/icons/header alignment/date width/Back style/
   footer grouping and soft-confirm variant differ. Source reset delay300ms,
   target0. Preserve failure recovery and pending protection.
9. Source invalidation is fire-and-forget before toast/close; target awaits refetch.
10. Source bulk IDs use Object.keys, including false-valued entries; target
    correctly excludes unselected rows. Retain selected-only safety, explicitly
    do not claim replication of this source bug.
11. Assessment API endpoints/method/body/query placements and all 12 mounted
    common delete translations already match. Do not invent new endpoints/labels.
12. Direct runtime schema comparison detected different issue ordering in
    malformed page requests because a shared factory defines filters before
    page/size. Preserve source object field order, not just accepted value types;
    the same review applies to DTO, nested agreement and page metadata definitions.
13. Feature callers continued to import the target-only useAssessmentPromptStore
    name after introducing the source hook as an alias. Define useAssessmentPrompt
    as the canonical store hook and migrate provider, actions, dialogs and tests;
    remove the obsolete alias after verifying no remaining consumers.

## User-resolved contract precedence

On 2026-10-06 the user explicitly confirmed exact reference API/schema/component/
translation behavior with target architecture placement. For this page, restore
source request stripping and nullish assessment content, retaining shared factory
composition where it does not change source semantics. Architecture governs
ownership/import boundaries, not invented backend validation constraints.

The base AlertDialogContent/overlay also require source opt-in padding/radius/
background/width/animation fidelity; changing only its children is insufficient.

## Acceptance

14. Final mounted dependency check found the soft-delete date field only restored
    width, but did not forward reference DatePicker presentation. Forward source
    appearance and runtime language and suppress its non-source clear action;
    retain unrelated dialog defaults. Add an integration appearance assertion.

- Exact source canonical names, UUID/integer/nested object validation and signal signatures.
- Minimal shared deletion reference presentation without regressions in unrelated consumers.
- Tests exercise invalid metadata, unknown nested keys, payload placement,
  selected-only deletion, timing and recoverable failures.

## Dependencies

Coordinate store/service exports with page and form consumers; retain temporary
compatibility aliases until consumers are migrated.

## Completion evidence

All source schema and hook names are canonical; obsolete store alias/callers are
removed. Direct561 comparison and eight regression tests verify contracts and
validation issue order. Deletion uses source state/timing/layout, reference date
presentation and runtime language. Selected-only/retry safeguards are disclosed.
Final deletion appearance/retry integration tests passed; combined checks are in
task10. No temporary compatibility aliases remain.
