import type { ReleaseAssignmentsPayload } from '@iap/api-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type {
  CreateSubUserPayload,
  UpdateSubUserPayload,
} from '../model/sub-user-form-schema'
import { subUserService } from '../services/sub-user-service'

export function useToggleSubUserStatus() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subUserService.disable(id),
    onError: () => {
      toast.error(t('subUsers.messages.statusUpdateError'))
    },
    onSuccess: () => {
      toast.success(t('subUsers.messages.statusUpdateSuccess'))
      queryClient.invalidateQueries({ queryKey: ['sub-users'] })
    },
  })
}

export function useReleaseAssignments(onSuccess?: () => void) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReleaseAssignmentsPayload) =>
      subUserService.releaseAssignments(payload),
    onSuccess: async () => {
      toast.success(t('subUsers.messages.releaseAssignmentsSuccess'))
      await queryClient.invalidateQueries({ queryKey: ['sub-users'] })
      onSuccess?.()
    },
  })
}

export function useUpsertSubUser(props?: {
  editorId?: string | null
  onSuccess?: () => void
}) {
  const { editorId, onSuccess } = props ?? {}
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateSubUserPayload | UpdateSubUserPayload) => {
      const finalData: CreateSubUserPayload | UpdateSubUserPayload = {
        branchLocations: values.branchLocations ?? null,
        docTypeCodes: values.docTypeCodes,
        email: values.email || null,
        hasAccessToAllBranch: values.hasAccessToAllBranch ?? null,
        mobileNumber: values.mobileNumber,
        partyFname: values.partyFname,
        partyLname: values.partyLname,
        roles: values.roles,
        username: values.username,
      }
      if (values.password) {
        finalData.password = values.password
      }
      if (editorId) {
        return subUserService.update(editorId, finalData)
      }
      return subUserService.create(finalData as CreateSubUserPayload)
    },
    onError: () => {
      toast.error(t('subUsers.messages.saveError'))
    },
    onSuccess: () => {
      toast.success(t('subUsers.messages.saveSuccess'))
      queryClient.invalidateQueries({ queryKey: ['sub-users'] })
      if (editorId) {
        queryClient.invalidateQueries({ queryKey: ['sub-user', editorId] })
      }
      onSuccess?.()
    },
  })
}
