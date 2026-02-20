import {useQuery} from '@tanstack/react-query'
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'
import {ICategoryRequest} from '@/src/entities/category/api/categories.interface'
import {getMenuItems} from '@/src/entities/menu-item/api/menu-items.api'

export const useMenuItems = ({ location_id }: ICategoryRequest) => {
  return useQuery({
    queryKey: [ERequestRoutes.CATALOG, location_id],
    queryFn: () => getMenuItems({location_id}),
    enabled: !!location_id,
    staleTime: 1000 * 60 * 10,
  });
};
