# 07 — Columns, toolbar, filters, table and view

Status: Implemented and verified (2026-10-06). Priority: P1.

## Reference closure

Source: `insurance-ui/src/features/assessment-prompts/components/assessment-prompt-columns.tsx`,
`assessment-prompt-row-actions.tsx`, `assessment-prompts-data-table-toolbar.tsx`,
`assessment-prompt-view-dialog.tsx`, `src/constants/assessment-prompts-constant.ts`,
and directly used `src/components/data-table/` primitives.
Target: corresponding feature `components/`, `constants/` and `shared/tables/`.

## Verified discrepancies

1. Null title/prompt render `-` in target; source renders empty content.
2. Through-date wrapper is span instead of source width-constrained div.
3. Source facet column filterFn is missing for place/rule/status.
4. Row controls use Lucide instead of Tabler IconEye/IconEdit and miss source hover class.
5. View generic detail helper converts empty strings to notAvailable; source
   uses nullish fallback. It also adds wrapping/break-all to fields that lack it
   in source. View badges incorrectly inherit table capitalization.
6. Source sortable headers use translated dataTable labels; target renders
   English Asc/Desc/Reset when labels are not supplied.
7. Pagination uses English text, omits size30/40, conditionally replaces total
   with selection count instead of showing both, uses a native select, and has
   different RTL/navigation visibility and layout.
8. Table wrapper radius/height/scroll classes, header backgrounds/z-index,
   row group classes and loading/empty heights differ from source.
9. Toolbar reset says Reset filters in English and wrapper layout differs.
10. Text filters debounce400 rather than source1200 and clearing is delayed.
11. Facet UI is a generic multiselect rather than source dashed PlusCircled
    trigger, selection summary badges, translated searchable popover, and clear
    action; source delays changes1000ms while target updates immediately.
12. Date range has a combined trigger, but its wrapper widths are incorrectly
    applied to PopoverContent instead of the trigger wrapper. Source height8,
    popup padding3, ASCII '-' separator, source date formatting and delay500ms
    differ. Source URL range keys are thruDate__from/thruDate__to; target used
    invented thruDateFrom/thruDateTo.
13. Document-type toolbar query/cache/options differ: source page0/size100,
    key `['doc-types','page',0,100]`, infinite stale/gc and cached initial data;
    source missing code/title become empty strings instead of dropping rows or
    inventing fallback labels.
14. Enum mapping exports, option order and source Persian values match. Keep
    them; source constant filename is plural `assessment-prompts-constant.ts`.
15. Date-formatting language/timezone handling needs source-backed verification;
    do not infer date output from text-only snapshots.
16. Checkbox margins/border/sticky select-column metadata differ. Base table
    head/cell padding, alignment, row backgrounds and whitespace differ too.
17. Mounted row-action and overflow-text tooltip closure differs. Reference
    `src/components/ui/tooltip.tsx` uses zero provider delay and content offset,
    gray-600/dark-gray-200 colors, directional animations and a visible arrow;
    target uses Radix's default provider delay, offset6, foreground background,
    constrained width/shadow and no arrow. Restore through opt-in presentation
    on `TableActionButton`, `TableActions`, and mounted column `LongText` only.

## Implementation boundaries and acceptance

- Shared primitives must expose a focused opt-in reference presentation if
  existing consumers depend on target behavior; do not globally redesign tables.
- Keep original source component names for copied mounted responsibilities.
- Tests must cover source labels/layout, null vs empty, facet behavior/timing,
  pagination choices and translated selection/total simultaneously.
- Small components, public imports and cn remain required.

## Dependencies

Independent of form/delete implementation. Parent owns page integration.

## Completion evidence

All17 discrepancies were implemented with scoped presentation where shared
consumers need defaults. The enum constant was checked line by line. Source date
keys, doc-type cache, filter timing, pagination totals/options, rows/cells/header,
checkboxes, tooltips and mobile overflow popup were rechecked. Eight owned
focused tests passed after final class-composition cleanup; combined63-test
verification is recorded in task10.
