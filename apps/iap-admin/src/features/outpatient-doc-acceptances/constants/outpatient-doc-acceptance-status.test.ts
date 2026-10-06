import { describe, expect, it } from 'vitest'

import {
  OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS,
  OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS,
  getOutpatientDocAcceptanceStatusOptions,
  getOutpatientDocAcceptanceWsStatusOptions,
  outpatientDocAcceptanceStatusColors,
  outpatientDocAcceptanceWsStatusColors,
} from './outpatient-doc-acceptance-status'

describe('outpatient document acceptance status constants', () => {
  it('keeps the reference enum values, colors, and translation keys', () => {
    expect(Object.keys(outpatientDocAcceptanceStatusColors)).toEqual([
      'SUBMIT',
      'SENT_TO_SERVER',
      'REJECT',
      'DELETED',
      'FAILED',
      'SUCCESS',
    ])
    expect(Object.keys(outpatientDocAcceptanceWsStatusColors)).toEqual([
      'FAILD',
      'PROGRESS',
      'DONE',
    ])
    expect(OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS.SUCCESS).toBe(
      'outpatientDocAcceptances.status.SUCCESS'
    )
    expect(OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS.FAILD).toBe(
      'outpatientDocAcceptances.wsStatus.FAILD'
    )
  })

  it('builds options in the same order as the reference maps', () => {
    const translate = (key: string) => key
    expect(getOutpatientDocAcceptanceStatusOptions(translate)).toEqual(
      Object.entries(OUTPATIENT_DOC_ACCEPTANCE_STATUS_TRANSLATION_KEYS).map(
        ([value, label]) => ({ value, label })
      )
    )
    expect(getOutpatientDocAcceptanceWsStatusOptions(translate)).toEqual(
      Object.entries(OUTPATIENT_DOC_ACCEPTANCE_WS_STATUS_TRANSLATION_KEYS).map(
        ([value, label]) => ({ value, label })
      )
    )
  })
})
