import axios, { AxiosHeaders, type AxiosInstance } from 'axios'

let apiClient: AxiosInstance | null = null
let getAccessToken: () => string | null = () => null

export function configureApiClient(
  baseUrl: string,
  readAccessToken: () => string | null = () => null
) {
  getAccessToken = readAccessToken

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
    const token = getAccessToken()

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
