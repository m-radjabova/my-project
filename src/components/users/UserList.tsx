import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography
} from "@mui/material";
import type { User } from "../../types/types";
import { FaEdit, FaMinus, FaTrash } from "react-icons/fa";
import { Plus } from "react-bootstrap-icons";

interface Props {
  users: User[];
  deleteUser: (id: number) => void;
  editUser: (user: User) => void;
  incrementAge: (id: number) => void;
  decrementAge: (id: number) => void;
}

function UserList({ users, deleteUser, editUser, incrementAge, decrementAge }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Phone</strong></TableCell>
            <TableCell><strong>Address</strong></TableCell>
            <TableCell><strong>Age</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>{user.address}</TableCell>
             <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => decrementAge(user.id!)}
                    disabled={user.age <= 1}
                  >
                    <FaMinus fontSize="small" />
                  </IconButton>
                  <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                    {user.age}
                  </Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => incrementAge(user.id!)}
                  >
                    <Plus fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <IconButton 
                    color="primary" 
                    onClick={() => editUser(user)}
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
    </TableContainer>
  );
}

export default UserList;