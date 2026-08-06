import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllWashes, updateWashStatus } from "../services/wash_services";

export const useAllWashes = () => {
  return useQuery({
    queryKey: ["allWashes"],
    queryFn: getAllWashes,
    staleTime: 30 * 1000,
  });
};

export const useUpdateWashStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ washId, status }) => updateWashStatus(washId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWashes"] });
    },
  });
};
