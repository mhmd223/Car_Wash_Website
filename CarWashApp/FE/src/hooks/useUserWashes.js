import { useQuery } from "@tanstack/react-query";
import { getUserWashes, getUserStats } from "../services/wash_services";

export function useUserWashes(userId, { retry }) {
  return useQuery({
    queryKey: ["userWashes", userId],
    queryFn: () => getUserWashes(userId),
    staleTime: 5 * 60 * 1000,
    retry: retry ?? true,
  });
}

export function useUserStats(userId) {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => getUserStats(userId),
    staleTime: 5 * 60 * 1000,
  });
}
