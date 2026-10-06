import { useAssessmentPrompt } from '@features/assessment-prompts/context/store/assessment-prompt-store'
import type { AssessmentPrompt } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAssessmentPromptColumns } from './assessment-prompt-columns'

const row: AssessmentPrompt = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Rule',
  prompt: 'Prompt',
  agreementId: '550e8400-e29b-41d4-a716-446655440001',
  agreement: { title: ' Agreement ', code: ' AG-1 ' },
  docTypeCode: 'DOC',
  placeType: 'SURGERY_CENTER',
  ruleState: 'DISPLAY',
  status: 'PENDING',
}
function TableHarness() {
  const columns = useAssessmentPromptColumns()
  const table = useReactTable({
    columns,
    data: [row],
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: { 'agreement.title': false, 'agreement.code': false },
    },
  })
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((item) => (
          <tr key={item.id}>
            {item.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
describe('assessment prompt table columns and actions', () => {
  beforeEach(async () => {
    await i18nReady
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
    useAssessmentPrompt.getState().reset()
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })
  it('renders reference labels, trimmed agreement summary, and enum badges in both themes', () => {
    render(<TableHarness />)
    for (const key of [
      'title',
      'prompt',
      'docType',
      'placeType',
      'agreement',
      'ruleState',
      'status',
      'thruDate',
    ])
      expect(
        screen.getByText(i18n.t(`assessmentPrompts.columns.${key}` as never))
      ).toBeTruthy()
    expect(screen.getByText('Agreement - AG-1')).toBeTruthy()
    expect(
      screen.getByText(i18n.t('assessmentPrompts.placeType.surgeryCenter'))
        .className
    ).toContain('dark:text-orange-200')
    expect(
      screen.getByText(i18n.t('assessmentPrompts.status.pending')).className
    ).toContain('border-yellow-200')
    expect(
      screen.getByText(i18n.t('assessmentPrompts.ruleState.display'))
    ).toBeTruthy()
  })
  it('opens view and edit with the selected row through accessible controls', () => {
    render(<TableHarness />)
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('assessmentPrompts.actions.viewDetails'),
      })
    )
    expect(useAssessmentPrompt.getState()).toMatchObject({
      currentRow: row,
      open: 'view',
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('assessmentPrompts.actions.edit'),
      })
    )
    expect(useAssessmentPrompt.getState()).toMatchObject({
      currentRow: row,
      open: 'edit',
    })
  })
  it('uses the source sorting menu and its exact Persian labels', () => {
    render(<TableHarness />)
    fireEvent.keyDown(
      screen.getByRole('button', {
        name: i18n.t('assessmentPrompts.columns.title'),
      }),
      { key: 'Enter' }
    )
    for (const key of ['asc', 'desc', 'reset'] as const)
      expect(
        screen.getByRole('menuitem', { name: i18n.t(`common.${key}`) })
      ).toBeTruthy()
  })
})
