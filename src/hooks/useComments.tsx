import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { Comment, ReqComment } from "../types/types";

function useComments(post_id?: number) {
  const queryClient = useQueryClient();
  
 const { 
    data: comments = [], 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ["comments", "post", post_id], 
    queryFn: async () => {
      if (!post_id) return [];
      const res = await apiClient.get<Comment[]>(`/comments/post/${post_id}`);
      return res.data;
    }
  });

  // ✅ Barcha commentlarni olish (agar kerak bo'lsa)
  const { data: allComments = [] } = useQuery({
    queryKey: ["comments", "all"],
    queryFn: async () => {
      const res = await apiClient.get<Comment[]>("/comments");
      return res.data;
    }
  });

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment: ReqComment) => {
      const res = await apiClient.post<Comment>("/comments", newComment);
      return res.data;
    },
    onSuccess: (newComment, variables) => {
      queryClient.setQueryData(
        ["comments", "post", variables.post_id],
        (oldComments: Comment[] = []) => [newComment, ...oldComments]
      );
      
      queryClient.setQueryData(
        ["comments", "all"],
        (oldComments: Comment[] = []) => [newComment, ...oldComments]
      );
    },
    onError: (error) => {
      console.error("Comment qo'shishda xato:", error);
    }
  });

  const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
    mutationFn: async (commentId: number) => {
      await apiClient.delete(`/comments/${commentId}`);
      return commentId;
    },
    onSuccess: (deletedCommentId) => {
      queryClient.setQueryData(
        ["comments", "all"],
        (oldComments: Comment[] = []) => 
          oldComments.filter(comment => comment.comment_id !== deletedCommentId)
      );
      
      const cachedData = queryClient.getQueryCache();
      const queries = cachedData.findAll();
      
      queries.forEach(({ queryKey }) => {
        if (queryKey[0] === "comments" && queryKey[1] === "post") {
          queryClient.setQueryData(
            queryKey,
            (oldComments: Comment[] = []) => 
              oldComments.filter(comment => comment.comment_id !== deletedCommentId)
          );
        }
      });
    },
    onError: (error) => {
      console.error("Comment o'chirishda xato:", error);
    }
  });

  const getCommentsByPostId = (post_id: number) => {
    queryClient.invalidateQueries({ 
      queryKey: ["comments", "post", post_id] 
    });
  };

  return { 
    comments: post_id ? comments : allComments,
    isLoading,
    error,
    refetch,
    addComment,
    isAddingComment,
    deleteComment,
    isDeletingComment,
    getCommentsByPostId 
  };
}

export default useComments;