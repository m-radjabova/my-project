import StatusCard from "./StatusCard";
import useTasks from "../../hooks/useTasks";
import Select from "react-select";
import useUsers from "../../hooks/useUsers";
import type { User } from "../../types/types";
import { TextField } from "@mui/material";
export type StatusType = "TODO" | "IN_PROGRESS" | "VERIFIED" | "DONE";
export type PriorityType = "LOW" | "MEDIUM" | "HIGH";

function Projects() {
  const { taskStatus } = useTasks();
  const { users } = useUsers();


  const userOptions =
    users?.map((user: User) => ({
      value: user.id.toString(),
      label: user.username,
    })) || [];

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1 className="projects-title">Projects</h1>
      </div>

      <div className="projects-filters">
        <div className="user-filter">
          <Select
            isMulti
            options={userOptions}
            placeholder="Select team members..."
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={() => {
            }}
          />

        </div>
        <div className="priority-filter">
          <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
            defaultValue={{ value: "ALL", label: "All Priorities" }}
            options={[
              { value: "ALL", label: "All Priorities" },
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
            ]}
            onChange={() => {}}
          />

        </div>
        <div className="start-date-filter">
          <TextField
            type="date"
            onChange={() => {}}
          />

        </div>
      </div>

      <div className="status-grid">
        {taskStatus.map((statusName: string) => (
          <StatusCard key={statusName} statusName={statusName} />
        ))}
      </div>
    </div>
  );
}

export default Projects;
