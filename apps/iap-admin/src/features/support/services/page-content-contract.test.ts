import * as contracts from '@iap/api-types'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const pageSchemas = Object.entries(contracts).filter(
  (entry): entry is [string, z.ZodObject] =>
    entry[1] instanceof z.ZodObject && 'content' in entry[1].shape
)

describe('workspace page content contract', () => {
  it('covers exported page schemas', () => {
    expect(pageSchemas.length).toBeGreaterThan(20)
  })

  it.each(pageSchemas)(
    '%s accepts nullish content and validates arrays',
    (_, schema) => {
      const contentSchema = schema.shape.content
      for (const content of [undefined, null, []]) {
        expect(contentSchema.safeParse(content).success).toBe(true)
      }
      for (const content of ['invalid', {}, [null]]) {
        expect(contentSchema.safeParse(content).success).toBe(false)
      }
    }
  )
})
