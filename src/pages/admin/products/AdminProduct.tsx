import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useCategories from "../../../hooks/useCategories";
import UseModal from "../../../hooks/UseModal";
import UseDeleteModal from "../../../hooks/UseDeleteModal";
import useProducts from "../../../hooks/useProducts";
import type { Product } from "../../../types/types";

type FormShape = {
  name: string;
  price: number;
  category_id: number;     
  description?: string;
  weight?: string;
  image: FileList;      
};

function AdminProduct() {
  const { products, addProduct, updateProduct, deleteProduct, loadingProducts, isAdding, isUpdating, isDeleting } =
    useProducts();
  const { categories } = useCategories();

  const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormShape>();

  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const watchedFiles = watch("image");
  const previewUrl = useMemo(() => {
    const file = watchedFiles?.[0];
    return file ? URL.createObjectURL(file) : "";
  }, [watchedFiles]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);

    setValue("name", product.name);
    setValue("price", Number(product.price));
    setValue("category_id", Number(product.category_id ?? product.category_id));
    setValue("description", product.description || "");
    setValue("weight", product.weight || "");

    setIsOpen(true);
  };

  const onSubmit = async (data: FormShape) => {
    const file = data.image?.[0]; 

    const payload = {
      name: data.name,
      price: Number(data.price),
      category_id: Number(data.category_id),
      description: data.description ? String(data.description) : undefined,
      weight: data.weight ? String(data.weight) : undefined,
      ...(file ? { image: file } : {}),
    };

    if (editingProduct?.id) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingProduct(null);
    reset();
  };

  const handleDelete = async () => {
    if (productToDelete?.id) await deleteProduct(productToDelete.id);
    setOpenDelete(false);
    setProductToDelete(null);
  };

  if (loadingProducts) {
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
    <div className="admin-product">
      <div className="admin-product-header">
        <h1>Product Management</h1>

        <button
          onClick={() => {
            setEditingProduct(null);
            reset();
            setIsOpen(true);
          }}
          className="add-product-btn"
        >
          <span>Create Product</span>
        </button>

        <div className="divider"></div>
      </div>

      <div className="admin-product-body">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={`${API_ORIGIN}${product?.image || ""}`}
                  alt={product.name}
                />
                <div className="product-actions">
                  <button className="action-btn edit" onClick={() => handleEditClick(product)}>
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => {
                      setProductToDelete(product);
                      setOpenDelete(true);
                    }}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="price-container">
                  <span className="current-price">${product.price}</span>
                </div>
                <div className="product-meta">
                  <span className="weight">{product?.weight || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <UseModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          title={editingProduct ? "Update Product" : "Create Product"}
          size="lg"
          showCloseButton={true}
        >
          <div className="modal-content-custom">
            <form onSubmit={handleSubmit(onSubmit)} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Product Name</label>
                  <input id="name" {...register("name", { required: "Name is required" })} />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    {...register("price", { required: "Price is required", valueAsNumber: true })}
                  />
                  {errors.price && <span className="error">{errors.price.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category_id">Category</label>
                  <select
                    id="category_id"
                    {...register("category_id", {
                      required: "Category is required",
                      valueAsNumber: true,
                    })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={Number(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <span className="error">{errors.category_id.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight</label>
                  <input id="weight" {...register("weight")} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <span className="error">{errors.description.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image (upload)</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    validate: (files) => {
                      // create da rasm required, update da optional
                      if (!editingProduct && (!files || files.length === 0)) return "Image is required";
                      return true;
                    },
                  })}
                />
                {errors.image && <span className="error">{String(errors.image.message)}</span>}
              </div>

              <div className="image-preview">
                <label>Preview</label>
                <div className="preview-container">
                  <img
                    src={previewUrl || (editingProduct ? `${API_ORIGIN}${editingProduct.image}` : "")}
                    alt="Preview"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>

                <button type="submit" className="submit-btn" disabled={isAdding || isUpdating}>
                  {editingProduct
                    ? isUpdating
                      ? "Updating..."
                      : "Update Product"
                    : isAdding
                    ? "Creating..."
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </UseModal>

        <UseDeleteModal
          key={productToDelete?.id}
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete?.name}"?`}
        />
      </div>
    </div>
  );
}

export default AdminProduct;