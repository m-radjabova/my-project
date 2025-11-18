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

interface TaskListProps {
  status: string;
}

function TaskList({ status }: TaskListProps) {
  const { useTasksByStatus, deleteTask } = useTasks();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const { data: tasks = [], isLoading } = useTasksByStatus(status);

  const handleDeleteClick = (task_id: number) => {
    setTaskToDelete(task_id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const taskToDeleteData = tasks.find((task) => task.id === taskToDelete);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks available</h3>
        <p>There are no tasks with status "{status}"</p>
      </div>
    );
  }

  console.log("tasks", tasks);

  return (
    <div className="task-list-container">
      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-title-section">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  {task.assignee && task.assignee.length > 0 && (
                    <div className="assignee-info">
                      <FaUser className="meta-icon" />
                      <span className="assignee-names">
                        {Array.isArray(task.assignee)
                          ? task.assignee
                              .map((name) => {
                                const parts = name.trim().split(" ");
                                if (parts.length >= 2) {
                                  return `${parts[0]
                                    .charAt(0)
                                    .toUpperCase()}. ${parts[1]}`;
                                }
                                return name.length > 10
                                  ? name.substring(0, 8) + "..."
                                  : name;
                              })
                              .join(", ")
                          : (() => {
                              const name = task.assignee;
                              const parts = name.trim().split(" ");
                              if (parts.length >= 2) {
                                return `${parts[0].charAt(0).toUpperCase()}. ${
                                  parts[1]
                                }`;
                              }
                              return name.length > 10
                                ? name.substring(0, 8) + "..."
                                : name;
                            })()}
                      </span>
                    </div>
                  )}
                  {task.priority && (
                    <div
                      className={`priority-info ${getPriorityColor(
                        task.priority[0]
                      )}`}
                    >
                      <FaFlag className="meta-icon" />
                      <span>
                        {Array.isArray(task.priority)
                          ? task.priority[0]
                          : task.priority}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="task-actions">
                <button
                  className="delete-task-btn"
                  onClick={() => handleDeleteClick(task.id)}
                  aria-label="Delete task"
                >
                  <FaTrash className="action-icon" />
                </button>
              </div>
            </div>

            {task.end_date && (
              <div className="task-due-date">
                <FaCalendarAlt className="date-icon" />
                <span>End: {formatDate(task.end_date)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        className="delete-confirmation-modal"
        PaperProps={{
          className: "modal-paper",
        }}
      >
        <DialogTitle className="modal-title">Delete Task</DialogTitle>

        <DialogContent className="modal-content">
          <Typography>
            Are you sure you want to delete the "
            {taskToDeleteData?.title || "this task"}" task? This action cannot
            be undone.
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
            color="error"
            startIcon={<FaTrash />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;
