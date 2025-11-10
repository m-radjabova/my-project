import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton
} from "@mui/material";
import type { User } from "../../types/types";
import { GiCancel } from "react-icons/gi";

type Props = {
  open: boolean;
  selectedUser: User | null;
  onClose: () => void;
  onSubmit: (user: User) => void;
};

type FormData = {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  age: number;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

function UserForm({ open, selectedUser, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  // Formni reset qilish va selectedUser ma'lumotlarini to'ldirish
  useEffect(() => {
    if (selectedUser) {
      setValue("name", selectedUser.name || "");
      setValue("email", selectedUser.email || "");
      setValue("phone_number", selectedUser.phone_number || "");
      setValue("address", selectedUser.address || "");
      setValue("age", selectedUser.age || 0);
    } else {
      reset({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        age: 0
      });
    }
  }, [selectedUser, open, reset, setValue]);

  const onFormSubmit = (data: FormData) => {
    const userData: User = {
      ...data,
      id: selectedUser?.id || 0
    };
    onSubmit(userData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="user-modal-title"
      aria-describedby="user-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography id="user-modal-title" variant="h6" component="h2">
            {selectedUser ? "Edit User" : "Create User"}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <GiCancel />
          </IconButton>
        </Box>
        
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              {...register("name", { 
                required: "Name is required"
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              {...register("email", { 
                required: "Email is required"
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              {...register("phone_number", { 
                required: "Phone number is required"
              })}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
            
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              {...register("address", { 
                required: "Address is required",
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            
            <TextField
              label="Age"
              type="number"
              variant="outlined"
              fullWidth
              {...register("age", { 
                required: "Age is required",
                valueAsNumber: true
              })}
              error={!!errors.age}
              helperText={errors.age?.message}
            />
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
              >
                {selectedUser ? "Update" : "Create"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

export default UserForm;