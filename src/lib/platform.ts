export type StorePlatform = "ios" | "android" | "desktop";

export function detectStorePlatform(): StorePlatform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return "android";

  const classicIOS = /iPhone|iPad|iPod/i.test(ua);
  const iPadDesktopUA = platform === "MacIntel" && maxTouchPoints > 1;
  if (classicIOS || iPadDesktopUA) return "ios";

  return "desktop";
}
