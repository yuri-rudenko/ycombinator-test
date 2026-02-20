import {SearchParamsOption} from 'ky'

export const filterEmptyParams = <T extends Record<string, any>>(
  params: T
): SearchParamsOption => {
  const filtered: SearchParamsOption = {}

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      filtered[key] = value
    }
  })

  return filtered
}