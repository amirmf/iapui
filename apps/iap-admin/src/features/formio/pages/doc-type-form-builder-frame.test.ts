import { parseDocTypeFormSchema } from '@features/formio/model/doc-type-form-schema'
import { describe, expect, it } from 'vitest'

describe('parseDocTypeFormSchema', () => {
  it('uses an empty Form.io form for absent, invalid, and incompatible schemas', () => {
    expect(parseDocTypeFormSchema()).toEqual({
      components: [],
      display: 'form',
    })
    expect(parseDocTypeFormSchema('{invalid')).toEqual({
      components: [],
      display: 'form',
    })
    expect(parseDocTypeFormSchema('{"display":"form"}')).toEqual({
      components: [],
      display: 'form',
    })
  })

  it('returns an independent Form.io schema for a valid persisted schema', () => {
    const source =
      '{"display":"form","components":[{"input":true,"key":"name","type":"textfield"}]}'
    const parsed = parseDocTypeFormSchema(source)

    expect(parsed).toEqual(JSON.parse(source))
    expect(parsed.components).not.toBe(JSON.parse(source).components)
  })
})
