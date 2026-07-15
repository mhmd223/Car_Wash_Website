import { useQuery } from "@tanstack/react-query";
import { getUserWashes } from "../services/wash_services";

export function useUserWashes(userId) {
  return useQuery({
    queryKey: ["userWashes", userId],
    queryFn: () => getUserWashes(userId),
    staleTime: 5 * 60 * 1000,
  });
}
