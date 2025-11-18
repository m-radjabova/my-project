import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  MenuItem,
  TextField,
  FormControl,
  Select as MuiSelect,
} from "@mui/material";
import {
  IoMdClose,
  IoMdCalendar,
  IoMdPerson,
  IoMdFlag,
  IoMdList,
  IoMdCreate,
  IoMdCheckmarkCircle,
  IoMdAlert,
} from "react-icons/io";
import { FaPlayCircle } from "react-icons/fa";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import Select from "react-select";
import useUsers from "../../hooks/useUsers";
import useTaskStatus from "../../hooks/useTaskStatus";
import useTasks from "../../hooks/useTasks";
import type { PriorityType, StatusType, User } from "../../types/types";
import { getPriorityIcon } from "../../utils";

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
}

function AddTaskModal({ open, onClose }: StatusModalProps) {
  const { users } = useUsers();
  const { addTask } = useTasks();
  const { statusType, priorityType } = useTaskStatus();

  const userOptions =
    users?.map((user: User) => ({
      value: user.id.toString(),
      label: user.username,
    })) || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      assignee: [],
      status: "TODO", 
      priority: "LOW",
      end_date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FieldValues) => {
    const selectedUsernames = data.assignee.map(
      (option: { value: string; label: string }) => option.label
    );

    // const statusString = data.status;

    const newTask = {
      title: data.title,
      description: data.description,
      assignee: selectedUsernames,
      priority: [data.priority],
      status: data.status,
      end_date: data.end_date,
    };

    addTask(newTask);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      className="status-modal-drawer"
    >
      <Box className="status-modal-container" sx={{ p: 3, width: 700 }}>
        {/* Header */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #333" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "white",
                textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
              }}
            >
              Create Task
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "#94a3b8",
                "&:hover": { color: "white", backgroundColor: "#333" },
              }}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Add a new task to your project
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className="form-container"
        >
          {/* Title */}
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <Box>
                <Typography className="form-label">
                  <IoMdList className="text-blue-400" /> Title
                </Typography>
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter task title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  className={`form-input ${
                    errors.title ? "form-input-error" : ""
                  }`}
                />
              </Box>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography className="form-label">
                  <IoMdCreate className="text-blue-400" /> Description
                </Typography>
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Task description..."
                  className="form-input"
                />
              </Box>
            )}
          />

          <Box className="row-container">
            {/* Status */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Box sx={{ flex: 1 }}>
                  <Typography className="form-label">
                    <FaPlayCircle className="text-blue-400" /> Status
                  </Typography>
                  <FormControl fullWidth>
                    <MuiSelect {...field} className="select-field text-white">
                      {statusType?.map((status: StatusType) => (
                        <MenuItem
                          key={status}
                          value={status}
                          className="menu-item"
                        >
                          {status}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Box>
              )}
            />

            {/* Priority */}
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Box sx={{ flex: 1 }}>
                  <Typography className="form-label">
                    <IoMdFlag className="text-blue-400" /> Priority
                  </Typography>
                  <FormControl fullWidth>
                    <MuiSelect {...field} className="select-field text-white">
                      {priorityType.map((priority: PriorityType) => (
                        <MenuItem
                          key={priority}
                          value={priority}
                          className="menu-item"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {getPriorityIcon(priority)}
                            {priority}
                          </Box>
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </Box>
              )}
            />
          </Box>

          {/* Assignee */}
          <Controller
            name="assignee"
            control={control}
            rules={{ required: "At least one assignee is required" }}
            render={({ field }) => (
              <Box>
                <Typography className="form-label">
                  <IoMdPerson className="text-blue-400" /> Assignee
                </Typography>
                <Select
                  {...field}
                  isMulti
                  options={userOptions}
                  placeholder="Select assignees..."
                  noOptionsMessage={() => "No users found"}
                  className="react-select-styles"
                  classNamePrefix="react-select"
                />
                {errors.assignee && (
                  <Typography className="error-text">
                    <IoMdAlert /> {errors.assignee.message as string}
                  </Typography>
                )}
              </Box>
            )}
          />

          {/* Due Date */}
          <Controller
            name="end_date"
            control={control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <Box>
                <Typography className="form-label">
                  <IoMdCalendar className="text-blue-400" /> End Date
                </Typography>
                <TextField
                  {...field}
                  type="date"
                  fullWidth
                  error={!!errors.end_date}
                  helperText={errors.end_date?.message}
                  className={`form-input ${
                    errors.end_date ? "form-input-error" : ""
                  }`}
                />
              </Box>
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<IoMdCheckmarkCircle size={18} />}
            className="submit-button"
          >
            Create Task
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default AddTaskModal;