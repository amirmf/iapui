import type { DmgCase } from '@iap/api-types'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export type DamageCasesDialogMode = 'create' | 'edit' | 'view' | 'delete' | null

interface DamageCasesDialogState {
  mode: DamageCasesDialogMode
  selectedCase: DmgCase | null
  setMode: (mode: DamageCasesDialogMode) => void
  setSelectedCase: (dmgCase: DmgCase | null) => void
  selectCase: (params: {
    mode: Exclude<DamageCasesDialogMode, null>
    dmgCase: DmgCase
  }) => void
  reset: () => void
}

const useDamageCasesDialogStore = create<DamageCasesDialogState>()(
  subscribeWithSelector((set) => ({
    mode: null,
    selectedCase: null,
    setMode: (mode) => set({ mode }),
    setSelectedCase: (dmgCase) => set({ selectedCase: dmgCase }),
    selectCase: ({ mode, dmgCase }) => set({ mode, selectedCase: dmgCase }),
    reset: () => set({ mode: null, selectedCase: null }),
  }))
)

export function useDamageCasesDialog(): DamageCasesDialogState
export function useDamageCasesDialog<T>(
  selector: (state: DamageCasesDialogState) => T
): T
export function useDamageCasesDialog<T>(
  selector?: (state: DamageCasesDialogState) => T
) {
  const resolvedSelector = selector ?? ((state) => state as unknown as T)
  return useDamageCasesDialogStore(resolvedSelector)
}
