import { type SupportFlowResponse } from '@iap/api-types'

type SupportFlowUserMessageProps = {
  parametersContext?: SupportFlowResponse['parametersContext']
}

const USER_MESSAGE_PREFIX = 'user:'

const getLastUserMessage = (
  parametersContext?: SupportFlowResponse['parametersContext']
) => {
  const messages = parametersContext?.messages as string[] | undefined

  if (!Array.isArray(messages)) return null

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const text = messages[index]?.trimStart() ?? ''

    if (text.startsWith(USER_MESSAGE_PREFIX)) {
      const userMessage = text.slice(USER_MESSAGE_PREFIX.length).trim()
      return userMessage || null
    }
  }

  return null
}

export function SupportFlowUserMessage(props: SupportFlowUserMessageProps) {
  const { parametersContext } = props
  const message = getLastUserMessage(parametersContext)

  if (!message) return null

  return (
    <div className='motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 relative z-10 flex justify-end'>
      <div className='bg-muted w-full px-3.5 py-2.5 text-sm leading-6 font-medium whitespace-pre-wrap shadow-sm sm:px-4 sm:py-3'>
        {message}
      </div>
    </div>
  )
}
