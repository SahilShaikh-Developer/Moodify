import logo from "../../../assets/images/logo.png";
import { Eye, FingerprintPattern, KeyRound, Mail, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import useLogin from "../hooks/useLogin";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuthAPI } from "../api/auth.api";
import useAuthStoreLogin from "../state/auth.storelogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useLogin();
  const checkAuth = useAuthStoreLogin((state) => state.checkAuth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const toastId = toast.loading("Signing in...");

    const res = await login(form);
    toast.dismiss(toastId);
    if (res.success) {
      toast.success("login successful");
      await checkAuth();
      navigate("/faceExpression");
    } else {
      toast.error(res.message);
    }
  }

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        const res = await googleAuthAPI(codeResponse.code);

        toast.success(res.message);
        navigate("/faceExpression");
      } catch (error) {
        toast.error(error.response?.data?.message || "Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
  });
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
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => navigate("/")}
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
            <button type="button" onClick={() => googleLogin()}>
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
