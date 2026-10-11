import { useEffect, useRef } from 'react'

import { ObjectionChatCard } from '@features/my-claims/pages/detail/components/objection-chat-card'
import type { ClaimRequestObjection } from '@iap/api-types'
import { cn } from '@iap/ui'

interface ObjectionChatProps {
  objections: ClaimRequestObjection[] | null | undefined
  className?: string
}

function ObjectionChat(props: ObjectionChatProps) {
  const { objections, className } = props
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
    }
  }, [objections])

  if (!Array.isArray(objections) || objections.length === 0) {
    return null
  }

  // Sort objections by createdAt (oldest first)
  const sortedObjections = [...objections].sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime()
    const dateB = new Date(b.createdAt || '').getTime()
    return dateA - dateB
  })

  return (
    <div
      ref={scrollContainerRef}
      className={cn(
        'flex max-h-96 flex-col gap-y-3 overflow-auto rounded-lg border bg-gray-50 p-4 dark:bg-gray-900',
        className
      )}
    >
      {sortedObjections.map((objection, index) => (
        <ObjectionChatCard
          key={objection.id + '_' + index}
          objection={objection}
        />
      ))}
    </div>
  )
}

export default ObjectionChat
