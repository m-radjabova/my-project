import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { Post, ReqPost } from "../types/types";

function usePosts() {
  const queryClient = useQueryClient();
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await apiClient.get<Post[]>("/posts");
      return res.data;
    },
  });

  const { mutate: addPost } = useMutation({
    mutationFn: async (newPost: ReqPost) => {
      const res = await apiClient.post("/posts", newPost);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });


  const {mutate: deletePost} = useMutation({
    mutationFn: async (postId: number) => {
      await apiClient.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  })

  const {mutate: updatePost} = useMutation({
    mutationFn: async (updatedPost: Post) => {
      const res = await apiClient.put<Post>(`/posts/${updatedPost.id}`, updatedPost);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  })

  
  return { posts, addPost, deletePost, updatePost };
}

export default usePosts;
