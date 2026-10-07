import { useSyncExternalStore } from 'react'

import type { AssessmentItem } from '@iap/api-types'
import { useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'

type AssessmentItemDialogType =
  'create' | 'edit' | 'delete' | 'view' | 'adjustment' | 'adjustment-delete'

interface AssessmentItemState {
  open: AssessmentItemDialogType | null
  selectedItemId: string | null
  setOpen: (open: AssessmentItemDialogType | null) => void
  setCurrentRow: (currentRow: AssessmentItem | null) => void
  reset: () => void
}

export const useAssessmentItemStore = create<AssessmentItemState>((set) => ({
  open: null,
  selectedItemId: null,
  setOpen: (open) => set({ open }),
  setCurrentRow: (currentRow) =>
    set({ selectedItemId: currentRow?.id ?? null }),
  reset: () =>
    set({
      open: null,
      selectedItemId: null,
    }),
}))

export function useAssessmentItem() {
  const state = useAssessmentItemStore()
  const client = useQueryClient()
  const currentRow = useSyncExternalStore(
    (notify) => client.getQueryCache().subscribe(notify),
    () => {
      if (!state.selectedItemId) return null
      for (const [, items] of client.getQueriesData<AssessmentItem[]>({
        queryKey: ['assessmentItems'],
      })) {
        const item = items?.find((item) => item.id === state.selectedItemId)
        if (item) return item
      }
      return null
    }
  )
  return { ...state, currentRow }
}
