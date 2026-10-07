import {
  pageSupportFeatureSchema,
  pageSupportPageSchema,
  pageSupportQuestionSchema,
  supportFeatureSchema,
  supportPageSchema,
  supportQuestionSchema,
} from '@iap/api-types'
import { describe, expect, it } from 'vitest'

import { supportFeatureFormSchema } from './support-feature-form-schema'
import { supportPageFormSchema } from './support-page-form-schema'
import { supportQuestionFormSchema } from './support-question-form-schema'

describe('support schemas and forms', () => {
  it('parses valid supportQuestion schema including NOINPUT', () => {
    const raw = {
      id: 'q-1',
      questionKey: 'q_key_1',
      title: 'Question Title',
      active: true,
      requiredParamInputDisplay: 'NOINPUT',
      nextSelectableQuestionKeys: ['q_key_2'],
      pageTags: ['page_1'],
      featureTags: ['feat_1'],
    }

    const parsed = supportQuestionSchema.parse(raw)
    expect(parsed.requiredParamInputDisplay).toBe('NOINPUT')
    expect(parsed.questionKey).toBe('q_key_1')
    expect(parsed.pageTags).toEqual(['page_1'])
  })

  it('validates supportQuestionFormSchema successfully', () => {
    const schema = supportQuestionFormSchema()
    const formData = {
      active: true,
      questionKey: 'test_question',
      title: 'Test Title',
      level: '1',
      sequence: '10',
      requiredParam: 'amount',
      requiredParamInputDisplay: 'TEXT' as const,
      nextSelectableQuestionKeys: [{ label: 'Q2', value: 'q_2' }],
      pageTags: ['p_1'],
      featureTags: ['f_1'],
      roles: ['ADMIN'],
      staticResponse: 'Markdown content',
    }

    const result = schema.safeParse(formData)
    expect(result.success).toBe(true)
  })

  it('fails supportQuestionFormSchema when questionKey is missing', () => {
    const schema = supportQuestionFormSchema()
    const formData = {
      active: true,
      questionKey: '',
      title: 'Test Title',
    }

    const result = schema.safeParse(formData)
    expect(result.success).toBe(false)
  })

  it('validates supportPageFormSchema and supportFeatureFormSchema', () => {
    const rawPage = {
      id: 'p1',
      pageKey: 'page_key',
      title: 'Page Title',
      active: true,
    }
    expect(supportPageSchema.parse(rawPage).pageKey).toBe('page_key')

    const rawFeature = {
      id: 'f1',
      featureKey: 'feature_key',
      title: 'Feature Title',
      active: true,
      pageKeys: ['page_key'],
    }
    expect(supportFeatureSchema.parse(rawFeature).featureKey).toBe(
      'feature_key'
    )

    const pageSchema = supportPageFormSchema()
    expect(
      pageSchema.safeParse({
        active: true,
        pageKey: 'page_key',
        title: 'Page Title',
      }).success
    ).toBe(true)

    const featureSchema = supportFeatureFormSchema()
    expect(
      featureSchema.safeParse({
        active: true,
        featureKey: 'feature_key',
        title: 'Feature Title',
        pageKeys: ['page_key'],
      }).success
    ).toBe(true)
  })

  it('validates page schemas', () => {
    const pagedQuestions = pageSupportQuestionSchema.parse({
      content: [
        {
          id: 'q1',
          questionKey: 'q1',
          title: 'Q1',
          active: true,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 10,
    })
    expect(pagedQuestions.content).toHaveLength(1)

    const pagedPages = pageSupportPageSchema.parse({
      content: [
        {
          id: 'p1',
          pageKey: 'dashboard',
          title: 'Dashboard',
          active: true,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 10,
    })
    expect(pagedPages.content).toHaveLength(1)

    const pagedFeatures = pageSupportFeatureSchema.parse({
      content: [
        {
          id: 'f1',
          featureKey: 'feature1',
          title: 'Feature 1',
          active: true,
        },
      ],
      totalElements: 1,
      totalPages: 1,
      pageNumber: 0,
      pageSize: 10,
    })
    expect(pagedFeatures.content).toHaveLength(1)
  })
})
