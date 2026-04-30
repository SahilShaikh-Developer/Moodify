import { useRef } from "react";
import useFaceExpression from "../hooks/useFaceExpression";
import logo from "../../../assets/images/logo.png";
import { Camera, LogOut, MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useLogout from "../../auth/hooks/useLogout";
import MusicPlayer from "./MusicPlayer";
import Playlists from "./Playlists";
import { useSongStore } from "../store/song.store";

export default function FaceExpression() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  /**Logout function */
  async function handleLogout() {
    const res = await logout();

    if (res.success) {
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } else {
      toast.error(res.message || "Logout failed");
    }
  }

  // For theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const videoRef = useRef(null);
  const { capturedMood, setCapturedMood } = useSongStore();
  const { emotion, emotionLabel, startDetection, stopDetection, isDetecting } =
    useFaceExpression(videoRef);

  /**Local Storage */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  return (
    <div className="outer-wrapper">
      <nav>
        <div className="logo-wrapper">
          <img src={logo} alt="logo" />
          <p>Moodify</p>
        </div>
        <div className="right">
          <div className="btn-wrapper">
            <button
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
            >
              <Sun />
            </button>
            <button
              className={theme === "dark" ? "active" : ""}
              onClick={() => setTheme("dark")}
            >
              <MoonStar />
            </button>
          </div>
          <div className="logout-wrapper" onClick={handleLogout}>
            <LogOut className="logout" />
          </div>
        </div>
      </nav>
      <div className="content-wrapper">
        <div className="face-wrapper">
          <div className="frame">
            <div className={`camera-box ${isDetecting ? 'active-camera' : ''}`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                width={700} 
                style={{ display: isDetecting ? 'block' : 'none' }}
              />
              
              {!isDetecting && (
                <div className="camera-placeholder">
                  <div className="camera-icon-wrapper">
                    <div className="pulse-ring"></div>
                    <Camera className="camera-icon" size={64} />
                  </div>
                  <p className="placeholder-text">Click 'Detect Expression' to start camera</p>
                </div>
              )}
              
              {isDetecting && (
                <>
                  <div className="scan-line"></div>
                  <div className="live-badge">
                    <div className="dot"></div>
                    <span>LIVE</span>
                  </div>
                </>
              )}
              <div className="camera-overlay"></div>
            </div>
            <div className="emotion-box">
              <h2>
                <span className="emoji">
                  {{
                    Happy: "😄",
                    Sad: "😢",
                    Angry: "😠",
                    Surprise: "😲",
                    Idle: "😐",
                    "No Face": "👤",
                    Stopped: "⏹️",
                  }[emotionLabel] || "😐"}
                </span>{" "}
                {emotionLabel || "Waiting"}
              </h2>
            </div>
            <p>Current emotion tracked</p>

            <div className="buttons">
              {!isDetecting ? (
                <button className="detect-btn" onClick={startDetection}>
                  Detect Expression
                </button>
              ) : (
                <button className="stop-btn" onClick={stopDetection}>
                  Stop Detection
                </button>
              )}
              <button
                className="capture"
                disabled={!emotionLabel || emotionLabel === "Idle"}
                onClick={() => {
                  stopDetection();
                  setCapturedMood(emotionLabel);
                }}
              >
                Capture Mood
              </button>
            </div>
          </div>
        </div>

        <Playlists />
      </div>

      <MusicPlayer mood={capturedMood} shouldPlay={!!capturedMood} />
    </div>
  );
}
