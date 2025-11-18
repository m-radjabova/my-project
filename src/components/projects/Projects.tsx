import useTaskStatus from "../../hooks/useTaskStatus";
import { Button } from '@mui/material';
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import StatusModal from "./StatusModal";
import StatusCard from "./StatusCard";
import type { Status } from "../../types/types";

function Projects() {
  const { statusList } = useTaskStatus(); 
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const order = ["TODO", "INPROGRESS", "VERIFIED", "DONE"];

  const sortedStatus = [...statusList].sort(
    (a, b) => order.indexOf(a.title) - order.indexOf(b.title)
  );

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1  className="projects-title">
          Projects
        </h1>
        <Button 
          className="create-project-btn"
          variant="contained" 
          onClick={handleOpen}
          startIcon={<FaPlus />}
        >
          Create Project
        </Button>
      </div>

      <StatusModal open={open} onClose={handleClose} />

      <div className="status-grid">
        {sortedStatus.map((item : Status) => (
          <StatusCard key={item.id} status={item} />
        ))}
      </div>
    </div>
  );
}

export default Projects;