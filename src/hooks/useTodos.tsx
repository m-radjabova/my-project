import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient/apiClient";
import type { Todo, ReqTodo } from "../types/types";

function useTodos( userId?: number)  {
  const queryClient = useQueryClient();
  const queryKey = userId ? ["todos", userId] : ["todos"];

  const { data: todos = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (userId) {
        const res = await apiClient.get(`/todos/user/${userId}`);
        return res.data;
      }
      const res = await apiClient.get<Todo[]>(`/todos`);
      return res.data;
    }
  });

  const { mutate: addTodo } = useMutation({
    mutationFn: async (newTodo: ReqTodo) => {
      const res = await apiClient.post("/todos", newTodo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });


  const {mutate: deleteTodo} = useMutation({
    mutationFn: async (todoId: number) => {
      await apiClient.delete(`/todos/${todoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  })

  const {mutate: updateTodo} = useMutation({
    mutationFn: async (updatedTodo: Todo) => {
      const res = await apiClient.put<Todo>(`/posts/${updatedTodo.todo_id}`, updatedTodo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  })

  const {mutate: toggleTodoCompleted} = useMutation({
    mutationFn: async (todoId: number) => {
      const res = await apiClient.patch(`/todos/${todoId}/completed`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  })


  const getTodosByUserId = async (userId:number) => {
    const res = await apiClient.get<Todo[]>(`/todos/user/${userId}`);
    return res.data;
    }


  
  return { todos, addTodo, deleteTodo, updateTodo, toggleTodoCompleted, getTodosByUserId, isLoading };
}

export default useTodos;