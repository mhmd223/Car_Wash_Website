import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserStats } from "../services/wash_services";
import { editAccount, getAccountInfo } from "../services/account_services";

export const useUserInfo = (userId) => {
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getAccountInfo(userId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAccountStats = (userId) => {
  return useQuery({
    queryKey: ["accountStats", userId],
    queryFn: async () => {
      const [userInfo, washStats] = await Promise.all([
        getAccountInfo(userId),
        getUserStats(userId),
      ]);
      return { ...userInfo, ...washStats };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useEditAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, username, email, phone, password }) =>
      editAccount(id, username, email, phone, password),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["accountStats", id] });
      queryClient.invalidateQueries({ queryKey: ["userInfo", id] });
    },
  });
};
