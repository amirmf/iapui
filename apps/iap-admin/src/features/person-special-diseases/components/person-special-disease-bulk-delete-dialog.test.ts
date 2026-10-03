import { getSelectedPersonSpecialDiseaseIds } from '@features/person-special-diseases/model/person-special-disease-row-selection'
import { personSpecialDiseaseSchema } from '@iap/api-types'
import { describe, expect, it } from 'vitest'

describe('getSelectedPersonSpecialDiseaseIds', () => {
  it('extracts identifiers only from selected rows that have an identifier', () => {
    const rows = [
      personSpecialDiseaseSchema.parse({ id: 'first' }),
      personSpecialDiseaseSchema.parse({ nationalCode: '0012345678' }),
      personSpecialDiseaseSchema.parse({ id: 'third' }),
    ]

    expect(
      getSelectedPersonSpecialDiseaseIds({ 0: true, 1: true, 2: true }, rows)
    ).toEqual(['first', 'third'])
  })

  it('returns no identifiers when the selection does not resolve to rows', () => {
    expect(
      getSelectedPersonSpecialDiseaseIds({ 4: true }, [
        personSpecialDiseaseSchema.parse({ id: 'first' }),
      ])
    ).toEqual([])
  })
})
