import { useQuery } from "@tanstack/react-query";
import { getUserCars } from "../services/car_services";

export function useUserCars(userId, options = {}) {
  return useQuery({
    queryKey: ["userCars", userId],
    queryFn: () => getUserCars(userId),
    enabled: options.enabled ?? Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}
