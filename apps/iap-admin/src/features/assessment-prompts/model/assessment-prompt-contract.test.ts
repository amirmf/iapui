import {
  assessmentPromptFormSchema,
  assessmentPromptSchema,
  createAssessmentPromptRequestSchema,
  getAssessmentPromptRequestSchema,
  pageAssessmentPromptSchema,
  pageAssessmentPromptsRequestSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

const promptId = '550e8400-e29b-41d4-a716-446655440000'

describe('assessment prompt contracts', () => {
  it('preserves nullable and omitted DTO fields while validating nested agreement data', () => {
    expect(assessmentPromptSchema.parse({})).toEqual({})
    expect(
      assessmentPromptSchema.parse({ title: null, agreement: null, id: null })
    ).toEqual({ title: null, agreement: null, id: null })
    for (const agreement of [
      { id: 'invalid' },
      { status: 'PENDING' },
      { extPolicyId: 1.5 },
      { createdAt: 'not-a-date' },
    ]) {
      expect(assessmentPromptSchema.safeParse({ agreement }).success).toBe(
        false
      )
    }
    expect(
      assessmentPromptSchema.safeParse({
        agreement: {
          status: 'DRAFT',
          extPolicyId: 1,
          createdAt: '2026-01-01T00:00:00Z',
        },
      }).success
    ).toBe(true)
  })

  it('preserves reference nullable page content and integer metadata', () => {
    expect(pageAssessmentPromptSchema.safeParse({}).success).toBe(true)
    expect(
      pageAssessmentPromptSchema.safeParse({ content: null }).success
    ).toBe(true)
    expect(
      pageAssessmentPromptSchema.safeParse({ content: [], totalElements: null })
        .success
    ).toBe(true)
  })

  it('strips unexpected create payload fields like the reference', () => {
    expect(
      createAssessmentPromptRequestSchema.parse({
        title: 'Title',
        extra: true,
      })
    ).toEqual({ title: 'Title' })
  })
  it('accepts the reference response fields and nested agreement projection', () => {
    expect(
      assessmentPromptSchema.parse({
        agreement: { code: 'AG-1', title: 'قرارداد نمونه' },
        agreementId: promptId,
        id: promptId,
        placeType: 'HOSPITAL',
        ruleState: 'PRELIMINARY',
        status: 'ACTIVE',
        title: 'دستور ارزیابی',
      })
    ).toMatchObject({ agreement: { code: 'AG-1', title: 'قرارداد نمونه' } })
  })

  it('rejects malformed identifiers and enums while stripping unexpected request keys', () => {
    expect(assessmentPromptSchema.safeParse({ id: 'not-a-uuid' }).success).toBe(
      false
    )
    expect(
      assessmentPromptSchema.safeParse({ status: 'ARCHIVED' }).success
    ).toBe(false)
    expect(
      getAssessmentPromptRequestSchema.parse({
        path: { id: promptId },
        unexpected: true,
      })
    ).toEqual({ path: { id: promptId } })
  })

  it('requires reference filters without schema pagination defaults and uses exact source errors', () => {
    expect(pageAssessmentPromptsRequestSchema.parse({ filters: {} })).toEqual({
      filters: {},
    })
    expect(
      assessmentPromptFormSchema
        .safeParse({
          fromDate: new Date(),
          placeType: null,
          prompt: '',
          ruleState: 'SECONDARY',
          status: 'ACTIVE',
          title: '',
        })
        .error?.issues.map((issue) => issue.message)
    ).toEqual(['Title is required', 'Prompt is required'])
  })

  it('strips nested sort/pageable extras but preserves top-level response extras', () => {
    expect(
      pageAssessmentPromptSchema.parse({
        extension: true,
        sort: { sorted: true, extension: true },
        pageable: { pageNumber: 2, extension: true },
      })
    ).toEqual({
      extension: true,
      sort: { sorted: true },
      pageable: { pageNumber: 2 },
    })
    for (const key of ['totalPages', 'size', 'number', 'numberOfElements']) {
      expect(pageAssessmentPromptSchema.safeParse({ [key]: 1.5 }).success).toBe(
        false
      )
    }
  })

  it('preserves source validation issue order for request, DTO and nested agreement fields', () => {
    expect(
      pageAssessmentPromptsRequestSchema
        .safeParse({ page: 'invalid', size: 'invalid', filters: false })
        .error?.issues.map((issue) => issue.path)
    ).toEqual([['page'], ['size'], ['filters']])
    expect(
      assessmentPromptSchema
        .safeParse({
          id: false,
          title: false,
          prompt: false,
          agreementId: false,
          ruleState: false,
          status: false,
          placeType: false,
          docTypeCode: false,
          inputParams: false,
          methodNames: false,
          fromDate: false,
          thruDate: false,
          createdAt: false,
          updatedAt: false,
          createdBy: false,
          updatedBy: false,
          agreement: {
            id: false,
            createdAt: false,
            updatedAt: false,
            title: false,
            code: false,
          },
        })
        .error?.issues.map((issue) => issue.path)
    ).toEqual([
      ['id'],
      ['title'],
      ['prompt'],
      ['agreementId'],
      ['ruleState'],
      ['status'],
      ['placeType'],
      ['docTypeCode'],
      ['inputParams'],
      ['methodNames'],
      ['fromDate'],
      ['thruDate'],
      ['createdAt'],
      ['updatedAt'],
      ['createdBy'],
      ['updatedBy'],
      ['agreement', 'id'],
      ['agreement', 'createdAt'],
      ['agreement', 'updatedAt'],
      ['agreement', 'title'],
      ['agreement', 'code'],
    ])
  })
})
