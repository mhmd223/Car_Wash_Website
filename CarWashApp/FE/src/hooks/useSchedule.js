import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { getSchedule } from "../services/schedule_services";
import { uploadSchedule, clearSchedule } from "../services/admin_services";
import { UserContext } from "../components/ContextComponents/UserContext/UserContext";
import useSocket from "../Socket/useSocket";
import { WASH_EVENTS } from "../../../shared/events";

// Reads and admin mutations share this cache key across schedule screens.
export const useSchedule = () => {
  const queryClient = useQueryClient();
  const { socket } = useContext(UserContext);

  useSocket(socket, WASH_EVENTS.SCHEDULE_UPDATED, () => {
    queryClient.invalidateQueries({ queryKey: ["schedule"] });
  });

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
