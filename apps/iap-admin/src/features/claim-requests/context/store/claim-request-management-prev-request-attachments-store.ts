import { create } from 'zustand'

type isOpen = 'prevTable' | 'duplicates' | null

interface ClaimRequestManagementPrevRequestAttachmentsState {
  selectedClaimRequestId: string | null
  isOpen: isOpen
  openDialog: (isOpen: isOpen, claimRequestId: string) => void
  closeDialog: () => void
}

const useClaimRequestManagementPrevRequestAttachmentsStore =
  create<ClaimRequestManagementPrevRequestAttachmentsState>()((set) => ({
    selectedClaimRequestId: null,
    isOpen: null,
    openDialog: (isOpen, claimRequestId) =>
      set({
        selectedClaimRequestId: claimRequestId,
        isOpen,
      }),
    closeDialog: () =>
      set({
        isOpen: null,
        selectedClaimRequestId: null,
      }),
  }))

export function useClaimRequestManagementPrevRequestAttachments(): ClaimRequestManagementPrevRequestAttachmentsState
export function useClaimRequestManagementPrevRequestAttachments<T>(
  selector: (state: ClaimRequestManagementPrevRequestAttachmentsState) => T
): T
export function useClaimRequestManagementPrevRequestAttachments<T>(
  selector?: (state: ClaimRequestManagementPrevRequestAttachmentsState) => T
) {
  const resolvedSelector = selector ?? ((state) => state as unknown as T)
  return useClaimRequestManagementPrevRequestAttachmentsStore(resolvedSelector)
}
