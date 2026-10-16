import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import { UserContext } from "../../../../ContextComponents/UserContext/UserContext";
import {
  useCategories,
} from "../../../../../hooks/useCategories";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../../../../hooks/useCategoryMutations";
import { roles } from "../../../../../../../BE/data/roles";
import classes from "./categories.module.css";

const emptyForm = { id: "", name: "", price: "" };

function validateCategory(form, isEditing) {
  const errors = {};
  const id = Number(form.id);
  const price = Number(form.price);

  if (!isEditing && (!Number.isInteger(id) || id <= 0)) {
    errors.id = "Enter a positive whole-number ID.";
  }
  if (!form.name.trim()) errors.name = "Name is required.";
  if (form.name.trim().length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }
  if (!Number.isFinite(price) || price < 0) {
    errors.price = "Enter a price of 0 or more.";
  }

  return errors;
}

function CategoryForm({ category, onClose }) {
  const isEditing = Boolean(category);
  const [form, setForm] = useState(
    category
      ? { id: category.ID, name: category.Name, price: category.Price }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateCategory(form, isEditing);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await mutation.mutateAsync({
        id: Number(form.id),
        name: form.name.trim(),
        price: Number(form.price),
      });
      toast.success(isEditing ? "Category updated." : "Category created.");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={classes.modalBackdrop} onMouseDown={onClose}>
      <form
        className={classes.modal}
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !mutation.isPending) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
      >
        <h3 id="category-form-title">
          {isEditing ? "Edit category" : "Create category"}
        </h3>
        {!isEditing && (
          <label>
            ID
            <input
              ref={firstInputRef}
              name="id"
              type="number"
              min="1"
              value={form.id}
              onChange={handleChange}
              aria-invalid={Boolean(errors.id)}
              aria-describedby={errors.id ? "category-id-error" : undefined}
            />
            {errors.id && <span id="category-id-error">{errors.id}</span>}
          </label>
        )}
        <label>
          Name
          <input
            ref={isEditing ? firstInputRef : undefined}
            name="name"
            type="text"
            maxLength="100"
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "category-name-error" : undefined}
          />
          {errors.name && <span id="category-name-error">{errors.name}</span>}
        </label>
        <label>
          Price
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "category-price-error" : undefined}
          />
          {errors.price && <span id="category-price-error">{errors.price}</span>}
        </label>
        <div className={classes.modalActions}>
          <button type="button" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </button>
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Categories() {
  const { user } = useContext(UserContext);
  const { data: categories = [], isLoading, isError, error } = useCategories();
  const deleteMutation = useDeleteCategory();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  if (user?.role?.toLowerCase() !== roles.ADMIN.toLowerCase()) return null;

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete the "${category.Name}" category?`)) return;

    try {
      await deleteMutation.mutateAsync(category.ID);
      toast.success("Category deleted.");
    } catch (deleteError) {
      toast.error(deleteError.message);
    }
  };

  return (
    <section className={classes.container} aria-labelledby="categories-title">
      <div className={classes.header}>
        <div>
          <p className={classes.eyebrow}>Admin tools</p>
          <h2 id="categories-title">Wash categories</h2>
          <p>Manage the services and prices customers can book.</p>
        </div>
        <button type="button" onClick={() => setIsCreating(true)}>
          Add category
        </button>
      </div>

      {isLoading && <p role="status">Loading categories...</p>}
      {isError && <p role="alert">{error.message}</p>}
      {!isLoading && !isError && categories.length === 0 && (
        <p>No wash categories have been created yet.</p>
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <div className={classes.tableWrapper}>
          <table>
            <caption className={classes.srOnly}>Wash categories</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col"><span className={classes.srOnly}>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.ID}>
                  <td>{category.ID}</td>
                  <td>{category.Name}</td>
                  <td>{category.Price}</td>
                  <td className={classes.actions}>
                    <button type="button" onClick={() => setEditingCategory(category)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isCreating || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onClose={() => {
            setIsCreating(false);
            setEditingCategory(null);
          }}
        />
      )}
    </section>
  );
}
