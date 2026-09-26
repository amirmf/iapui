import { AxiosError } from 'axios'

const CANCELED_ERROR_CODES = new Set(['ERR_CANCELED'])

const DIRECT_MESSAGE_KEYS = [
  'message',
  'Message',
  'detail',
  'Detail',
  'error',
  'Error',
  'title',
  'Title',
  'description',
  'Description',
  'reason',
  'Reason',
  'statusMessage',
  'statusText',
]

const COLLECTION_MESSAGE_KEYS = [
  'errors',
  'Errors',
  'validationErrors',
  'ValidationErrors',
  'violations',
  'Violations',
  'details',
  'Details',
]

function uniqueMessages(messages: string[]) {
  const seen = new Set<string>()

  return messages.reduce<string[]>((result, message) => {
    const normalized = message.trim()

    if (normalized && !seen.has(normalized)) {
      seen.add(normalized)
      result.push(normalized)
    }

    return result
  }, [])
}

function collectMessages(
  value: unknown,
  visited: WeakSet<object> = new WeakSet()
): string[] {
  if (value === null || value === undefined) {
    return []
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return [String(value)]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectMessages(item, visited))
  }

  if (typeof value !== 'object') {
    return []
  }

  const objectValue = value as Record<string, unknown>

  if (visited.has(objectValue)) {
    return []
  }

  visited.add(objectValue)

  for (const key of DIRECT_MESSAGE_KEYS) {
    if (key in objectValue) {
      const messages = collectMessages(objectValue[key], visited)
      if (messages.length) {
        return messages
      }
    }
  }

  const aggregatedMessages = COLLECTION_MESSAGE_KEYS.flatMap((key) =>
    key in objectValue ? collectMessages(objectValue[key], visited) : []
  )

  return aggregatedMessages.length
    ? aggregatedMessages
    : Object.values(objectValue).flatMap((item) =>
        collectMessages(item, visited)
      )
}

function isCanceledError(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      (error.code !== undefined && CANCELED_ERROR_CODES.has(error.code)) ||
      error.name.toLowerCase() === 'cancelederror'
    )
  }

  if (error instanceof Error) {
    return /cancelled|canceled/i.test(error.message)
  }

  if (typeof error === 'string') {
    return /cancelled|canceled/i.test(error)
  }

  if (!error || typeof error !== 'object') {
    return false
  }

  const { code, message, name } = error as Record<string, unknown>
  return (
    (typeof code === 'string' && CANCELED_ERROR_CODES.has(code)) ||
    (typeof name === 'string' && name.toLowerCase() === 'cancelederror') ||
    (typeof message === 'string' && /cancelled|canceled/i.test(message))
  )
}

export function extractErrorMessage(error: unknown): string | undefined {
  if (isCanceledError(error)) {
    return undefined
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === 204) {
      return 'Content not found.'
    }

    const responseMessages = uniqueMessages(
      collectMessages(error.response?.data)
    ).filter((message) => /[^\d\s]/.test(message))

    if (responseMessages.length) {
      return responseMessages.join('\n')
    }

    const statusText = error.response?.statusText?.trim()
    if (statusText) {
      return statusText
    }

    const axiosMessage = error.message.trim()
    if (axiosMessage) {
      return axiosMessage
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error === 'object' && error !== null) {
    const messages = uniqueMessages(collectMessages(error)).filter((message) =>
      /[^\d\s]/.test(message)
    )

    if (messages.length) {
      return messages.join('\n')
    }
  }

  return typeof error === 'string' && error.trim() ? error.trim() : undefined
}
