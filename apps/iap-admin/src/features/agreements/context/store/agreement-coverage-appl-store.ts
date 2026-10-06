import type { AgreementCoverageApplFull } from '@iap/api-types'
import { create } from 'zustand'

type DialogType =
  'create' | 'edit' | 'delete' | 'softDelete' | 'view' | 'deleteMethod'
type AgreementCoverageApplState = {
  open: DialogType | null
  currentRow: AgreementCoverageApplFull | null
  inlineEditRow: AgreementCoverageApplFull | null
  setOpen: (type: DialogType | null) => void
  setCurrentRow: (row: AgreementCoverageApplFull | null) => void
  setInlineEditRow: (row: AgreementCoverageApplFull | null) => void
  reset: () => void
}

const initialState = { open: null, currentRow: null, inlineEditRow: null }

export const useAgreementCoverageApplStore = create<AgreementCoverageApplState>(
  (set) => ({
    ...initialState,
    setOpen: (type) =>
      set((state) => ({ open: state.open === type ? null : type })),
    setCurrentRow: (currentRow) => set({ currentRow }),
    setInlineEditRow: (inlineEditRow) => set({ inlineEditRow }),
    reset: () => set(initialState),
  })
)

export const useAgreementCoverageAppl = useAgreementCoverageApplStore
