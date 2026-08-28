import { useEffect, useState, type ReactNode } from "react";
import { detectStorePlatform, type StorePlatform } from "../lib/platform";

export type StoreLinksTheme = "auto" | "light" | "dark";
export type StoreLinksPlatform = "auto" | "ios" | "android" | "all";

export type StoreLinksProps = {
  iosUrl?: string;
  androidUrl?: string;
  theme?: StoreLinksTheme;
  platform?: StoreLinksPlatform;
  initialPlatform?: StorePlatform;
  iosLabel?: string;
  androidLabel?: string;
  iosAriaLabel?: string;
  androidAriaLabel?: string;
  iosMark?: ReactNode;
  androidMark?: ReactNode;
  className?: string;
  onPlatformResolved?: (platform: StorePlatform) => void;
};

function NeutralPlatformMark({ platform }: { platform: "ios" | "android" }) {
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
  initialPlatform,
  iosLabel = "iOS",
  androidLabel = "Android",
  iosAriaLabel = "Open iOS app download page",
  androidAriaLabel = "Open Android app download page",
  iosMark,
  androidMark,
  className,
  onPlatformResolved,
}: StoreLinksProps) {
  const [resolvedPlatform, setResolvedPlatform] = useState<StorePlatform>(initialPlatform ?? "desktop");
  const [ready, setReady] = useState(platform !== "auto" || initialPlatform !== undefined);

  useEffect(() => {
    if (platform !== "auto") {
      setReady(true);
      return;
    }

    if (initialPlatform) {
      setResolvedPlatform(initialPlatform);
      setReady(true);
      return;
    }

    const detected = detectStorePlatform();
    setResolvedPlatform(detected);
    setReady(true);
  }, [initialPlatform, platform]);

  useEffect(() => {
    if (platform === "auto" && ready) onPlatformResolved?.(resolvedPlatform);
  }, [onPlatformResolved, platform, ready, resolvedPlatform]);

  const showIos = Boolean(iosUrl) && platform !== "android";
  const showAndroid = Boolean(androidUrl) && platform !== "ios";

  function priorityFor(destination: "ios" | "android") {
    if (platform !== "auto") return "primary";
    if (!ready || resolvedPlatform === "desktop") return "primary";
    return resolvedPlatform === destination ? "primary" : "secondary";
  }

  const classes = ["store-links", className].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-theme={theme}
      data-ready={ready ? "true" : "false"}
      data-resolved-platform={platform === "auto" ? resolvedPlatform : platform}
    >
      {showIos && iosUrl ? (
        <a
          className="store-link"
          data-platform="ios"
          data-priority={priorityFor("ios")}
          href={iosUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={iosAriaLabel}
        >
          {iosMark ?? <NeutralPlatformMark platform="ios" />}
          <span>{iosLabel}</span>
        </a>
      ) : null}

      {showAndroid && androidUrl ? (
        <a
          className="store-link"
          data-platform="android"
          data-priority={priorityFor("android")}
          href={androidUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={androidAriaLabel}
        >
          {androidMark ?? <NeutralPlatformMark platform="android" />}
          <span>{androidLabel}</span>
        </a>
      ) : null}
    </div>
  );
}
