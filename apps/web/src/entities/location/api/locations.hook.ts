import { useQuery } from "@tanstack/react-query";
import { getLocations } from "@/src/entities/location/api/locations.api";
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'

export const useLocations = () => {
  return useQuery({
    queryKey: [ERequestRoutes.LOCATIONS],
    queryFn: getLocations,
    staleTime: 1000 * 60 * 10,
  });
};
