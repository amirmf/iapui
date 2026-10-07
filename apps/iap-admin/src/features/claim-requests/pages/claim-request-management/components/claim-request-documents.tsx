import { useEffect, useMemo, useState } from 'react'

import type { Document } from '@iap/api-types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@iap/ui'
import { useTranslate } from '@shared/i18n/i18n'

interface ClaimRequestDocumentsProps {
  claimRequestId: string
  documents?: Document[] | null
}

const buildDocumentKey = (document: Document, index: number) => {
  return document.id ?? document.documentType ?? `${index}`
}

const buildIframeSrc = (claimRequestId: string, documentId: string) => {
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  return `${base}/formio/claim-requests/${encodeURIComponent(claimRequestId)}/documents/${encodeURIComponent(documentId)}/`
}

export function ClaimRequestDocuments(props: ClaimRequestDocumentsProps) {
  const { claimRequestId, documents } = props
  const { t, i18n } = useTranslate()
  const documentItems = useMemo(() => {
    if (!Array.isArray(documents)) {
      return []
    }

    return documents.map((document, index) => ({
      document,
      key: String(buildDocumentKey(document, index)),
    }))
  }, [documents])

  const hasDocuments = documentItems.length > 0
  const [activeDocumentKey, setActiveDocumentKey] = useState<string>(() => {
    return documentItems[0]?.key ?? ''
  })

  useEffect(() => {
    if (!hasDocuments) {
      setActiveDocumentKey('')
      return
    }

    setActiveDocumentKey((currentKey) => {
      const keys = documentItems.map((item) => item.key)
      if (currentKey && keys.includes(currentKey)) {
        return currentKey
      }

      return keys[0] ?? ''
    })
  }, [documentItems, hasDocuments])

  return (
    <>
      <div className=''>
        {hasDocuments ? (
          <Tabs
            value={activeDocumentKey || documentItems[0]?.key || ''}
            onValueChange={setActiveDocumentKey}
            className='w-full gap-0 rounded-none'
            dir={i18n.dir()}
          >
            <TabsList className='flex flex-wrap border-b border-border bg-transparent p-0 text-sm font-medium text-muted-foreground'>
              {documentItems.map(({ document, key }) => {
                const docTitle =
                  document.documentType ?? t('common.notAvailable')
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className='after:content-[" "] relative -mb-0.5 rounded-none border-none bg-transparent px-5 pb-1 text-sm font-medium text-muted-foreground transition-colors after:absolute after:-bottom-[1px] after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 data-[state=active]:bg-primary-50 data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:scale-x-100'
                  >
                    {docTitle}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {documentItems.map(({ document, key }) => {
              const docTitle = document.documentType ?? t('common.notAvailable')
              const iframeSrc = document.id
                ? buildIframeSrc(claimRequestId, String(document.id))
                : null

              return (
                <TabsContent
                  key={key}
                  value={key}
                  className='border-t outline-none'
                >
                  <div className='mt-2 w-full overflow-hidden rounded-lg'>
                    <div className='h-[85vh] min-h-150 w-full'>
                      {iframeSrc ? (
                        <iframe
                          key={iframeSrc}
                          src={iframeSrc}
                          title={t('claimRequests.documents.modalTitle', {
                            docType: docTitle,
                          })}
                          className='h-full w-full border-0'
                        />
                      ) : (
                        <div className='flex h-full items-center justify-center p-6 text-sm text-muted-foreground'>
                          {t('claimRequests.documents.unavailable')}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <p className='text-sm text-muted-foreground'>
            {t('claimRequests.documents.empty')}
          </p>
        )}
      </div>
    </>
  )
}

export default ClaimRequestDocuments
