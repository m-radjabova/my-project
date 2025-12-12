import { Route, Routes } from "react-router-dom"

import MainLayout from "./layout/MainLayout"
import UserListForSql from "./components/usersForSql/UserListForSql"
import PostList from "./components/posts/PostsList"
import CommentList from "./components/comments/CommentList"
import TodoList from "./components/todos/TodoList"

function App() {

  return (
    <div>
      <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<UserListForSql />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id/comments" element={<CommentList />} />
            <Route path="/todos/:id" element={<TodoList />} />
          </Route>
      </Routes>
    </div>
  )
}

export default App