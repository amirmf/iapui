# Assessment Prompts: main integration and handoff

## Scope

On 2026-10-06 the user authorized documentation/skill updates, a local commit,
integration into `main`, removal of the assessment worktree and closure of
task-owned development listeners. Remote push and deployment are not included.

The implementation snapshot is `aa90a75`. Integration incorporates main
`51efe83`, including its independently completed Agreements page. Earlier task
verification remains historical; this document records the integrated tree.

## Integration decisions

- Preserve main's canonical Agreement contracts. Assessment nested/lookup
  definitions retain source schema names in the public
  `assessmentPromptAgreementContracts` namespace, without changing Agreements.
- Consolidate reference pagination into `ReferencePaginationControls`, using
  the source-backed Radix Select. Remove unused duplicate pagination/facet
  implementations; keep command keyboard behavior and existing default controls.
- Forward reference presentation through text filters, row checkboxes, tooltips,
  popovers and nested date controls. Restore source text/facet defaults of
  1200/1000 ms without changing default-presentation timing.
- Retain main's public `DeleteMethodDialog.presentation` API and migrate the
  assessment consumer/tests from the earlier `appearance` spelling.
- Extend the existing reference-page-parity skill instead of adding a duplicate.
  The architecture contract decision and reference-control inventory explain
  page-scoped exceptions and integration boundaries for future ports.

## Verification

Final integrated-tree verification on 2026-10-06:

- Admin: 126 test files / 321 tests passed, including both page consumers.
- Shared UI: 15 files / 54 tests; forms: 2 files / 11 tests passed.
- Design tokens: 3 tests; Tailwind opacity: 1 test passed. Customer app has no
  test files. The initial workspace run exposed a reference header-class
  regression; the final full admin rerun and focused table rerun passed after
  correction.
- All 561 behavior/error-order comparisons across 17 source assessment schemas
  matched. All 55 copied assessment locale values matched the source directly;
  unused source keys were not required in the target.
- Workspace typecheck, lint and architecture check passed. The final header
  edit was additionally linted; admin production build passed with upstream
  annotation warnings. Staged-file formatting and diff checks passed.
- The updated reference-page-parity skill validator passed.

No live-backend or browser screenshot comparison is claimed. Production output and generated
tenant environment files are disposable build artifacts, not authored source.

The earlier pre-commit run passed workspace typecheck and lint but lint-staged
failed while staging in this worktree. The implementation snapshot was committed
with hooks disabled only after those checks passed; integration checks are run
explicitly as well.
The integration commit also uses the manually verified path with hooks disabled
to avoid the known staging failure; this is not a claim of hook success.

## Cleanup boundary

Preserve the three pre-existing tracked UI skill Python cache changes separately
before removing the exact assessment worktree. Do not remove other worktrees,
stop unidentified listeners, or push the branch remotely.
