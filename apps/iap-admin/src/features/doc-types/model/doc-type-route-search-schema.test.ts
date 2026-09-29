import { describe, expect, it } from 'vitest'

import { docTypeRouteSearchSchema } from './doc-type-route-search-schema'

describe('docTypeRouteSearchSchema', () => {
  it('accepts the shared table URL state and rejects unknown search fields', () => {
    expect(
      docTypeRouteSearchSchema.parse({
        docType: 'Invoice',
        page: '1',
        pageSize: '20',
        sort: 'docType',
        sortDirection: 'asc',
      })
    ).toMatchObject({ docType: 'Invoice', sort: 'docType' })
    expect(
      docTypeRouteSearchSchema.safeParse({ unknown: 'value' }).success
    ).toBe(false)
  })
})
