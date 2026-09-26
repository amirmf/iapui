import axios, { AxiosHeaders, type AxiosInstance } from 'axios'

import { useAuthSessionStore } from './auth-session-store'

let apiClient: AxiosInstance | null = null

export function configureApiClient(baseUrl: string) {
  if (apiClient) {
    apiClient.defaults.baseURL = baseUrl
    return
  }

  apiClient = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    paramsSerializer: { indexes: null },
  })

  apiClient.interceptors.request.use((config) => {
    const token = useAuthSessionStore.getState().accessToken

    if (!token) {
      return config
    }

    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers

    return config
  })
}

export function getApiClient() {
  if (!apiClient) {
    throw new Error('API client is not configured.')
  }

  return apiClient
}
