import { useEffect, useState } from 'react'

import { DamageCasesTable } from '@features/outpatient-doc-acceptances/components/damage-cases-table'
import { DmgCaseFormDialog } from '@features/outpatient-doc-acceptances/components/dmg-case-form-dialog'
import { DmgCaseViewDialog } from '@features/outpatient-doc-acceptances/components/dmg-case-view-dialog'
import { useDamageCasesDialog } from '@features/outpatient-doc-acceptances/context/store/damage-cases-dialog-store'
import { useOutpatientDocAcceptance } from '@features/outpatient-doc-acceptances/context/store/outpatient-doc-acceptance-store'
import { outpatientDocAcceptanceService } from '@features/outpatient-doc-acceptances/services/outpatient-doc-acceptance-service'
import { ConfirmDialog } from '@iap/dialogs'
import { Button, cn } from '@iap/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@iap/ui'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function DamageCasesDialog() {
  const { t } = useTranslation()
  const { open, currentRow, closeDialog } = useOutpatientDocAcceptance()
  const isModalOpen = open === 'manageDmgCases'
  const docAcceptanceId = currentRow?.id ?? null
  const [cachedDocAcceptanceId, setCachedDocAcceptanceId] = useState<
    string | null
  >(null)

  useEffect(() => {
    if (isModalOpen && docAcceptanceId) {
      setCachedDocAcceptanceId(docAcceptanceId)
    }
  }, [docAcceptanceId, isModalOpen])

  const effectiveDocAcceptanceId = docAcceptanceId ?? cachedDocAcceptanceId
  const queryClient = useQueryClient()
  const { selectedCase, setMode, setSelectedCase, reset } =
    useDamageCasesDialog()

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeDialog()
      reset()
    }
  }

  const {
    data: damageCases = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['dmg-cases', effectiveDocAcceptanceId],
    queryFn: async () => {
      if (!effectiveDocAcceptanceId) {
        throw new Error('Missing doc acceptance id')
      }
      return outpatientDocAcceptanceService.getDmgCases(
        effectiveDocAcceptanceId
      )
    },
    enabled: isModalOpen && Boolean(effectiveDocAcceptanceId),
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!effectiveDocAcceptanceId) {
        throw new Error('Missing doc acceptance id')
      }
      return outpatientDocAcceptanceService.deleteDmgCase(
        effectiveDocAcceptanceId,
        id
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dmg-cases', effectiveDocAcceptanceId],
      })
      queryClient.invalidateQueries({
        queryKey: ['outpatient-doc-acceptances'],
      })
      toast.success(t('outpatientDocAcceptances.messages.damageCaseDeleted'))
      reset()
    },
  })

  const isDeleteLoading = deleteMutation.isPending

  const handleCreate = () => {
    setSelectedCase(null)
    setMode('create')
  }

  const handleRefresh = () => {
    refetch()
  }

  const handleDeleteConfirm = () => {
    if (selectedCase?.id) {
      deleteMutation.mutate({ id: selectedCase.id })
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-5xl'>
          <DialogHeader>
            <DialogTitle>
              {t('outpatientDocAcceptances.damageCaseDialog.title')}
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-wrap items-center justify-between gap-3 pb-4'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <IconRefresh
                  className={cn('mr-2 h-4 w-4', { 'animate-spin': isLoading })}
                />
                {t('outpatientDocAcceptances.actions.refreshDamageCases')}
              </Button>
              <Button onClick={handleCreate}>
                <IconPlus className='mr-2 h-4 w-4' />
                {t('outpatientDocAcceptances.actions.createDamageCase')}
              </Button>
            </div>
            <div className='text-sm text-muted-foreground'>
              {t('outpatientDocAcceptances.damageCaseDialog.total', {
                count: damageCases.length,
              })}
            </div>
          </div>

          <DamageCasesTable data={damageCases} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
      <DmgCaseFormDialog docAcceptanceId={effectiveDocAcceptanceId || ''} />

      <DmgCaseViewDialog />

      <DamageCaseDeleteDialog
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleteLoading}
      />
    </>
  )
}

function DamageCaseDeleteDialog(props: {
  onConfirm: () => void
  isLoading: boolean
}) {
  const { onConfirm, isLoading } = props
  const { t } = useTranslation()
  const { mode, selectedCase, reset } = useDamageCasesDialog()
  const isOpen = mode === 'delete' && Boolean(selectedCase)

  if (!isOpen || !selectedCase) {
    return null
  }

  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
      onConfirm={onConfirm}
      disableConfirm={isLoading}
      isLoading={isLoading}
      title={t('common.dialog.deleteDialog.permanentTitle')}
      description={t(
        'outpatientDocAcceptances.damageCaseDialog.deleteConfirm',
        {
          serviceDate: selectedCase.serviceDate ?? '-',
          amount: selectedCase.totalAmount ?? '-',
        }
      )}
      confirmLabel={t('common.delete')}
      confirmVariant='destructive'
      presentation='reference'
    />
  )
}
