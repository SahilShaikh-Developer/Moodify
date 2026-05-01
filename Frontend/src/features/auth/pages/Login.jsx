import logo from "../../../assets/images/logo.png";
import { Eye, FingerprintPattern, KeyRound, Mail, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useLogin from "../hooks/useLogin";
import useAuthStoreLogin from "../state/auth.storelogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useLogin();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing in...");
    try {
      await login(form);
      toast.dismiss(toastId);
      toast.success("login successful");
      navigate("/", { replace: true });
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Login failed:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "email profile";
    const responseType = "token";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  return (
    <motion.div
      className="main-login"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <div className="left">
        <div className="wrapper">
          <img src={logo} alt="logo" />
          <p>Moodify</p>
        </div>
        <div className="para-wrapper">
          <p>
            Welcome back to <br /> <span>Moodify</span>
          </p>
        </div>
        <div className="text">
          <p>
            AI-powered music streaming that adapts to your vibe. Sign in to
            continue your journey.
          </p>
        </div>
        <div className="btn-wrapper">
          <button
            className={location.pathname === "/login" ? "active" : ""}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className={location.pathname === "/register" ? "active" : ""}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <Mail />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <KeyRound />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                onChange={handleChange}
              />
              <div
                className="eye"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>
            <div className="btn">
              <button type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
          <div className="with">
            <div className="line"></div>
            <p>OR CONTINUE WITH</p>
            <div className="line"></div>
          </div>
          <div className="google-btn">
            <button type="button" onClick={handleGoogleLogin}>
              <FingerprintPattern />
              Log in with Google
            </button>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="para">
          <p>
            AI Revolutionizing the way we{" "}
            <span className="italic">experience</span> music.
          </p>
          <span className="analy">
            Moodify analyzes your emotional state and environment context to
            create the perfect soundscape for your moment.
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
