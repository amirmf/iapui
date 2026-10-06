# 03 — Table, filters and row actions

Status: Implemented; exhaustive discrepancy corrections are in task07.

## Reference

Source assessment-prompt columns, row actions, toolbar, shared table/filter
components and constant.

## Acceptance and implementation

- Source visible/hidden columns, empty/null content, badges and translations.
- Tabler view/edit controls; bulk deletion limited to superadmins.
- Source toolbar filter ordering, cache-backed doc-type options and URL keys.
- Source text/facet/date delays1200/1000/500ms and immediate text clearing.
- Source dashed searchable facets, sortable menus and pagination size choices.
- Source selection count and total rendered simultaneously.
- Source table/checkbox/header/cell/layout classes via scoped shared presentation.
- Enum constant remains a single source-backed mapping without schema duplication.

## Evidence

Rendered columns/actions, toolbar and reference table/filter tests cover controls,
labels, timing, selection/total and appearance classes. Task10 lists full closure
coverage. No screenshot parity is claimed.
