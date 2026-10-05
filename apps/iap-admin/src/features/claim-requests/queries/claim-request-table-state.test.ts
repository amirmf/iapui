import { describe, expect, it } from 'vitest'

import { useClaimRequestStore } from '../context/store/claim-request-store'
import { CLAIM_REQUEST_FEATURES } from '../model/claim-request-feature'
import {
  getClaimRequestQuickStatus,
  toClaimRequestApiFilters,
} from '../model/claim-request-filters'
import {
  hasClaimRequestPageChanged,
  parseClaimRequestTableSearch,
  toClaimRequestTableSearch,
} from './claim-request-table-state'

describe('claim request table URL state', () => {
  it('matches the reference pagination and sorting query contract', () => {
    const state = parseClaimRequestTableSearch({
      direction: 'desc',
      page: '3',
      quickStatus: 'PAID',
      size: '50',
      sort: 'updatedAt',
    })

    expect(state).toEqual({
      filters: { quickStatus: 'PAID' },
      pagination: { pageIndex: 2, pageSize: 50 },
      sorting: [{ desc: true, id: 'updatedAt' }],
    })
    expect(toClaimRequestTableSearch(state)).toEqual({
      direction: 'desc',
      page: '3',
      quickStatus: 'PAID',
      size: '50',
      sort: 'updatedAt',
    })
  })

  it('uses the reference defaults for malformed or absent table controls', () => {
    expect(parseClaimRequestTableSearch({ page: '-1', size: 'many' })).toEqual({
      filters: {},
      pagination: { pageIndex: 0, pageSize: 40 },
      sorting: [],
    })
  })

  it('normalizes doctor quick-status URLs before deriving API filters', () => {
    const state = parseClaimRequestTableSearch({
      page: '1',
      quickStatus: 'APPROVED',
      size: '40',
    })

    expect(getClaimRequestQuickStatus(state.filters, true)).toBe('DELEGATED')
    expect(toClaimRequestApiFilters(state.filters, true)).toMatchObject({
      status: 'DELEGATED',
    })
  })

  it('excludes the tickets feature switch from API filters and table state', () => {
    const state = parseClaimRequestTableSearch({
      features: CLAIM_REQUEST_FEATURES.tickets,
      page: '2',
      size: '40',
    })

    expect(state).toMatchObject({
      filters: {},
      pagination: { pageIndex: 1, pageSize: 40 },
      sorting: [],
    })
  })

  it('identifies every page transition that must clear selected rows', () => {
    const current = { pageIndex: 1, pageSize: 40 }

    expect(hasClaimRequestPageChanged(current, current)).toBe(false)
    expect(
      hasClaimRequestPageChanged(current, { pageIndex: 2, pageSize: 40 })
    ).toBe(true)
    expect(
      hasClaimRequestPageChanged(current, { pageIndex: 1, pageSize: 50 })
    ).toBe(true)
  })

  it('clears selection without discarding the active row or dialog state', () => {
    const claimRequest = { id: 'claim-request-1' } as never
    useClaimRequestStore.setState({
      currentRow: claimRequest,
      openDialog: 'delete',
      rowSelection: { 0: true, 2: true },
    })

    useClaimRequestStore.getState().clearRowSelection()

    expect(useClaimRequestStore.getState()).toMatchObject({
      currentRow: claimRequest,
      openDialog: 'delete',
      rowSelection: {},
    })
    useClaimRequestStore.getState().reset()
  })
})
