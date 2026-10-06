import type { PropsWithChildren } from 'react'

import { docTypeService } from '@modules/doc-types/services/doc-type-service'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDocTypesData } from './use-doc-types-data'

vi.mock('@modules/doc-types/services/doc-type-service', () => ({
  docTypeService: { getPage: vi.fn() },
}))

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  function Wrapper(props: PropsWithChildren) {
    const { children } = props
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return { client, wrapper: Wrapper }
}

describe('useDocTypesData source selector parity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(docTypeService.getPage).mockResolvedValue({
      content: [
        { docType: 'Type', docTypeCode: 'TYPE' },
        { docType: null, docTypeCode: null },
      ],
    })
  })
  afterEach(cleanup)

  it('fetches source page/key, persists content, and retains missing codes as empty options', async () => {
    const { client, wrapper } = createWrapper()
    const { result } = renderHook(
      () => useDocTypesData.optionsCode({ enabled: true }),
      { wrapper }
    )
    await waitFor(() =>
      expect(result.current.options).toEqual([
        { label: 'Type', value: 'TYPE' },
        { label: '', value: '' },
      ])
    )
    expect(docTypeService.getPage).toHaveBeenCalledWith({
      page: 0,
      size: 100,
      signal: expect.any(AbortSignal),
    })
    expect(JSON.parse(localStorage.getItem('doc-types:page-100')!)).toEqual(
      result.current.data
    )
    const query = client
      .getQueryCache()
      .find({ queryKey: ['doc-types', 'page', 0, 100] })!
    expect(query.gcTime).toBe(Infinity)
  })

  it('hydrates the exact source localStorage key without re-fetching valid cached content', () => {
    localStorage.setItem(
      'doc-types:page-100',
      JSON.stringify([{ docType: 'Cached', docTypeCode: 'CACHE' }])
    )
    const { wrapper } = createWrapper()
    const { result } = renderHook(
      () => useDocTypesData.optionsCode({ enabled: true }),
      { wrapper }
    )
    expect(result.current.options).toEqual([
      { label: 'Cached', value: 'CACHE' },
    ])
    expect(docTypeService.getPage).not.toHaveBeenCalled()
    useDocTypesData.clearStorage()
    expect(localStorage.getItem('doc-types:page-100')).toBeNull()
  })

  it('keeps the source enabled gate and ignores invalid cached contracts', () => {
    localStorage.setItem('doc-types:page-100', '{"invalid":"not an array"}')
    const { wrapper } = createWrapper()
    const { result } = renderHook(
      () => useDocTypesData.optionsCode({ enabled: false }),
      { wrapper }
    )
    expect(result.current.options).toEqual([])
    expect(docTypeService.getPage).not.toHaveBeenCalled()
  })
})
