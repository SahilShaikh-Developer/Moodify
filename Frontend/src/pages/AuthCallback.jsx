import { useEffect } from "react";
import { useNavigate } from "react-router";
import { googleAuthAPI } from "../features/auth/api/auth.api";
import { toast } from "react-toastify";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");

    if (access_token) {
      googleAuthAPI(access_token)
        .then((res) => {
          toast.success(res.message || "Google login successful");
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Google auth failed:", err);
          toast.error("Google login failed");
          navigate("/login", { replace: true });
        });
    } else {
      console.error("No access_token found in URL");
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      background: "#080810",
      color: "#f0eaf8",
      gap: "1rem"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid rgba(139, 92, 246, 0.3)",
        borderTop: "3px solid #8b5cf6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <p>Signing in with Google...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthCallback;
