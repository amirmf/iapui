import { type ErrorMessageOptions, extractErrorMessage } from '@iap/api-client'
import { toastError } from '@iap/ui'

const DEFAULT_ERROR_MESSAGE = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.'

export function handleServerError(
  error: unknown,
  options: ErrorMessageOptions = {}
) {
  const fallback =
    options.presentation === 'reference'
      ? 'Something went wrong!'
      : DEFAULT_ERROR_MESSAGE
  toastError({ message: extractErrorMessage(error, options) ?? fallback })
}
