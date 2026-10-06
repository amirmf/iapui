import { getSelectedAssignementRuleIds } from '@features/assignement-rules/context/store/assignement-rule-row-selection'
import type { AssignementRule } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('getSelectedAssignementRuleIds', () => {
  const rows: AssignementRule[] = [
    { id: 'id-1', title: 'Rule 1' },
    { id: 'id-2', title: 'Rule 2' },
    { id: 'id-3', title: 'Rule 3' },
  ]

  it('returns empty array when rowSelection is empty', () => {
    expect(getSelectedAssignementRuleIds({}, rows)).toEqual([])
  })

  it('returns selected IDs based on selection state indices', () => {
    expect(getSelectedAssignementRuleIds({ 0: true, 2: true }, rows)).toEqual([
      'id-1',
      'id-3',
    ])
  })

  it('ignores false selection entries', () => {
    expect(
      getSelectedAssignementRuleIds({ 0: true, 1: false, 2: true }, rows)
    ).toEqual(['id-1', 'id-3'])
  })

  it('ignores rows without valid string id', () => {
    const invalidRows: AssignementRule[] = [
      { id: undefined, title: 'No ID' },
      { id: 'id-valid', title: 'Valid' },
    ]
    expect(
      getSelectedAssignementRuleIds({ 0: true, 1: true }, invalidRows)
    ).toEqual(['id-valid'])
  })
})
