import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import useComments from "../../hooks/useComments";

interface CommentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post_id: number;
}

function CommentForm({ open, onClose, onSuccess, post_id }: CommentFormProps) {
  const { addComment } = useComments();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    body: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addComment({ ...formData, post_id });
        setFormData({ name: "", email: "", body: "" });
        onSuccess();
        onClose();

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yangi Comment Qo'shish</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="email"
              label="Enter Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="body"
              label="Enter Body"
              value={formData.body}
              onChange={handleChange}
              required
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
          >
           Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CommentForm;