import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserWashes } from "../services/wash_services";

export const useAccountStats = (userId) => {
 return useQuery({
    queryKey: ["userWashes", userId],
    queryFn: () => getUserWashes(userId),
    staleTime: 5 * 60 * 1000,
  });

 
};
