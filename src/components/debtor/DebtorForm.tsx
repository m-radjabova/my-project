import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import type { ReqDebtor } from "../../types/types";
import {
  FaUser,
  FaPhone,
  FaPlus,
  FaTimes,
  FaIdCard,
} from "react-icons/fa";

interface DebtorFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: ReqDebtor) => void;
}

function DebtorForm({ open, handleClose, onSubmit }: DebtorFormProps) {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReqDebtor>();

  const createDebtor = (data: ReqDebtor) => {
    onSubmit(data);
    reset();
  };

  const handleCloseDialog = () => {
    reset();
    handleClose();
  };

  const validatePhoneNumber = (value: string) => {
    if (!value) return "Phone number is required";
    
    const phonePattern = /^\+998\d{9}$/;
    const uzbekPattern = /^998\d{9}$/;
    
    if (!phonePattern.test(value) && !uzbekPattern.test(value)) {
      return "Phone number must start with +998 or 998 followed by 9 digits";
    }
    
    return true;
  };

  const formatPhoneNumber = (value: string): string => {
    if (!value) return "";
    
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.startsWith('998') && numbers.length === 12) {
      return `+${numbers}`;
    }
    
    if (numbers.length === 9) {
      return `+998${numbers}`;
    }
    
    return value;
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 3,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <FaIdCard size={24} />
          <Typography variant="h5" fontWeight="bold">
            Create New Debtor
          </Typography>
        </Box>
        <Button
          onClick={handleCloseDialog}
          sx={{
            color: "white",
            minWidth: "auto",
            p: 0.5,
            borderRadius: "50%",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <FaTimes />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <form onSubmit={formSubmit(createDebtor)}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              color="primary"
              mb={2}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <FaUser size={16} />
              Personal Information
            </Typography>

            <Box sx={{ mb: 3 }} >
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                placeholder="Enter full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser color="#666" />
                    </InputAdornment>
                  ),
                }}
                {...register("full_name", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters",
                  }
                })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Phone Number Field */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                placeholder="+998 XX XXX XX XX"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaPhone color="#666" />
                    </InputAdornment>
                  ),
                  inputProps: {
                    maxLength: 13, 
                  },
                }}
                {...register("phone_number", {
                  required: "Phone number is required",
                  validate: validatePhoneNumber,
                  onChange: (e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    if (formatted !== e.target.value) {
                      e.target.value = formatted;
                    }
                  },
                })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Live Preview */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 3,
                bgcolor: "grey.50",
                borderRadius: 2,
                borderStyle: "dashed",
              }}
            >
              <Typography variant="caption" color="textSecondary" mb={1}>
                Preview:
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  <strong>Name:</strong>{" "}
                  {watch("full_name") || "Not specified"}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong>{" "}
                  {watch("phone_number") || "Not specified"}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Button
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<FaPlus />}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
                disabled={!watch("full_name") || !watch("phone_number")}
              >
                Create Debtor
              </Button>
            </Box>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DebtorForm;