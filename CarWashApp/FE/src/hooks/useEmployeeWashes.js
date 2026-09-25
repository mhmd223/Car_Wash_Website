import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllWashes, updateWashStatus } from "../services/wash_services";
import { toast } from "react-toastify";

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
    mutationFn: ({ washId, status, custId }) =>
      updateWashStatus(washId, status, custId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWashes"] });
      toast.success("Wash status updated successfully.");
    },
    onError: () => {
      toast.error("Could not update the wash status.");
    },
  });
};
