# TASK-06: Table Columns and Row Actions

## Objective
Implement column definitions (`useAssignementRuleColumns`) and row action buttons (`AssignementRuleRowActions`) matching the reference project's columns, badges, sticky positioning, and interaction behaviors.

## Reference Source
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-columns.tsx`
- `insurance-ui/src/features/assignement-rules/components/assignement-rule-row-actions.tsx`

## Implementation Target
- `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-columns.tsx`
- `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-row-actions.tsx`
- Tests: `apps/iap-admin/src/features/assignement-rules/components/assignement-rule-columns.test.tsx`

## 1. Column Specifications (`assignement-rule-columns.tsx`)
Columns must match reference order and keys:

1. **Title (`title`)**
   - Header: `t('assignementRules.columns.title')` with `DataTableColumnHeader`
   - Cell: `row.original.title ?? '-'` with `min-w-40 font-medium`
   - `enableHiding: false`
2. **Doc Type Code (`docTypeCode`)**
   - Header: `t('assignementRules.columns.docTypeCode')` with `DataTableColumnHeader`
   - Cell: `row.original.docTypeCode ?? '-'`
3. **Assignee (`mainAssignedUserUsername`)**
   - Header: `t('assignementRules.columns.assignee')` with `DataTableColumnHeader`
   - Cell: `row.original.mainAssignedUserUsername ?? '-'`
4. **Work Unit Code (`extWorkUnitCode`)**
   - Header: `t('assignementRules.columns.workUnit')` with `DataTableColumnHeader`
   - Cell: `row.original.extWorkUnitCode ?? '-'`
5. **Status (`status`)**
   - Header: `t('assignementRules.columns.status')` with `DataTableColumnHeader`
   - Cell: Outline Badge displaying `t('assignementRules.status.' + status.toLowerCase())`.
   - Classes derived from `assignementRuleStatusBadgeColors`:
     - ACTIVE: `border-emerald-200 text-emerald-700`
     - INACTIVE: `border-slate-200 text-slate-600`
6. **Actions (`actions`)**
   - `id: 'actions'`
   - `cell: ({ row }) => <AssignementRuleRowActions row={row} />`
   - `meta: { className: 'sticky left-0 bg-background w-20' }`

## 2. Row Actions (`assignement-rule-row-actions.tsx`)
Uses `@shared/tables`'s `TableActions` and `TableActionButton`:
- **Edit Action:**
  - Icon: `<Pencil className='h-4 w-4' />` or `<IconEdit className='h-4 w-4' />`
  - Label & Tooltip: `t('assignementRules.actions.edit')`
  - On click: `setCurrentRow(row.original); setOpenDialog('edit')`
- **Delete Action:**
  - Variant: `'destructive'`
  - Icon: `<Trash2 className='h-4 w-4' />` or `<IconTrash className='h-4 w-4' />`
  - Label & Tooltip: `t('assignementRules.actions.delete')`
  - On click: `setCurrentRow(row.original); setOpenDialog('delete')`

## 3. Unit Tests
- Verify all 6 columns exist in correct sequence.
- Verify status badge rendering for `ACTIVE` and `INACTIVE`.
- Verify null fallbacks (`'-'`).
- Verify clicking Edit and Delete invokes store actions with the row's data.

## Acceptance Criteria
- [ ] Columns match reference project exactly (labels, accessors, sequence, formatting).
- [ ] Sticky positioning on actions column preserved.
- [ ] Component tests pass.
