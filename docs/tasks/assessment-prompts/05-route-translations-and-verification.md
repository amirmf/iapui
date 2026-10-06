# 05 — Route, translations and verification

Status: Implemented; final verification is recorded in task10.

## Reference

`src/routes/_authenticated/assessment-prompts/index.tsx`, source mounted
components and `src/locales/fa.json`.

## Acceptance and implementation

- Thin route imports feature public page/search exports and retains source
  assessment breadcrumb. This route has no children.
- Copied assessmentPrompts/dataTable/common Persian values match reference
  exactly; no inferred values or local validation keys.
- Source English form-schema error literals remain unchanged.
- All final tests, type/lint/architecture/build/diff evidence and limitations
  belong to task10, not an outdated first-pass count.

## Evidence

Direct JSON comparison verified98 copied feature/table/mounted common values.
Unmounted/commented source strings are deliberately not imported. Task10 records
the final checks; mocks and class assertions are not live or screenshot evidence.
