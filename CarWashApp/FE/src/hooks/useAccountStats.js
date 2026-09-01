import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserStats } from "../services/wash_services";
import { editAccount, getAccountInfo } from "../services/account_services";
import { getAllUsers } from "../services/admin_services";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getAccountInfo(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useAccountStats = (userId, options = {}) => {
  const enabled = !!userId && (options.enabled ?? true);

  return useQuery({
    queryKey: ["accountStats", userId],
    queryFn: async () => {
      const [userInfo, washStats] = await Promise.all([
        getAccountInfo(userId),
        getUserStats(userId),
      ]);
      return { ...userInfo, ...washStats };
    },
    enabled,
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


export const useAllUsers = (options = {}) => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const allUsers = await getAllUsers();
      return allUsers;
    },
    enabled: options.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
};
