import {useQuery} from '@tanstack/react-query'
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'
import {getCategories} from '@/src/entities/category/api/categories.api'
import {ICategoryRequest} from '@/src/entities/category/api/categories.interface'

export const useCategories = ({ location_id }: ICategoryRequest) => {
  return useQuery({
    queryKey: [ERequestRoutes.CATEGORIES, location_id],
    queryFn: () => getCategories({location_id}),
    enabled: !!location_id,
    staleTime: 1000 * 60 * 10,
  });
};
