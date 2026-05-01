import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AnimatePresence } from "framer-motion";

import FaceExpression from "./features/Expression/components/FaceExpression";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/Expression/components/ProtectedRoute";
import useAuthStoreLogin from "./features/auth/state/auth.storelogin";
import { googleAuthAPI } from "./features/auth/api/auth.api";
import { useEffect } from "react";

// Animated Routes Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FaceExpression />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const checkAuth = useAuthStoreLogin((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      if (access_token) {
        googleAuthAPI(access_token)
          .then((res) => {
            window.location.replace("/");
          })
          .catch((err) => {
            console.error("Google auth failed:", err);
          });
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
};

export default AppRoutes;
