export function detectHeadPose(results) {
  if (!results.faceLandmarks?.length)
    return "No Face";

  const face = results.faceLandmarks[0];

  // Key stable landmarks
  const nose = face[1];      // Nose tip
  const leftEye = face[33];
  const rightEye = face[263];

  // Face center
  const centerX = (leftEye.x + rightEye.x) / 2;

  const diff = nose.x - centerX;

  // Smaller realistic threshold
  if (diff > 0.015) return "Looking Right";
  if (diff < -0.015) return "Looking Left";

  return "Center";
}