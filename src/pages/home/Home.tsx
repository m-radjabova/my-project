import { useState } from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import UserForm from "../../components/users/UserForm";
import UserList from "../../components/users/UserList";
import useUsers from "../../hooks/useUsers";
import type { User } from "../../types/types";

function Home() {
  const { users, addUser, updateUser, deleteUser, incrementAge, decrementAge } = useUsers();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (user: User) => {
    if (user.id) {
      updateUser(user);
    } else {
      addUser(user);
    }
    handleClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleCreateUser}
          size="large"
        >
          Create User
        </Button>
      </Box>
      
      <UserList 
        users={users} 
        deleteUser={deleteUser}
        editUser={handleEditUser}
        incrementAge={incrementAge}
        decrementAge={decrementAge}
      />
      
      <UserForm 
        open={open} 
        selectedUser={selectedUser}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

export default Home;