import { extractErrorMessage } from '@iap/api-client'
import { toastError } from '@iap/ui'

const DEFAULT_ERROR_MESSAGE = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'

export function handleServerError(error: unknown) {
  toastError({ message: extractErrorMessage(error) ?? DEFAULT_ERROR_MESSAGE })
}
