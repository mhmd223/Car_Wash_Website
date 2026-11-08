import { useQuery } from "@tanstack/react-query";
import { getVehicleTypes } from "../services/category_services";

export function useVehicleTypes() {
  return useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 5 * 60 * 1000,
  });
}
