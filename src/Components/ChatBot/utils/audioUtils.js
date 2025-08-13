export function playBase64Audio(base64String) {
  const audio = new Audio(`data:audio/wav;base64,${base64String}`);
  audio.play().catch(err => console.error("Audio play error:", err));
}
