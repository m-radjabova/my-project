import { Box, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {useEffect, useState } from "react";
import useComments from "../../hooks/useComments";
import CommentForm from "./CommentForm";
import type { Comment } from "../../types/types";
import { FaComment, FaTrash } from "react-icons/fa";

function CommentList() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { comments, deleteComment, getCommentsByPostId } = useComments();
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = async (commentId: number) => {
    if (window.confirm("Haqiqatan ham bu commentni o'chirmoqchimisiz?")) {
      await deleteComment(commentId);
    }
  };

  const handleAddSuccess = () => {
    setOpenModal(false);
  };

  useEffect (() => {
    getCommentsByPostId(Number(id));
  }, [id]);

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        p={2}
      >
        <Button variant="contained" onClick={() => navigate(-1)}>
          Orqaga
        </Button>
        <Typography variant="h4">Post #{id} Commentlari</Typography>
        <Button 
          variant="contained" 
          startIcon={<FaComment />}
          onClick={() => setOpenModal(true)}
        >
          Comment Qo'shish
        </Button>
      </Box>

      {/* {isLoading ? (
        <Typography variant="h6" textAlign="center">Yuklanmoqda...</Typography>
      ) : ( */}
        <Table sx={{ minWidth: 650 }} aria-label="comments table">
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Ism</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Matn</strong></TableCell>
              <TableCell><strong>Amallar</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((comment:Comment) => (
              <TableRow key={comment.id} hover>
                <TableCell>{comment.id}</TableCell>
                <TableCell>{comment.name}</TableCell>
                <TableCell>{comment.email}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{comment.body}</TableCell>
                <TableCell>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(comment.id)}
                  >
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* )} */}

      {comments.length === 0 && (
        <Typography variant="h6" textAlign="center" mt={4}>
          Commentlar topilmadi
        </Typography>
      )}

      <CommentForm 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        onSuccess={handleAddSuccess}
        postId={Number(id)}
      />
    </Container>
  );
}

export default CommentList;