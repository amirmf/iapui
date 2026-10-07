import ClaimRequestDocuments from '@features/claim-requests/pages/claim-request-management/components/claim-request-documents'
import type { Document } from '@iap/api-types'
import { isAdminRole, useAuthSession } from '@iap/auth'
import { Card, CardContent, CardHeader, CardTitle, Permission } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'
import { useLocation } from '@tanstack/react-router'

interface ClaimRequestDocumentsSectionProps {
  claimRequestId: string
  documents: Document[]
}

export function ClaimRequestDocumentsSection(
  props: ClaimRequestDocumentsSectionProps
) {
  const { claimRequestId, documents } = props
  const { t } = useTranslate()
  const { user } = useAuthSession()
  const isAgentPanel = useLocation({
    select: (location) => location.pathname.startsWith('/agent'),
  })

  return (
    <Permission hasPermission={isAdminRole(user?.roles ?? []) && !isAgentPanel}>
      <Card className='mb-5 max-h-screen gap-2 pb-4'>
        <CardHeader>
          <CardTitle>{t('claimRequests.documents.title')}</CardTitle>
        </CardHeader>
        <CardContent className='px-4'>
          <ClaimRequestDocuments
            claimRequestId={claimRequestId}
            documents={documents}
          />
        </CardContent>
      </Card>
    </Permission>
  )
}
