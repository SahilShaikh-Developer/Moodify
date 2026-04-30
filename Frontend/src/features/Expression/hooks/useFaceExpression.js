import { useEffect, useRef, useState } from "react";
import { createFaceLandmarker } from "../mediapipe/faceLandmarker";
import { detectEmotion } from "../mediapipe/emotionEngine";
import { smoothEmotion } from "../mediapipe/smoothing";
import { detectHeadPose } from "../mediapipe/headPose";

export default function useFaceExpression(videoRef) {
  const FPS = 15;
  const FRAME_INTERVAL = 1000 / FPS;

  const lastFrameTimeRef = useRef(0);
  const emotionRef = useRef("");

  const frameRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const detectingRef = useRef(false);

  const [emotion, setEmotion] = useState("Idle");
  const [isDetecting, setIsDetecting] = useState(false);
  const [emotionLabel, setEmotionLabel] = useState("Idle");
  const [liveEmotion, setLiveEmotion] = useState("Idle");

  /* UPDATE EMOTION */
  function updateEmotion(displayValue, labelValue) {
    if (emotionRef.current !== displayValue) {
      emotionRef.current = displayValue;
      setEmotion(displayValue);
      setEmotionLabel(labelValue);
    }
  }

  /* PROCESS FRAME */
  function processFrame(results) {
    if (!results.faceBlendshapes?.length) {
      updateEmotion("No Face", "Idle");
      return;
    }

    const blendshapes = results.faceBlendshapes[0].categories;

    const { emotion, emoji } = detectEmotion(blendshapes);

    const stableEmotion = smoothEmotion(emotion);

    const pose = detectHeadPose(results);
    updateEmotion(stableEmotion, stableEmotion);

    const displayText = `${emoji} ${stableEmotion} | ${pose}`;
    setLiveEmotion(displayText);
  }

  /* DETECTION LOOP */
  function detect(time) {
    if (!detectingRef.current) return;

    if (
      !videoRef.current ||
      !landmarkerRef.current ||
      videoRef.current.readyState < 2
    ) {
      frameRef.current = requestAnimationFrame(detect);
      return;
    }

    if (time - lastFrameTimeRef.current < FRAME_INTERVAL) {
      frameRef.current = requestAnimationFrame(detect);
      return;
    }

    lastFrameTimeRef.current = time;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      time,
    );

    processFrame(results);

    frameRef.current = requestAnimationFrame(detect);
  }

  /* START DETECTION */
  async function startDetection() {
    if (detectingRef.current) return;

    detectingRef.current = true;
    setIsDetecting(true);
    setEmotion("Starting...");

    if (!landmarkerRef.current) {
      landmarkerRef.current = await createFaceLandmarker();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    if (!videoRef.current) return;

    videoRef.current.srcObject = streamRef.current;

    await videoRef.current.play();

    frameRef.current = requestAnimationFrame(detect);
  }

  /* STOP DETECTION */
  function stopDetection() {
    detectingRef.current = false;
    setIsDetecting(false);

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (videoRef.current) videoRef.current.srcObject = null;

    setEmotion("Stopped");
  }

  /* CLEANUP */
  useEffect(() => {
    return () => {
      stopDetection();
      landmarkerRef.current?.close();
    };
  }, []);

  return {
    emotion: liveEmotion,
    emotionLabel,
    startDetection,
    stopDetection,
    isDetecting,
  };
}
