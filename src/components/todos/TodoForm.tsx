import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Todo } from "../../types/types";
import UseModal from "../../hooks/useModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Todo) => void;
  editingTodo: Todo | null;
  userId: number
}

const TodoModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, editingTodo, userId }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Todo>({
    defaultValues: {
      title: "",
      user_id: userId,
      completed: false,
    },
  });

  const completed = watch("completed");

  useEffect(() => {
    if (editingTodo) {
      reset(editingTodo);
    } else {
      reset({
        title: "",
        user_id: userId,
        completed: false,
      });
    }
  }, [editingTodo, reset, isOpen, userId]);

  const submitHandler = (data: Todo) => {
    onSubmit({ 
      ...data, 
      user_id: userId, 
      todo_id: editingTodo ? editingTodo.todo_id : 0 
    });
  };

  return (
    <UseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTodo ? "Update Todo" : "Create Todo"}
      size="md"
    >
      <form onSubmit={handleSubmit(submitHandler)} className="todo-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            placeholder="Enter todo title"
            {...register("title", { 
              required: "Title is required", 
              minLength: { 
                value: 3, 
                message: "Title must be at least 3 characters" 
              },
              maxLength: {
                value: 255,
                message: "Title must be less than 255 characters"
              }
            })}
          />
          {errors.title && <span className="error">{errors.title.message}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register("completed")}
            />
            <span className="checkmark"></span>
            Completed
          </label>
          {completed && (
            <div className="completed-note">
              This todo will be marked as completed
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {editingTodo ? "Update Todo" : "Create Todo"}
          </button>
        </div>
      </form>
    </UseModal>
  );
};

export default TodoModal;