import { describe, expect, it } from 'vitest'

import { useShowReport } from './report-show-report-store'

describe('useShowReport', () => {
  it('initializes with isShowReport false and toggles state', () => {
    expect(useShowReport.getState().isShowReport).toBe(false)
    useShowReport.getState().toggleShowReport()
    expect(useShowReport.getState().isShowReport).toBe(true)
    useShowReport.getState().toggleShowReport()
    expect(useShowReport.getState().isShowReport).toBe(false)
  })
})
