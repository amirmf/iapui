import { useCallback, useEffect, useMemo, useState } from 'react'

import ClaimRequestReadonlyItems from '@features/claim-requests/pages/claim-request-management/components/claim-request-readonly-items'
import { type ClaimRequest } from '@iap/api-types'
import { isSuperAdminRole, useAuthSession } from '@iap/auth'
import { ConfirmDialog } from '@iap/dialogs'
import { Separator } from '@iap/ui'
import { useTranslate as useTranslation } from '@shared/i18n/i18n'

interface ClaimRequestManagementErrorProps {
  claimRequest?: ClaimRequest
}

interface Dialog {
  isOpen: boolean
  title: string
  description: string
}

const defaultDialog: Dialog = {
  isOpen: false,
  title: '',
  description: '',
}

function ClaimRequestManagementError(props: ClaimRequestManagementErrorProps) {
  const { claimRequest } = props
  const { t } = useTranslation()
  const { user } = useAuthSession()
  const isSuperAdmin = isSuperAdminRole(user?.roles ?? [])
  const [dialog, setDialog] = useState<Dialog>(defaultDialog)

  const valueErrorDescription = useMemo(() => {
    if (isSuperAdmin && claimRequest?.errorDescription)
      return claimRequest.errorDescription
    return null
  }, [claimRequest?.errorDescription, isSuperAdmin])

  const valueDescription = claimRequest?.description

  const hasErrorText = useCallback(
    (text: string) => {
      return (
        (valueErrorDescription && valueErrorDescription?.search(text) !== -1) ||
        (valueDescription && valueDescription?.search(text) !== -1)
      )
    },
    [valueDescription, valueErrorDescription]
  )

  const showErrorDialog = useCallback((title: string, description: string) => {
    setDialog({
      isOpen: true,
      title,
      description,
    })
  }, [])

  useEffect(() => {
    if (claimRequest?.status === 'SENT_FAILED') {
      const paraclinicalTextError =
        'دریافت مجوز ثبت خسارت پاراکلینیکی تکراری می باشید'
      const paraclinicalDescError =
        'این درخواست به دلیل تکراری بودن از سمت فناوران برگشت داده شده است. لطفا سوابق درخواست های کاربر را چک کنید و در صورتی که واقعا تکراری است درخواست را عودت دهید ولی در صورتی که درخواست واقعا تکراری نیست از طریق دکمه بروزرسانی اطلاعات در بالای صفحه تاریخ درخواست را تغییر دهید و سپس تایید کنید. توجه فرمایید که تایید درخواست ها با مسولیت ارزیاب می باشد لطفا فقط در شرایطی که درخواست واقعا تکراری نیست با ویرایش تاریخ تایید کنید.'
      const toothTextError = 'فیلد شماره دندان ضروری میباشد'
      const toothDescError =
        'لطفا مورد ارزیابی ثبت شده را ویرایش کنید و برای این مورد ارزیابی شماره دندان را انتخاب کنید و سپس مجدد ثبت کنید.'
      const hasParaclinicalError = hasErrorText(paraclinicalTextError)
      if (hasParaclinicalError) {
        showErrorDialog(paraclinicalTextError, paraclinicalDescError)
        return
      }
      const hasToothError = hasErrorText(toothTextError)
      if (hasToothError) {
        showErrorDialog(toothTextError, toothDescError)
      }
    }
  }, [
    claimRequest?.status,
    hasErrorText,
    showErrorDialog,
    valueDescription,
    valueErrorDescription,
  ])

  if (valueErrorDescription || valueDescription) {
    return (
      <>
        {valueErrorDescription && (
          <ClaimRequestReadonlyItems
            className='mt-4'
            title={t('claimRequests.dialog.fields.errorDescription')}
            value={valueErrorDescription}
            classNameValue='break-all min-h-6 max-h-60 w-full overflow-y-auto'
          />
        )}
        {valueDescription && (
          <ClaimRequestReadonlyItems
            className='mt-4'
            title={t('claimRequests.dialog.fields.errorDescription')}
            value={valueDescription}
            classNameValue='break-all min-h-6 max-h-60 w-full overflow-y-auto'
          />
        )}
        <Separator className='my-4' />
        <ConfirmDialog
          presentation='reference'
          open={dialog.isOpen}
          onOpenChange={() => setDialog(defaultDialog)}
          title={dialog.title}
          description={dialog.description}
          confirmLabel={t('common.dialog.understood')}
          onConfirm={() => setDialog(defaultDialog)}
          hideCancelButton
        />
      </>
    )
  }
  return null
}

export default ClaimRequestManagementError
