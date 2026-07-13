import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookWash } from "../services/wash_services";

export function useBookWash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookWash,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWashes"] });
    },
  });
}
