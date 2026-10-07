import { useAssessmentItem } from '@features/assessment-items/context/store/assessment-item-store'
import type { AssessmentItem } from '@iap/api-types'
import { Permission } from '@iap/ui'
import { Button } from '@iap/ui'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { IconCashPlus, IconEdit, IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'

interface AssessmentItemRowActionsProps {
  row?: Row<AssessmentItem>
  assessmentItem?: AssessmentItem
  deleteAccess: boolean
  adjustmentAccess: boolean
  onEdit: () => void
}

export function AssessmentItemCardRowActions(
  props: AssessmentItemRowActionsProps
) {
  const { row, assessmentItem, deleteAccess, adjustmentAccess, onEdit } = props
  const { setOpen, setCurrentRow } = useAssessmentItem()
  const { t } = useTranslate()
  const item = assessmentItem ?? row?.original

  if (!item) {
    return null
  }

  const handleDelete = () => {
    setCurrentRow(item)
    setOpen('delete')
  }

  const handleAdjustment = () => {
    setCurrentRow(item)
    setOpen('adjustment')
  }

  return (
    <TooltipProvider>
      <div className='flex items-center gap-1'>
        <Permission
          hasPermission={
            adjustmentAccess && !assessmentItem?.claimRequestAdjustment
          }
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                presentation='reference'
                variant='ghost'
                size='sm'
                className='size-7 p-0 hover:bg-yellow-100'
                onClick={handleAdjustment}
              >
                <IconCashPlus className='size-5 text-yellow-600' />
                <span className='sr-only'>
                  {t('assessmentItems.adjustment.action')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('assessmentItems.adjustment.action')}
            </TooltipContent>
          </Tooltip>
        </Permission>
        <Permission hasPermission={deleteAccess}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                presentation='reference'
                variant='ghost'
                size='sm'
                className='size-7 p-0 hover:bg-gray-200'
                onClick={onEdit}
              >
                <IconEdit className='size-4' />
                <span className='sr-only'>
                  {t('claimRequests.actions.edit')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('claimRequests.actions.edit')}</TooltipContent>
          </Tooltip>
        </Permission>
        <Permission hasPermission={deleteAccess}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                presentation='reference'
                variant='ghost'
                size='sm'
                className='size-6 p-0 hover:bg-gray-200'
                onClick={handleDelete}
              >
                <IconTrash className='size-4 text-destructive' />
                <span className='sr-only'>
                  {t('claimRequests.actions.delete')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('claimRequests.actions.delete')}</TooltipContent>
          </Tooltip>
        </Permission>
      </div>
    </TooltipProvider>
  )
}
