import { adminDocTypeSchema } from '@iap/api-types'
import { docTypeService } from '@modules/doc-types/services/doc-type-service'
import { useQuery } from '@tanstack/react-query'

const DOC_TYPES_STORAGE_KEY = 'doc-types:page-100'

function clearStoredDocTypes() {
  localStorage.removeItem(DOC_TYPES_STORAGE_KEY)
}

function getStoredDocTypes() {
  try {
    const cached = localStorage.getItem(DOC_TYPES_STORAGE_KEY)
    if (!cached) return undefined
    const result = adminDocTypeSchema.array().safeParse(JSON.parse(cached))
    return result.success ? result.data : undefined
  } catch {
    return undefined
  }
}

type UseDocTypesDataProps = { enabled?: boolean }

function useDocTypesData(props?: UseDocTypesDataProps) {
  return useQuery({
    queryKey: ['doc-types', 'page', 0, 100],
    queryFn: async ({ signal }) => {
      const response = await docTypeService.getPage({
        page: 0,
        size: 100,
        signal,
      })
      localStorage.setItem(
        DOC_TYPES_STORAGE_KEY,
        JSON.stringify(response.content)
      )
      return response.content
    },
    initialData: getStoredDocTypes,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: props?.enabled,
  })
}

function useDocTypesDataOptions(props?: UseDocTypesDataProps) {
  const { data, isLoading, isFetching } = useDocTypesData(props)
  const options =
    data?.map((docType) => ({
      label: docType.docType || '',
      value: docType.id || '',
    })) || []
  return { options, isLoading, isFetching, data }
}

function useDocTypesDataOptionsCode(props?: UseDocTypesDataProps) {
  const { data, isLoading, isFetching } = useDocTypesData(props)
  const options =
    data?.map((docType) => ({
      label: docType.docType || '',
      value: docType.docTypeCode || '',
    })) || []
  return { options, isLoading, isFetching, data }
}

useDocTypesData.options = useDocTypesDataOptions
useDocTypesData.optionsCode = useDocTypesDataOptionsCode
useDocTypesData.clearStorage = clearStoredDocTypes

export { useDocTypesData }
