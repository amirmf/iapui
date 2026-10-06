import { Button } from '@iap/ui'
import type { LazyDocument } from '@modules/files/hooks/use-lazy-documents'

interface AttachmentPagerProps {
  docs: LazyDocument[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export function AttachmentPager(props: AttachmentPagerProps) {
  const { docs, selectedIndex, onSelect } = props

  return (
    <div className='flex flex-1 flex-wrap gap-2'>
      {docs.map((doc, index) => (
        <Button
          presentation='reference'
          key={doc.attachment.minioObjectName ?? `${index}`}
          type='button'
          size='sm'
          className='font-blod h-6 px-2 pt-0.5 text-xs'
          variant={index === selectedIndex ? 'default' : 'outline'}
          onClick={() => onSelect(index)}
        >
          {`${index + 1}`}
        </Button>
      ))}
    </div>
  )
}
