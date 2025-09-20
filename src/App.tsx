import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import MainLayout from "./layout/MainLayout"
import AuthLayout from "./layout/AuthLayout"
import Login from "./pages/login/Login"
import Register from "./pages/login/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./layout/AdminLayout"
import useLoading from "./hooks/useLoading"
import IsLoading from "./components/IsLoading"
import NotFound from "./components/NotFound"

function App() {
  const { loading } = useLoading();

  if (loading) {
    return <IsLoading />;
  }

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
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App