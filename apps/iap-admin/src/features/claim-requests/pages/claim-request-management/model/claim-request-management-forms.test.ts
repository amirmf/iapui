import {
  claimRequestAssigneeFieldsFormSchema,
  claimRequestReplayFormSchema,
  fanhubTaminNationalCodeFormSchema,
  returnFromPaymentFormSchema,
  returnFromPaymentSendAgainFormSchema,
  updateSubmitDateFormSchema,
} from '@features/claim-requests/pages/claim-request-management/model/claim-request-management-forms'
import { describe, expect, it } from 'vitest'

const t = (key: string) => `translated:${key}`
describe('management source form validation', () => {
  it('keeps assignment whitespace acceptance distinct from trimmed replay', () => {
    expect(
      claimRequestAssigneeFieldsFormSchema(t).safeParse({
        assigneeId: 'doctor',
        description: ' ',
      }).success
    ).toBe(true)
    const failure = claimRequestReplayFormSchema(t).safeParse({
      description: ' ',
    })
    expect(failure.success).toBe(false)
    if (!failure.success)
      expect(failure.error.issues[0]?.message).toBe(
        'translated:claimRequests.messages.descriptionRequired'
      )
  })
  it.each([returnFromPaymentFormSchema, returnFromPaymentSendAgainFormSchema])(
    'requires acknowledgement and trims reason',
    (factory) => {
      expect(
        factory(t).safeParse({ understood: false, description: 'reason' })
          .success
      ).toBe(false)
      expect(
        factory(t).safeParse({ understood: true, description: ' ' }).success
      ).toBe(false)
      expect(
        factory(t).parse({ understood: true, description: ' reason ' })
      ).toEqual({ understood: true, description: 'reason' })
    }
  )
  it('preserves national code issue order and length while trimming values', () => {
    const invalid = fanhubTaminNationalCodeFormSchema(t).safeParse({
      nationalCode: '',
    })
    if (!invalid.success)
      expect(invalid.error.issues.map((issue) => issue.message)).toEqual([
        'translated:claimRequests.taminPrescriptions.validation.nationalCodeRequired',
        'translated:claimRequests.taminPrescriptions.validation.nationalCodeLength',
      ])
    expect(
      fanhubTaminNationalCodeFormSchema(t).parse({
        nationalCode: ' 1234567890 ',
      })
    ).toEqual({ nationalCode: '1234567890' })
  })
  it('keeps amount as required source string rather than introducing numeric validation', () => {
    expect(
      updateSubmitDateFormSchema(t).safeParse({
        submitDate: new Date(),
        amount: 'text',
      }).success
    ).toBe(true)
    expect(
      updateSubmitDateFormSchema(t).safeParse({
        submitDate: undefined,
        amount: '',
      }).success
    ).toBe(false)
  })
})
