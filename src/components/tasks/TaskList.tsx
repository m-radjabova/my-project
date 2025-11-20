import { FaUser, FaFlag, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { formatDate, getPriorityColor } from "../../utils";
import useTasks from "../../hooks/useTasks";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Task } from "../../types/types";
import AddTaskModal from "../projects/add_modal/AddTaskModal";

interface TaskListProps {
  tasks: Task[];
}

function TaskList({ tasks }: TaskListProps) {
  const { deleteTask } = useTasks();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Task bosilishini oldini olish
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Add your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="task-card"
            onClick={() => handleTaskClick(task)}
          >
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title">{task.title}</h3>
                
                <div className="task-meta">
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="meta-item assignee-info">
                      <FaUser className="meta-icon user-icon" />
                      <span className="meta-text">
                        {task.assignees
                          .map((user) => {
                            const parts = user.username.split(" ");
                            if (parts.length >= 2) {
                              return `${parts[0][0]}. ${parts[1]}`;
                            }
                            return user.username;
                          })
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {task.priority && (
                    <div className={`meta-item priority-info ${getPriorityColor(task.priority)}`}>
                      <FaFlag className="meta-icon flag-icon" />
                      <span className="meta-text">{task.priority}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="task-actions">
                <button
                  className="delete-task-btn"
                  onClick={(e) => handleDeleteClick(task, e)}
                  aria-label="Delete task"
                >
                  <FaTrash className="delete-icon" />
                </button>
              </div>
            </div>

            {task.end_date && (
              <div className="task-due-date">
                <FaCalendarAlt className="date-icon" />
                <span className="date-text">End: {formatDate(task.end_date)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddTaskModal 
        open={editModalOpen} 
        onClose={handleCloseEditModal} 
        task={selectedTask}
      />

      <Dialog
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        className="delete-confirmation-modal"
        PaperProps={{
          className: "modal-paper",
        }}
      >
        <DialogTitle className="modal-title">
          <FaTrash className="title-icon" />
          Delete Task
        </DialogTitle>

        <DialogContent className="modal-content">
          <Typography className="modal-message">
            Are you sure you want to delete "
            <span className="task-name-highlight">
              {taskToDelete?.title || "this task"}
            </span>"?
            <br />
            <span className="warning-text">
              This action cannot be undone.
            </span>
          </Typography>
        </DialogContent>

        <DialogActions className="modal-actions">
          <Button
            onClick={handleCancelDelete}
            className="cancel-btn"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="confirm-delete-btn"
            variant="contained"
            startIcon={<FaTrash />}
          >
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;