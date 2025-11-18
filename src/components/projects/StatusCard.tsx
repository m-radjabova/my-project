import {
  Typography,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FaPlus, FaTrash } from "react-icons/fa";
import type { Status } from "../../types/types";
import { statusLabels } from "../../utils";
import useTaskStatus from "../../hooks/useTaskStatus";
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import TaskList from "../tasks/TaskList";
import useTasks from "../../hooks/useTasks";

interface StatusCardProps {
  status: Status;
}

function StatusCard({ status }: StatusCardProps) {
  const { deleteTaskStatus } = useTaskStatus();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const {tasks} = useTasks();

  const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => setOpenAddTask(false);

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTaskStatus(status.id);
    setDeleteModalOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  return (
    <>
      <div className="status-card" data-status={status.title}>
        <div className="status-card-header">
          <div className="status-indicator" />
          <Chip
            className="status-badge"
            label={statusLabels[status.title] || status.title}
          />

          <div className="status-card-actions">
            <button
              className="delete-status-btn"
              onClick={handleDeleteClick}
              aria-label="Delete status"
            >
              <FaTrash className="delete-status-icon" />
            </button>
          </div>
        </div>

        <div className="status-card-content">
          <Typography className="status-card-title">
            {statusLabels[status.title] || status.title} ({tasks.filter((task) => task.status === status.title).length})
          </Typography>

          <TaskList status={status.title} />

          <Button
            className="add-task-btn"
            variant="outlined"
            fullWidth
            onClick={handleOpen}
            startIcon={<FaPlus />}
          >
            Add Task
          </Button>
        </div>
      </div>

      <Dialog
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        className="delete-confirmation-modal"
        PaperProps={{
          className: "modal-paper",
        }}
      >
        <DialogTitle className="modal-title">Delete Status</DialogTitle>

        <DialogContent className="modal-content">
          <Typography>
            Are you sure you want to delete the "
            {statusLabels[status.title] || status.title}" status? This action
            cannot be undone.
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

      <AddTaskModal open={openAddTask} onClose={handleClose} />
    </>
  );
}

export default StatusCard;