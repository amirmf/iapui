import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'

import { createPersonSpecialDiseaseFormSchema } from './person-special-disease-form-schema'

const t = ((key: string) => key) as TFunction

describe('createPersonSpecialDiseaseFormSchema', () => {
  it('requires a selected national-code user and at least one special disease', () => {
    const result = createPersonSpecialDiseaseFormSchema(t).safeParse({
      nationalCode: '',
      specialDiseases: [],
    })

    expect(result.success).toBe(false)
    if (result.success) return

    expect(result.error.issues.map((issue) => issue.message)).toEqual([
      'personSpecialDiseases.validation.nationalCodeRequired',
      'personSpecialDiseases.validation.specialDiseasesRequired',
    ])
  })
})
