import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import type {UserForSql } from "../../types/types";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import useUsersForSql from "../../hooks/useUsersForSql";
import UserModal from "./UserFrom";
import { useNavigate } from "react-router-dom";

function UserListForSql() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserForSql | null>(null);

  const { users, addUser, updateUser, deleteUser} = useUsersForSql();

  const navigate = useNavigate()

  const handleCreateUser = () => {
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEditUser = (user: UserForSql) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (user: UserForSql) => {
    if (user.id) {
      updateUser(user);
    } else {
      addUser(user);
    }
    handleClose();
  };


  return (
    <Container maxWidth="lg" style={{backgroundColor : "White"}}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={4}
        p={2}
      >
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Button variant="contained" onClick={handleCreateUser} size="large">
            Create User
          </Button>
          <Button variant="outlined" onClick={() => navigate("/posts")}   size="large">
            go to posts
          </Button>
        </Box>
      </Box>

      { users.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>email</strong>
              </TableCell>
              <TableCell>
                <strong>phone</strong>
              </TableCell>
              <TableCell>
                <strong>actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: UserForSql) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditUser(user)}
                      size="small"
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user.id!)}
                      size="small"
                    >
                      <FaTrash />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <UserModal
        isOpen={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editingUser={selectedUser}
      />
    </Container>
  );
}

export default UserListForSql;