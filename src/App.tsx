import { Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import MainLayout from "./layout/MainLayout"
import AuthLayout from "./layout/AuthLayout"
import Login from "./pages/login/Login"
import Register from "./pages/login/Register"
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from "./layout/AdminLayout"
import HelloAdmin from "./pages/admin/HelloAdmin"
import NotFound from './components/NotFound';
import IsLoading from "./components/IsLoading"
import useLoading from "./hooks/useLoading"
import { useEffect } from "react"
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const { loading } = useLoading();

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

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
            <Route index element={<HelloAdmin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App