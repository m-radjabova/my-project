import {
  Chip,
  Button
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { statusLabels } from "../../utils";
import { useState } from "react";
import AddTaskModal, { type StatusType } from "./add_modal/AddTaskModal";
import TaskList from "../tasks/TaskList";
import useTasks from "../../hooks/useTasks";

interface StatusCardProps {
  statusName: string; 
}

function StatusCard({ statusName }: StatusCardProps) {
  const [openAddTask, setOpenAddTask] = useState(false);
  
  const { tasks } = useTasks();

  const statusGroup = tasks.find((t) => t.status === statusName);
  const taskList = statusGroup ? statusGroup.tasks : [];

  const handleOpen = () => setOpenAddTask(true);
  const handleClose = () => setOpenAddTask(false);

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'TODO': 'todo',
      'IN_PROGRESS': 'inprogress',
      'VERIFIED': 'verified', 
      'DONE': 'done'
    };
    
    const normalizedStatus = status.replace(/_/g, '').toUpperCase();
    return statusMap[normalizedStatus] || statusMap[status] || 'todo';
  };

  const formatStatusName = (status: string) => {
    return statusLabels[status] || status.replace(/_/g, ' ');
  };

  return (
    <>
      <div 
        className="status-card" 
        data-status={getStatusColor(statusName)}
      >
        <div className="status-card-header">
          <div className="status-header-main">
            <div className="status-indicator" />
            <Chip
              className="status-badge"
              label={`${formatStatusName(statusName)} • ${taskList.length}`}
            />
          </div>
        </div>

        <div className="status-card-content">
          <TaskList tasks={taskList} />
          
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

      <AddTaskModal open={openAddTask} onClose={handleClose} defaultStatus={statusName as StatusType | undefined} />

    </>
  );
}

export default StatusCard;