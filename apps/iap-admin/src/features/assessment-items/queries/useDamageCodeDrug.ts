import useDamageCodeSearchData from '@features/assessment-items/queries/use-damage-code-search-data'

function useDamageCodeDrug(enabled?: boolean) {
  const { data, ...rest } = useDamageCodeSearchData({
    code: '6760',
    enabled,
  })
  const damageCode = data?.content?.[0]
  return { data: damageCode, ...rest }
}

export default useDamageCodeDrug
