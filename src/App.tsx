import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import DebtorList from "./components/debtor/DebtorList";
import DebtorPage from "./components/debtor/DebtorPage";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/login/LoginPage";
import SignUp from "./pages/login/SingUp";

function App() {
  return (
    <div>
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/home/debtor" element={<DebtorList />} />
            <Route path="/home/debtor/:id" element={<DebtorPage />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;