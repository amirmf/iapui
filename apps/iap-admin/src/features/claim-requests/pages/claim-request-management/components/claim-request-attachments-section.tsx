import type { Attachment } from '@iap/api-types'
import { Card, CardContent } from '@iap/ui'
import { FileViewer } from '@modules/files'

interface ClaimRequestAttachmentsSectionProps {
  attachments: Attachment[]
}

export function ClaimRequestAttachmentsSection(
  props: ClaimRequestAttachmentsSectionProps
) {
  const { attachments } = props
  if (attachments.length === 0) return null
  return (
    <Card className='flex h-[75vh] flex-1 flex-col gap-2 py-4'>
      <CardContent className='px-4'>
        <FileViewer
          attachments={attachments}
          transformComponentWrapperStyle={{
            height: '100%',
            width: '100%',
          }}
        />
      </CardContent>
    </Card>
  )
}
