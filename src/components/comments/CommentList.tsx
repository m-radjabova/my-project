import { 
  Box, 
  Button, 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography, 
  IconButton,
  CircularProgress,
  Alert 
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import type { Comment } from "../../types/types";
import { FaComment, FaTrash } from "react-icons/fa";
import useComments from "../../hooks/useComments";
import CommentForm from "./CommentForm";

function CommentList() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const postId = Number(id);
  
  const { 
    comments, 
    isLoading, 
    error,
    deleteComment,
    getCommentsByPostId 
  } = useComments(postId);

  const [openModal, setOpenModal] = useState(false);

  const handleDelete = async (commentId: number) => {
    if (window.confirm("Haqiqatan ham bu commentni o'chirmoqchimisiz?")) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error("Comment o'chirishda xato:", error);
      }
    }
  };

  const handleAddSuccess = () => {
    setOpenModal(false);
    getCommentsByPostId(postId);
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          Xatolik yuz berdi: {error.message}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

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
          Back
        </Button>
        <Typography variant="h4">Post #{id} comments</Typography>
        <Button 
          variant="contained" 
          startIcon={<FaComment />}
          onClick={() => setOpenModal(true)}
          disabled={isLoading}
        >
          Create Comment
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <>
          <Table sx={{ minWidth: 650 }} aria-label="comments table">
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>name</strong></TableCell>
                <TableCell><strong>email</strong></TableCell>
                <TableCell><strong>body</strong></TableCell>
                <TableCell><strong>Delete</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment: Comment) => (
                <TableRow key={comment.comment_id} hover>
                  <TableCell>{comment.comment_id}</TableCell>
                  <TableCell>{comment.name}</TableCell>
                  <TableCell>{comment.email}</TableCell>
                  <TableCell sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                    {comment.body}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(comment.comment_id)}
                      disabled={isLoading}
                    >
                      <FaTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {comments.length === 0 && (
            <Typography variant="h6" textAlign="center" mt={4}>
              Comment Not Found
            </Typography>
          )}
        </>
      )}

      <CommentForm 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        onSuccess={handleAddSuccess}
        post_id={postId}
      />
    </Container>
  );
}

export default CommentList;