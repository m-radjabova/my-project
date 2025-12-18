import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
  onSubmit: (amount: number) => void;
}

function DebtForm({ open, handleClose, onSubmit }: Props) {
  const [amount, setAmount] = useState<number | string>("");

  const handleSave = () => {
    if (!amount) return;          

    onSubmit(Number(amount));    
    handleClose();
    setAmount("");                
    }


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Debt</DialogTitle>
      <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="standard"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DebtForm;
