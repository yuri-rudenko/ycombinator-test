import {api} from '@/src/shared/lib/api-client'
import {CategoryGroupDTO} from '@per-diem/types'
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'
import {IMenuItemsRequest} from '@/src/entities/menu-item/api/menu-items.interface'
import {filterEmptyParams} from '@/src/shared/helpers/filterEmptyParams'

export const getMenuItems = async (params: IMenuItemsRequest): Promise<CategoryGroupDTO[]> => {
  const searchParams = filterEmptyParams(params);

  return await api.get(ERequestRoutes.CATALOG, { searchParams }).json<CategoryGroupDTO[]>();
};