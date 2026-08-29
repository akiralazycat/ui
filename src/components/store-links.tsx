import type { ReactNode } from "react";
import {
  Availability,
  type AvailabilityMarkStrategy,
  type AvailabilityMode,
  type AvailabilityPresentation,
  type AvailabilityTarget,
  type AvailabilityTheme,
} from "./availability";
import type { DetectedPlatform } from "../lib/platform";

export type StoreLinksTheme = AvailabilityTheme;
export type StoreLinksPlatform = "auto" | "ios" | "android" | "all";

export type StoreLinksProps = {
  iosUrl?: string;
  androidUrl?: string;
  theme?: StoreLinksTheme;
  platform?: StoreLinksPlatform;
  mode?: AvailabilityMode;
  presentation?: AvailabilityPresentation;
  markStrategy?: AvailabilityMarkStrategy;
  platformHint?: DetectedPlatform;
  iosLabel?: string;
  androidLabel?: string;
  iosAriaLabel?: string;
  androidAriaLabel?: string;
  iosMark?: ReactNode;
  androidMark?: ReactNode;
  appStoreMark?: ReactNode;
  googlePlayMark?: ReactNode;
  className?: string;
  openInNewTab?: boolean;
  onPlatformResolved?: (platform: DetectedPlatform) => void;
};

export function StoreLinks({
  iosUrl,
  androidUrl,
  theme = "auto",
  platform = "auto",
  mode = "adaptive",
  presentation = "platform",
  markStrategy,
  platformHint,
  iosLabel = "iOS",
  androidLabel = "Android",
  iosAriaLabel = "Open iOS app download page",
  androidAriaLabel = "Open Android app download page",
  iosMark,
  androidMark,
  appStoreMark,
  googlePlayMark,
  className,
  openInNewTab = false,
  onPlatformResolved,
}: StoreLinksProps) {
  const targets: AvailabilityTarget[] = [];

  if (iosUrl && platform !== "android") {
    targets.push({
      platform: "ios",
      distribution: "app-store",
      url: iosUrl,
      label: iosLabel,
      ariaLabel: iosAriaLabel,
      platformMark: iosMark,
      distributionMark: appStoreMark,
    });
  }

  if (androidUrl && platform !== "ios") {
    targets.push({
      platform: "android",
      distribution: "google-play",
      url: androidUrl,
      label: androidLabel,
      ariaLabel: androidAriaLabel,
      platformMark: androidMark,
      distributionMark: googlePlayMark,
    });
  }

  const effectiveMode = platform === "all" ? "all" : platform === "auto" ? mode : "all";
  const hasCustomMark = iosMark || androidMark || appStoreMark || googlePlayMark;
  const effectiveMarkStrategy = markStrategy ?? (hasCustomMark ? "custom" : "neutral");

  return (
    <Availability
      targets={targets}
      theme={theme}
      mode={effectiveMode}
      presentation={presentation}
      markStrategy={effectiveMarkStrategy}
      platformHint={platformHint}
      className={["store-links", className].filter(Boolean).join(" ")}
      openInNewTab={openInNewTab}
      onPlatformResolved={onPlatformResolved}
    />
  );
}
