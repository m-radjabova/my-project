import { useState } from "react";
import type { Comment } from "../types/types";
import apiClient from "../apiClient/apiClient";

function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const getCommentsByPostId = async (id: number) => {
    try {
      const res = await apiClient.get(`/comments/post/${id}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async (comment: Omit<Comment, "id">) => {
    try {
      const response = await apiClient.post("/comments", comment);
      setComments([...comments, response.data]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  const deleteComment = async (id: number) => {
    try {
      await apiClient.delete(`/comments/${id}`);
      setComments(comments.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  return { comments, getCommentsByPostId, addComment, deleteComment };
}

export default useComments;
