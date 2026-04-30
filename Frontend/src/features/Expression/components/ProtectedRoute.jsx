import { Navigate } from "react-router";
import useAuthStoreLogin from "../../auth/state/auth.storelogin";
import { motion } from "framer-motion";

const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useAuthStoreLogin();

  if (checkingAuth) {
    return (
      <div className="protected-spinner-container">
        <motion.div
          className="protected-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
