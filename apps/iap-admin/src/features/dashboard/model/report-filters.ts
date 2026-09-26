export type DashboardFilterValues = Record<
  string,
  string | string[] | undefined
>

export function toDashboardFilters(
  search: Record<string, unknown>
): DashboardFilterValues {
  return Object.fromEntries(
    Object.entries(search).flatMap(([key, value]) => {
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        (Array.isArray(value) &&
          value.every((item) => typeof item === 'string'))
      ) {
        return [[key, value]]
      }

      return []
    })
  ) as DashboardFilterValues
}

/** Removes dashboard-only UI state before a report query is created. */
export function toDashboardReportFilters(filters: DashboardFilterValues) {
  return Object.fromEntries(
    Object.entries(filters).filter(([key]) => key !== 'reportTab')
  ) as DashboardFilterValues
}
