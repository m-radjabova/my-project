import { useForm, type FieldValues } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import UseModal from "../../../hooks/UseModal";
import UseDeleteModal from "../../../hooks/UseDeleteModal";
import type { CarouselItem } from "../../../types/types";
import useCarousel from "../../../hooks/useCarousel";

type FormShape = {
  title1: string;
  title2: string;
  description: string;
  img: FileList;
};

function AdminCarousel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormShape>();

  const {
    carousel,
    loading,
    addCarousel,
    updateCarousel,
    deleteCarousel,
    isAdding,
    isUpdating,
    isDeleting,
  } = useCarousel();

  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<CarouselItem | null>(null);
  const [carouselToDelete, setCarouselToDelete] = useState<CarouselItem | null>(null);
  const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;
  const watchedFiles = watch("img");
  const previewUrl = useMemo(() => {
    const file = watchedFiles?.[0];
    return file ? URL.createObjectURL(file) : "";
  }, [watchedFiles]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit = async (data: FieldValues) => {
    const title1 = String(data.title1 ?? "");
    const title2 = String(data.title2 ?? "");
    const description = String(data.description ?? "");

    const fileList = data.img as FileList | undefined;
    const imgFile = fileList?.[0]; // File

    // ✅ create uchun rasm required, update uchun ixtiyoriy
    const payload = {
      title1,
      title2,
      description,
      ...(imgFile ? { img: imgFile } : {}),
    };

    if (editingCarousel?.id) {
      await updateCarousel(editingCarousel.id, payload);
    } else {
      if (!imgFile) return; // create da rasm bo‘lishi kerak
      await addCarousel(payload);
    }

    handleCloseModal();
  };

  const handleEdit = (item: CarouselItem) => {
    setEditingCarousel(item);
    setValue("title1", item.title1);
    setValue("title2", item.title2);
    setValue("description", item.description ?? ""); // type'ingizga qarab
    // file input'ni set qilmaymiz (browser ruxsat bermaydi)
    setIsOpen(true);
  };

  const handleDeleteClick = (item: CarouselItem) => {
    setCarouselToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (carouselToDelete?.id) await deleteCarousel(carouselToDelete.id);
    setDeleteModalOpen(false);
    setCarouselToDelete(null);
  };

  const handleAddNew = () => {
    setEditingCarousel(null);
    reset();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingCarousel(null);
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
    <div className="admin-carousel">
      <div className="admin-carousel-header">
        <div className="header-content">
          <h1>Carousel Management</h1>
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
          <span>Create Slide</span>
        </button>

        <div className="divider"></div>
      </div>

      <div className="admin-carousel-body">
        {carousel.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h3>No carousel slides yet</h3>
            <p>Create engaging slides for your homepage carousel</p>
            <button onClick={handleAddNew} className="empty-action-btn">
              + Create First Slide
            </button>
          </div>
        ) : (
          <div className="carousel-grid">
            {carousel.map((item) => (
              <div key={item.id} className="carousel-card">
                <div className="carousel-image">
                  <img
                    src={`${API_ORIGIN}${item.img}`} 
                    alt={item.title1}
                  />
                  <div className="carousel-overlay">
                    <span className="slide-badge">Slide Preview</span>
                  </div>
                </div>

                <div className="carousel-content">
                  <div className="carousel-text">
                    <h3 className="carousel-title1">{item.title1}</h3>
                    <h4 className="carousel-title2">{item.title2}</h4>
                    <p className="carousel-description">{item.description}</p>
                  </div>

                  <div className="carousel-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(item)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(item)}
                      disabled={isDeleting}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <UseModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          title={editingCarousel ? "Update Carousel Slide" : "Create New Slide"}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="carousel-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title1">Main Title</label>
                <input
                  id="title1"
                  placeholder="Enter main title"
                  {...register("title1", { required: "Main title is required" })}
                />
                {errors.title1 && <span className="error">{errors.title1.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="title2">Subtitle</label>
                <input
                  id="title2"
                  placeholder="Enter subtitle"
                  {...register("title2", { required: "Subtitle is required" })}
                />
                {errors.title2 && <span className="error">{errors.title2.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Enter slide description"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <span className="error">{errors.description.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="img">Image</label>
              <input
                id="img"
                type="file"
                accept="image/*"
                {...register("img", {
                  validate: (files) => {
                    if (!editingCarousel && (!files || files.length === 0))
                      return "Image is required";
                    return true;
                  },
                })}
              />
              {errors.img && <span className="error">{String(errors.img.message)}</span>}
            </div>

            <div className="image-preview">
              <label>Preview</label>
              <div className="preview-container">
                <img
                  src={previewUrl || (editingCarousel ? `${API_ORIGIN}${editingCarousel.img}` : "")}
                  alt="Preview"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isAdding || isUpdating}>
                {editingCarousel ? (isUpdating ? "Updating..." : "Update Slide") : (isAdding ? "Creating..." : "Create Slide")}
              </button>
            </div>
          </form>
        </UseModal>

        <UseDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Carousel Slide"
          message={
            carouselToDelete
              ? `Are you sure you want to delete "${carouselToDelete.title1}"?`
              : "Are you sure you want to delete this slide?"
          }
        />
      </div>
    </div>
  );
}

export default AdminCarousel;