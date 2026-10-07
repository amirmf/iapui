import {
  type AssessmentItemConfirmDialogType,
  useAssessmentItemConfirmDialog,
} from '@features/assessment-items/context/store/assessment-item-confirm-dialog-store'
import { ConfirmDialog } from '@iap/dialogs'
import { t } from 'i18next'

export function AssessmentItemConfirmDialogs() {
  const { open, setDialogOpen } = useAssessmentItemConfirmDialog()

  const closeDialog = (dialog: AssessmentItemConfirmDialogType) => {
    setDialogOpen(dialog, false)
  }

  return (
    <>
      <ConfirmDialog
        presentation='reference'
        open={open.calculate}
        onOpenChange={(isOpen) => setDialogOpen('calculate', isOpen)}
        title={t('assessmentItems.confirm.calculate.title')}
        description={t('assessmentItems.confirm.calculate.description')}
        confirmLabel={t('common.dialog.understood')}
        hideCancelButton
        onConfirm={() => closeDialog('calculate')}
      />

      <ConfirmDialog
        presentation='reference'
        open={open['max-per-case']}
        onOpenChange={(isOpen) => setDialogOpen('max-per-case', isOpen)}
        title={t('assessmentItems.confirm.maxPerCase.title')}
        description={t('assessmentItems.confirm.maxPerCase.description')}
        confirmLabel={t('common.dialog.understood')}
        hideCancelButton
        onConfirm={() => closeDialog('max-per-case')}
      />

      <ConfirmDialog
        presentation='reference'
        open={open['max-coverage']}
        onOpenChange={(isOpen) => setDialogOpen('max-coverage', isOpen)}
        title={t('assessmentItems.confirm.maxCoverage.title')}
        description={t('assessmentItems.confirm.maxCoverage.description')}
        confirmLabel={t('common.dialog.understood')}
        hideCancelButton
        onConfirm={() => closeDialog('max-coverage')}
      />
    </>
  )
}
