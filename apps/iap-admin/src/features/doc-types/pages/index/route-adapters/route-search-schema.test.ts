import { describe, expect, it } from 'vitest'

import { docTypeRouteSearchSchema } from './route-search-schema'

describe('docTypeRouteSearchSchema', () => {
  it('accepts the reference table URL state and rejects unknown search fields', () => {
    expect(
      docTypeRouteSearchSchema.parse({
        docType: 'Invoice',
        page: '1',
        size: '40',
        sort: 'docType',
        direction: 'asc',
      })
    ).toMatchObject({ docType: 'Invoice', sort: 'docType' })
    expect(
      docTypeRouteSearchSchema.safeParse({ unknown: 'value' }).success
    ).toBe(false)
  })
})
