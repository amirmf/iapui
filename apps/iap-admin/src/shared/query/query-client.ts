import { useAuthStore } from '@iap/auth'
import { toastError } from '@iap/ui'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

import { handleServerError } from '../errors/handle-server-error'

type CreateQueryClientOptions = {
  onUnauthorized: (callbackUrl: string) => void
}

export function createAppQueryClient(props: CreateQueryClientOptions) {
  const { onUnauthorized } = props

  return new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error, _variables, _result, context) => {
          const reference = context.meta?.errorPresentation === 'reference'
          handleServerError(
            error,
            reference ? { presentation: 'reference' } : undefined
          )

          if (error instanceof AxiosError && error.response?.status === 304) {
            toast.error(
              reference ? 'Content not modified!' : 'محتوا تغییری نکرده است.'
            )
          }
        },
      },
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD,
        retry: (failureCount, error) => {
          if (import.meta.env.DEV) {
            console.log({ error, failureCount })
            return false
          }

          if (failureCount > 3) {
            return false
          }

          return !(
            error instanceof AxiosError &&
            [401, 403].includes(error.response?.status ?? 0)
          )
        },
        staleTime: 10_000,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (!(error instanceof AxiosError)) {
          return
        }

        const status = error.response?.status

        if (status === 401) {
          toastError({ message: 'نشست شما منقضی شده است.' })
          useAuthStore.getState().clearSession()

          const callbackUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
          onUnauthorized(callbackUrl)
        }

        if (status === 403) {
          toastError({ message: 'شما مجاز به انجام این عملیات نیستید.' })
        }

        if (status === 500) {
          handleServerError(error)
        }
      },
    }),
  })
}
