import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UserForSql } from "../../types/types";
import UseModal from "../../hooks/useModal";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserForSql) => void;
  editingUser: UserForSql | null;
}

const UserModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, editingUser }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForSql>({
    defaultValues: {
      email: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset(editingUser);
    } else {
      reset({
        email: "",
        phone_number: "",
      });
    }
  }, [editingUser, reset, isOpen]);

  const submitHandler = (data: UserForSql) => {
    const newUser = { ...data, id: editingUser ? editingUser.id : 0 };
    onSubmit(newUser);
  };

  return (
    <UseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? "Update User" : "Create User"}
      size="md"
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="email" className="text-dark" >
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <div className="col-12 mb-4">
              <label htmlFor="phone_number" className="text-dark">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="phone_number"
                className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                placeholder="Enter phone number"
                {...register("phone_number", {
                  required: "Phone number is required",
                })}
              />
              {errors.phone_number && (
                <div className="invalid-feedback">{errors.phone_number.message}</div>
              )}
            </div>
          </div>

          <div className="row mt-2">
            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                style={{ minWidth: "100px" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ minWidth: "120px" }}
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </UseModal>
  );
};

export default UserModal;