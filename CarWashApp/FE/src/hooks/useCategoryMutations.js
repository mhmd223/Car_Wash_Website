import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  updateCategory,
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
