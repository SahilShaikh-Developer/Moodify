import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import FaceExpression from "./features/Expression/components/FaceExpression";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./features/Expression/components/ProtectedRoute";
import useAuthStoreLogin from "./features/auth/state/auth.storelogin";

// Animated Routes Wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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



  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </BrowserRouter>
  );
};

export default AppRoutes;
