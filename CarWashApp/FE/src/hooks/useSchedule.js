import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSchedule } from "../services/schedule_services";
import { uploadSchedule, clearSchedule } from "../services/admin_services";

// Reads and admin mutations share this cache key across schedule screens.
export const useSchedule = () => {
  const queryClient = useQueryClient();

  const scheduleQuery = useQuery({
    queryKey: ["schedule"],
    queryFn: getSchedule,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  const uploadScheduleMutation = useMutation({
    mutationFn: uploadSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });

  const clearScheduleMutation = useMutation({
    mutationFn: clearSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });

  return {
    scheduleQuery,
    uploadScheduleMutation,
    clearScheduleMutation,
  };
};
