import type { PlatformId } from "./availability-registry";

export type DetectedPlatform = PlatformId | "unknown";
export type StorePlatform = "ios" | "android" | "desktop";

export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/HarmonyOS/i.test(ua)) return "harmonyos";
  if (/visionOS|AppleVision|Vision Pro/i.test(ua)) return "visionos";
  if (/AppleTV/i.test(ua)) return "tvos";

  const iPadDesktopUA = platform === "MacIntel" && maxTouchPoints > 1;
  if (/iPad/i.test(ua) || iPadDesktopUA) return "ipados";
  if (/iPhone|iPod/i.test(ua)) return "ios";

  if (/Android/i.test(ua)) {
    if (/AFT|Fire TV/i.test(ua)) return "firetv";
    if (/Android TV|GoogleTV|SmartTV|BRAVIA/i.test(ua)) return "androidtv";
    if (/Wear OS|Android Wear/i.test(ua)) return "wearos";
    if (/Silk\//i.test(ua)) return "fireos";
    return "android";
  }

  if (/CrOS/i.test(ua)) return "chromeos";
  if (/Windows NT/i.test(ua)) return "windows";
  if (/Macintosh|MacIntel/i.test(ua) || /Mac/.test(platform)) return "macos";
  if (/Linux/i.test(ua)) return "linux";

  return "unknown";
}

export function detectStorePlatform(): StorePlatform {
  const detected = detectPlatform();
  if (detected === "ios" || detected === "ipados") return "ios";
  if (detected === "android" || detected === "wearos" || detected === "androidtv" || detected === "chromeos" || detected === "fireos" || detected === "firetv") return "android";
  return "desktop";
}
