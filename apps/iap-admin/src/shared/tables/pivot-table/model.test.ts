import { createPivotTableModel } from '@shared/tables/pivot-table/model'
import { describe, expect, it } from 'vitest'

describe('createPivotTableModel', () => {
  it('groups data by row and column while calculating totals', () => {
    const model = createPivotTableModel({
      columnField: 'status',
      data: [
        { amount: 2, assignee: 'Ali', status: 'Open' },
        { amount: 3, assignee: 'Ali', status: 'Closed' },
        { amount: 4, assignee: 'Sara', status: 'Open' },
      ],
      rowField: 'assignee',
      valueFields: [{ field: 'amount' }],
    })

    expect(model.columnLabels).toEqual(['Closed', 'Open'])
    expect(model.grandTotals).toEqual({ amount: 9 })
    expect(model.rows).toEqual([
      {
        label: 'Ali',
        totals: { amount: 5 },
        values: { Closed: { amount: 3 }, Open: { amount: 2 } },
      },
      { label: 'Sara', totals: { amount: 4 }, values: { Open: { amount: 4 } } },
    ])
  })
})
