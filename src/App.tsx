import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import MainLayout from "./layout/MainLayout"
import AuthLayout from "./layout/AuthLayout"
import Login from "./pages/login/Login"
import Register from "./pages/login/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./layout/AdminLayout"

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Route>
        
        <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >

          </Route>
      </Routes>
    </div>
  )
}

export default App