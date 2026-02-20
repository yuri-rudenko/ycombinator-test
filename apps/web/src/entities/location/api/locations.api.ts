import { api } from "@/src/shared/lib/api-client";
import { LocationDTO } from '@per-diem/types';
import {ERequestRoutes} from '@/src/shared/enums/ERequestRoutes'

export const getLocations = async (): Promise<LocationDTO[]> => {
  return await api.get(ERequestRoutes.LOCATIONS).json<LocationDTO[]>();
};
