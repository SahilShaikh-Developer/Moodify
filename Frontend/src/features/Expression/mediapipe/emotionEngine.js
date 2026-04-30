export function detectEmotion(blendshapes) {
  const get = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const emotions = {
    Happy:
      get("mouthSmileLeft") * 2 +
      get("mouthSmileRight") * 2 +
      get("cheekSquintLeft") +
      get("cheekSquintRight"),

    Sad:
      get("mouthFrownLeft") * 2 +
      get("mouthFrownRight") * 2 +
      get("browInnerUp") * 0.5 +
      get("eyeSquintLeft") +
      get("eyeSquintRight"),

    Angry:
      get("browDownLeft") * 2 +
      get("browDownRight") * 2 +
      get("mouthPressLeft") +
      get("mouthPressRight") +
      get("noseSneerLeft") +
      get("noseSneerRight") +
      get("jawForward"),

    Surprise:
      get("jawOpen") * 1.5 +
      get("eyeWideLeft") * 2 +
      get("eyeWideRight") * 2 +
      get("browInnerUp"),

    Talking: get("jawOpen"),

    Blink: get("eyeBlinkLeft") * 2 + get("eyeBlinkRight") * 2,
  };

  const [emotion] = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0];

  // ✅ Emoji Mapping
  const emojiMap = {
    Happy: "😄",
    Sad: "😢",
    Angry: "😠",
    Surprise: "😲",
    Talking: "🗣️",
    Blink: "😉",
  };

  return { emotion, emoji: emojiMap[emotion] || "😐" };
}
