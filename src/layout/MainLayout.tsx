import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {!isHomePage && <Header />}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isHomePage && (
        <footer className="mt-auto">
          <Footer />
        </footer>
      )}
    </div>
  );
}
