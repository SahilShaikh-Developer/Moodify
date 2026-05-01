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
          toast.success(res.message);
          navigate("/", { replace: true });
        })
        .catch(() => {
          toast.error("Google login failed");
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#080810",
        color: "#f0eaf8",
      }}
    >
      <p>Signing in with Google...</p>
    </div>
  );
};

export default AuthCallback;
