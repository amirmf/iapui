import { useAssignementRuleColumns } from '@features/assignement-rules/components/assignement-rule-columns'
import { useAssignementRuleStore } from '@features/assignement-rules/context/store/assignement-rule-store'
import { assignementRuleSchema } from '@iap/api-types'
import { i18n, i18nReady } from '@shared/i18n/i18n'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const rule = assignementRuleSchema.parse({
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  status: 'ACTIVE',
  title: 'قانون تست',
})

function AssignementRuleActions() {
  const actionsColumn = useAssignementRuleColumns().find(
    (column) => column.id === 'actions'
  )

  if (typeof actionsColumn?.cell !== 'function') {
    return null
  }

  return actionsColumn.cell({ row: { original: rule } } as never)
}

describe('AssignementRuleColumns', () => {
  beforeEach(async () => {
    await i18nReady
    useAssignementRuleStore.getState().reset()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders all 6 columns in exact order', () => {
    function ColumnsInspector() {
      const columns = useAssignementRuleColumns()
      return (
        <div data-testid='count'>
          {columns.length}:{(columns[0] as { accessorKey: string }).accessorKey}
          :{(columns[1] as { accessorKey: string }).accessorKey}:
          {(columns[2] as { accessorKey: string }).accessorKey}:
          {(columns[3] as { accessorKey: string }).accessorKey}:
          {(columns[4] as { accessorKey: string }).accessorKey}:{columns[5].id}
        </div>
      )
    }

    render(<ColumnsInspector />)
    expect(screen.getByTestId('count').textContent).toBe(
      '6:title:docTypeCode:mainAssignedUserUsername:extWorkUnitCode:status:actions'
    )
  })

  it('opens edit dialog when edit action is clicked', async () => {
    const user = userEvent.setup()
    render(<AssignementRuleActions />)

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('assignementRules.actions.edit'),
      })
    )

    expect(useAssignementRuleStore.getState()).toMatchObject({
      currentRow: rule,
      openDialog: 'edit',
    })
  })

  it('opens delete dialog when delete action is clicked', async () => {
    const user = userEvent.setup()
    render(<AssignementRuleActions />)

    await user.click(
      screen.getByRole('button', {
        name: i18n.t('assignementRules.actions.delete'),
      })
    )

    expect(useAssignementRuleStore.getState()).toMatchObject({
      currentRow: rule,
      openDialog: 'delete',
    })
  })
})
