import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import useComments from "../../hooks/useComments";

interface CommentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  postId: number;
}

function CommentForm({ open, onClose, onSuccess, postId }: CommentFormProps) {
  const { addComment } = useComments();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    body: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addComment({ ...formData, postId });
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
              label="Ism"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="body"
              label="Comment Matni"
              value={formData.body}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} >
            Bekor Qilish
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
          >
           Qo'shish
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CommentForm;