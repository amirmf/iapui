import type { ReactNode } from 'react'

export type DataTableLabels = {
  empty?: ReactNode
  loading?: ReactNode
  noResults?: ReactNode
}

export type DataTableRowLayout = 'table' | 'two-column'

export type DataTablePresentation = 'default' | 'reference'
