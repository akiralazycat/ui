"use client";

import { useEffect, useMemo, useState } from "react";
import { detectStorePlatform, type StorePlatform } from "@/lib/platform";

export type StoreLinksTheme = "auto" | "light" | "dark";
export type StoreLinksPlatform = "auto" | "ios" | "android" | "all";

export type StoreLinksProps = {
  iosUrl?: string;
  androidUrl?: string;
  theme?: StoreLinksTheme;
  platform?: StoreLinksPlatform;
  iosLabel?: string;
  androidLabel?: string;
  className?: string;
  onPlatformResolved?: (platform: StorePlatform) => void;
};

function PlatformMark({ platform }: { platform: "ios" | "android" }) {
  return (
    <span className="store-link__mark" aria-hidden="true">
      {platform === "ios" ? (
        <svg viewBox="0 0 24 24" role="presentation">
          <rect x="7" y="3" width="10" height="18" rx="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="17.6" r="0.9" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" role="presentation">
          <rect x="7" y="3" width="10" height="18" rx="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.2 17.8h1.2m1 0h1.2m1 0h1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

export function StoreLinks({
  iosUrl,
  androidUrl,
  theme = "auto",
  platform = "auto",
  iosLabel = "iOS",
  androidLabel = "Android",
  className,
  onPlatformResolved,
}: StoreLinksProps) {
  const [resolvedPlatform, setResolvedPlatform] = useState<StorePlatform>("desktop");
  const [ready, setReady] = useState(platform !== "auto");

  useEffect(() => {
    if (platform !== "auto") {
      setReady(true);
      return;
    }

    const detected = detectStorePlatform();
    setResolvedPlatform(detected);
    setReady(true);
    onPlatformResolved?.(detected);
  }, [platform, onPlatformResolved]);

  const visible = useMemo(() => {
    if (platform === "ios") return { ios: true, android: false };
    if (platform === "android") return { ios: false, android: true };
    if (platform === "all") return { ios: true, android: true };
    if (!ready) return { ios: true, android: true };

    if (resolvedPlatform === "ios") return { ios: true, android: false };
    if (resolvedPlatform === "android") return { ios: false, android: true };
    return { ios: true, android: true };
  }, [platform, ready, resolvedPlatform]);

  const classes = ["store-links", className].filter(Boolean).join(" ");

  return (
    <div className={classes} data-theme={theme} data-ready={ready ? "true" : "false"}>
      {visible.ios && iosUrl ? (
        <a className="store-link" href={iosUrl} target="_blank" rel="noreferrer" aria-label={`Open ${iosLabel} download page`}>
          <PlatformMark platform="ios" />
          <span>{iosLabel}</span>
        </a>
      ) : null}
      {visible.android && androidUrl ? (
        <a className="store-link" href={androidUrl} target="_blank" rel="noreferrer" aria-label={`Open ${androidLabel} download page`}>
          <PlatformMark platform="android" />
          <span>{androidLabel}</span>
        </a>
      ) : null}
    </div>
  );
}
