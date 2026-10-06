import type { MedicalCenterInvoiceListRequest } from '@iap/api-types'
import type {
  TableFilterQueryParamsState,
  TableFilterSearch,
} from '@shared/tables'

const controls = new Set(['page', 'size', 'sort', 'direction'])
export function parseMedicalCenterInvoiceTableSearch(
  search: TableFilterSearch
): TableFilterQueryParamsState {
  const number = (value: unknown, fallback: number) =>
    typeof value === 'string' && !Number.isNaN(+value) ? +value : fallback
  return {
    filters: Object.fromEntries(
      Object.entries(search).filter(([key]) => !controls.has(key))
    ),
    pagination: {
      pageIndex: number(search.page, 1) - 1,
      pageSize: number(search.size, 40),
    },
    sorting:
      typeof search.sort === 'string' &&
      (search.direction === 'asc' || search.direction === 'desc')
        ? [{ id: search.sort, desc: search.direction === 'desc' }]
        : [],
  }
}
export function toMedicalCenterInvoiceTableSearch(
  state: TableFilterQueryParamsState
): TableFilterSearch {
  const [sort] = state.sorting
  return {
    ...state.filters,
    page: String(state.pagination.pageIndex + 1),
    size: String(state.pagination.pageSize),
    sort: sort?.id,
    direction: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
  }
}
export function toMedicalCenterInvoiceListRequest(
  state: TableFilterQueryParamsState
): MedicalCenterInvoiceListRequest {
  const [sort] = state.sorting
  return {
    page: state.pagination.pageIndex,
    size: state.pagination.pageSize,
    sort: sort?.id,
    direction: sort ? (sort.desc ? 'DESC' : 'ASC') : undefined,
    filters: Object.fromEntries(
      Object.entries(state.filters).filter(
        ([, value]) => typeof value === 'string'
      )
    ) as Record<string, string>,
  }
}
