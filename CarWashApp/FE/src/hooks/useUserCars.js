import { useQuery } from "@tanstack/react-query";
import { getUserCars } from "../services/car_services";

export function useUserCars(userId) {
  return useQuery({
    queryKey: ["userCars", userId],
    queryFn: () => getUserCars(userId),
    staleTime: 5 * 60 * 1000,
  });
}
