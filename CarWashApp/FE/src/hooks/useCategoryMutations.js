import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createVehicleType,
  deleteCategory,
  deleteVehicleType,
  updateCategory,
  updateVehicleType,
} from "../services/category_services";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (categories = []) =>
        categories.map((category) =>
          category.ID === updatedCategory.id
            ? {
                ...category,
                Name: updatedCategory.name,
                Price: updatedCategory.price,
              }
            : category,
        ),
      );

      return { previousCategories };
    },
    onError: (error, _updatedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useCreateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicleType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] });
    },
  });
}

export function useUpdateVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVehicleType,
    onMutate: async (updatedVehicleType) => {
      await queryClient.cancelQueries({ queryKey: ["vehicleTypes"] });
      const previousVehicleTypes = queryClient.getQueryData(["vehicleTypes"]);

      queryClient.setQueryData(["vehicleTypes"], (vehicleTypes = []) =>
        vehicleTypes.map((vehicleType) =>
          vehicleType.ID === updatedVehicleType.id
            ? {
                ...vehicleType,
                Name: updatedVehicleType.name,
                Price: updatedVehicleType.price,
              }
            : vehicleType,
        ),
      );

      return { previousVehicleTypes };
    },
    onError: (error, _updatedVehicleType, context) => {
      if (context?.previousVehicleTypes) {
        queryClient.setQueryData(["vehicleTypes"], context.previousVehicleTypes);
      }
      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] });
    },
  });
}

export function useDeleteVehicleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicleType,
    onMutate: async (vehicleTypeId) => {
      await queryClient.cancelQueries({ queryKey: ["vehicleTypes"] });
      const previousVehicleTypes = queryClient.getQueryData(["vehicleTypes"]);

      queryClient.setQueryData(["vehicleTypes"], (vehicleTypes = []) =>
        vehicleTypes.filter((vehicleType) => vehicleType.ID !== vehicleTypeId),
      );

      return { previousVehicleTypes };
    },
    onError: (error, _vehicleTypeId, context) => {
      if (context?.previousVehicleTypes) {
        queryClient.setQueryData(["vehicleTypes"], context.previousVehicleTypes);
      }
      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicleTypes"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData(["categories"]);

      queryClient.setQueryData(["categories"], (categories = []) =>
        categories.filter((category) => category.ID !== categoryId),
      );

      return { previousCategories };
    },
    onError: (error, _categoryId, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
      return error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
