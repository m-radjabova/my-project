import { useForm, type FieldValues } from "react-hook-form";
import useCategories from "../../../hooks/useCategories";
import { useState } from "react";
import UseModal from "../../../hooks/UseModal";
import UseDeleteModal from "../../../hooks/UseDeleteModal";
import type { Category } from "../../../types/types";
import { BiCategoryAlt } from "react-icons/bi";

function AdminCategories() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { categories, loading, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const onSubmit = (data: FieldValues) => {
    const name = String(data.name);

    if (editingCategory?.id) {
      updateCategory({ id: editingCategory.id, name });
    } else {
      addCategory(name);
    }

    setIsOpen(false);
    reset();
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setIsOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete?.id) {
      deleteCategory(categoryToDelete.id);
    }
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    reset();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingCategory(null);
    reset();
  };

  if (loading) {
    return (
      <div className="admin-carousel">
        <div className="loading-state">
          <div className="dash-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-page">
      <div className="chef-page-header">
        <div className="chef-page-title">
          <div className="title-container">
            <BiCategoryAlt className="chef-icon" />
            <div>
              <h1>Category Management</h1>
              <p>Manage product categories</p>
            </div>
          </div>
          <button onClick={handleAddNew} className="add-product-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14m-7-7h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Create Category</span>
            </button>
        </div>
      </div>

      <div className="admin-category-body">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No categories yet</h3>
            <p>Get started by creating your first category</p>
            <button onClick={handleAddNew} className="empty-action-btn">
              + Create Category
            </button>
          </div>
        ) : (
          <div className="categories-grid mt-4">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-header">
                  <div className="category-icon">
                    <span>📦</span>
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                  </div>
                </div>
                <div className="category-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(category)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteClick(category)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <UseModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          title={editingCategory ? "Update Category" : "Create Category"}
          size="md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter category name"
                {...register("name", { required: "Category name is required" })}
              />
              {errors.name && (
                <span className="error">Category name is required</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </UseModal>

        <UseDeleteModal
          key={categoryToDelete?.id}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Category"
          message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        />
      </div>
    </div>
  );
}

export default AdminCategories;