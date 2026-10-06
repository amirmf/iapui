import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Attachment } from '@iap/api-types'
import fileService from '@modules/files/services/file-service'
import { convertHeicToJpeg } from '@modules/files/utils/convert-heic-to-jpeg'
import {
  EXTENSION_TO_FILE_MIME,
  detectFileTypeByHex,
  isHeic,
} from '@modules/files/utils/file-types'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

export interface IDocument {
  uri: string
  fileType?: string
  fileName?: string
}

export type LazyDocument = {
  attachment: Attachment
  document?: IDocument
  objectUrl?: string
  status: 'idle' | 'loading' | 'loaded' | 'error'
  downloadProgress?: number
  error?: string
}

interface UseLazyDocumentsParams {
  attachments: Attachment[]
}

export function useLazyDocuments(params: UseLazyDocumentsParams) {
  const { attachments } = params
  const { t } = useTranslation()
  const [docs, setDocs] = useState<LazyDocument[]>([])
  const [selectedDocIndexState, setSelectedDocIndexState] = useState(0)
  const docsRef = useRef<LazyDocument[]>([])
  const selectedDocIndexRef = useRef(0)
  const downloadControllersRef = useRef(new Map<number, AbortController>())
  const downloadRequestIdsRef = useRef(new Map<number, symbol>())
  const errorMessageFallback = t('files.viewer.loadFailed')

  const isActiveRequest = useCallback((index: number, requestId: symbol) => {
    return downloadRequestIdsRef.current.get(index) === requestId
  }, [])

  const abortDocumentDownload = useCallback((index: number) => {
    const controller = downloadControllersRef.current.get(index)

    if (!controller) {
      return
    }

    controller.abort()
    downloadControllersRef.current.delete(index)
    downloadRequestIdsRef.current.delete(index)

    setDocs((prev) =>
      produce(prev, (draft) => {
        const target = draft[index]

        if (target?.status !== 'loading') {
          return
        }

        target.status = 'idle'
        target.downloadProgress = undefined
        target.error = undefined
      })
    )
  }, [])

  const abortAllDocumentDownloads = useCallback(() => {
    downloadControllersRef.current.forEach((controller) => controller.abort())
    downloadControllersRef.current.clear()
    downloadRequestIdsRef.current.clear()
  }, [])

  const abortOtherDocumentDownloads = useCallback((activeIndex: number) => {
    const downloadingIndexes = Array.from(downloadControllersRef.current.keys())
    const indexesToAbort = downloadingIndexes.filter(
      (index) => index !== activeIndex
    )

    if (indexesToAbort.length === 0) {
      return
    }

    indexesToAbort.forEach((index) => {
      const controller = downloadControllersRef.current.get(index)

      controller?.abort()
      downloadControllersRef.current.delete(index)
      downloadRequestIdsRef.current.delete(index)
    })

    setDocs((prev) =>
      produce(prev, (draft) => {
        indexesToAbort.forEach((index) => {
          const target = draft[index]

          if (target?.status !== 'loading') {
            return
          }

          target.status = 'idle'
          target.downloadProgress = undefined
          target.error = undefined
        })
      })
    )
  }, [])

  const setSelectedDocIndex = useCallback(
    (index: number) => {
      const currentIndex = selectedDocIndexRef.current

      if (index !== currentIndex) {
        abortOtherDocumentDownloads(index)
      }

      selectedDocIndexRef.current = index
      setSelectedDocIndexState(index)
    },
    [abortOtherDocumentDownloads]
  )

  useEffect(() => {
    docsRef.current = docs
  }, [docs])

  useEffect(() => {
    selectedDocIndexRef.current = selectedDocIndexState
  }, [selectedDocIndexState])

  useEffect(() => {
    abortAllDocumentDownloads()

    setDocs((prevDocs) => {
      prevDocs.forEach((doc) => revokeObjectUrl(doc.objectUrl))

      return attachments
        .filter((attachment) => attachment?.metadata?.name !== 'enhanced')
        .map((attachment) => ({ attachment, status: 'idle' as const }))
    })

    selectedDocIndexRef.current = 0
    setSelectedDocIndexState(0)
  }, [abortAllDocumentDownloads, attachments])

  useEffect(() => {
    return () => {
      abortAllDocumentDownloads()
      docsRef.current.forEach((doc) => revokeObjectUrl(doc.objectUrl))
    }
  }, [abortAllDocumentDownloads])

  useEffect(() => {
    if (docs.length === 0) {
      selectedDocIndexRef.current = 0
      setSelectedDocIndexState(0)
      return
    }

    setSelectedDocIndexState((currentIndex) => {
      const nextIndex =
        currentIndex >= docs.length ? docs.length - 1 : currentIndex

      if (nextIndex !== currentIndex) {
        abortDocumentDownload(currentIndex)
        selectedDocIndexRef.current = nextIndex
      }

      return nextIndex
    })
  }, [abortDocumentDownload, docs.length])

  const ensureDocument = useCallback(
    async (index: number, options?: { force?: boolean }) => {
      const docEntry = docsRef.current[index]

      if (
        !docEntry ||
        docEntry.status === 'loading' ||
        docEntry.status === 'loaded' ||
        (docEntry.status === 'error' && !options?.force)
      ) {
        return
      }

      abortOtherDocumentDownloads(index)

      const requestId = Symbol('downloadRequest')
      const controller = new AbortController()
      downloadControllersRef.current.set(index, controller)
      downloadRequestIdsRef.current.set(index, requestId)

      setDocs((prev) =>
        produce(prev, (draft) => {
          const target = draft[index]
          if (!target) {
            return
          }

          draft[index] = {
            ...target,
            status: 'loading',
            downloadProgress: 0,
            error: undefined,
          }
        })
      )

      try {
        let docFile: Blob
        const attachmentId = docEntry.attachment.id

        if (!attachmentId) {
          throw new Error(errorMessageFallback)
        }

        const blob = await fileService.download(attachmentId, {
          signal: controller.signal,
          onProgress: (progress) => {
            if (!isActiveRequest(index, requestId)) {
              return
            }

            setDocs((prev) =>
              produce(prev, (draft) => {
                const target = draft[index]

                if (!target || target.status !== 'loading') {
                  return
                }

                target.downloadProgress = progress
              })
            )
          },
        })

        if (!isActiveRequest(index, requestId)) {
          return
        }

        setDocs((prev) =>
          produce(prev, (draft) => {
            const target = draft[index]

            if (target?.status === 'loading') {
              target.downloadProgress = 100
            }
          })
        )

        const isFileHeic = await isHeic(blob)
        if (isFileHeic) {
          docFile = await convertHeicToJpeg(blob)
        } else {
          const type = await detectFileTypeByHex(blob)
          let mimeType = type && EXTENSION_TO_FILE_MIME[type]
          if (!type) {
            mimeType = docEntry.attachment.fileType
          }
          docFile = new Blob([blob], {
            type: mimeType ?? undefined,
          })
        }

        if (!isActiveRequest(index, requestId)) {
          return
        }

        const objectUrl = URL.createObjectURL(docFile)
        const document: IDocument = {
          uri: objectUrl,
          fileType: docFile.type,
          fileName: docEntry.attachment.filename,
        }

        const isActive = isActiveRequest(index, requestId)
        setDocs((prev) => {
          return produce(prev, (draft) => {
            const target = draft[index]
            if (!target || !isActive) {
              revokeObjectUrl(objectUrl)
              return
            }

            if (target.objectUrl && target.objectUrl !== objectUrl) {
              revokeObjectUrl(target.objectUrl)
            }

            draft[index] = produce(draft[index], (d) => {
              d.objectUrl = objectUrl
              d.document = document
              d.status = 'loaded'
              d.downloadProgress = 100
            })
          })
        })
      } catch (error) {
        if (!isActiveRequest(index, requestId)) {
          return
        }

        if (isDownloadAbortError(error)) {
          setDocs((prev) =>
            produce(prev, (draft) => {
              const target = draft[index]

              if (target?.status === 'loading') {
                target.status = 'idle'
                target.downloadProgress = undefined
                target.error = undefined
              }
            })
          )
          return
        }

        const message =
          error instanceof Error ? error.message : errorMessageFallback

        setDocs((prev) =>
          produce(prev, (draft) => {
            const target = draft[index]
            if (!target) {
              return
            }

            draft[index] = produce(draft[index], (d) => {
              d.status = 'error'
              d.downloadProgress = undefined
              d.error = message
            })
          })
        )
      } finally {
        if (isActiveRequest(index, requestId)) {
          downloadControllersRef.current.delete(index)
          downloadRequestIdsRef.current.delete(index)
        }
      }
    },
    [abortOtherDocumentDownloads, errorMessageFallback, isActiveRequest]
  )

  useEffect(() => {
    if (!docs[selectedDocIndexState]) {
      return
    }

    void ensureDocument(selectedDocIndexState)
  }, [docs, ensureDocument, selectedDocIndexState])

  const activeDocEntry = useMemo(
    () => docs[selectedDocIndexState],
    [docs, selectedDocIndexState]
  )

  const activeDoc = useMemo(() => activeDocEntry?.document, [activeDocEntry])

  return {
    docs,
    selectedDocIndex: selectedDocIndexState,
    setSelectedDocIndex,
    ensureDocument,
    activeDocEntry,
    activeDoc,
  }
}

function revokeObjectUrl(url?: string) {
  if (url) {
    URL.revokeObjectURL(url)
  }
}

function isDownloadAbortError(error: unknown) {
  if (error instanceof DOMException) {
    return error.name === 'AbortError'
  }

  if (error instanceof Error) {
    return error.name === 'CanceledError' || error.message === 'canceled'
  }

  return false
}
