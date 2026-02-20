import {api} from '@/src/shared/lib/api-client'
import {LocationDTO} from '@per-diem/types'
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'
import {ICategoryRequest} from '@/src/entities/category/api/categories.interface'
import {filterEmptyParams} from '@/src/shared/helpers/filterEmptyParams'

export const getCategories = async (params: ICategoryRequest): Promise<LocationDTO[]> => {
  const searchParams = filterEmptyParams(params);

  return await api.get(ERequestRoutes.CATEGORIES, { searchParams }).json<LocationDTO[]>();
};