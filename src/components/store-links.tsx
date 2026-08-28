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
  initialPlatform?: DetectedPlatform;
  iosLabel?: string;
  androidLabel?: string;
  iosAriaLabel?: string;
  androidAriaLabel?: string;
  iosMark?: ReactNode;
  androidMark?: ReactNode;
  className?: string;
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
  const targets: AvailabilityTarget[] = [
    iosUrl && platform !== "android"
      ? {
          platform: "ios",
          distribution: "app-store",
          url: iosUrl,
          label: iosLabel,
          ariaLabel: iosAriaLabel,
          platformMark: iosMark,
          distributionMark: iosMark,
        }
      : null,
    androidUrl && platform !== "ios"
      ? {
          platform: "android",
          distribution: "google-play",
          url: androidUrl,
          label: androidLabel,
          ariaLabel: androidAriaLabel,
          platformMark: androidMark,
          distributionMark: androidMark,
        }
      : null,
  ].filter((target): target is AvailabilityTarget => target !== null);

  const effectiveMode = platform === "all" ? "all" : platform === "auto" ? mode : "all";
  const effectiveMarkStrategy = markStrategy ?? (iosMark || androidMark ? "custom" : "neutral");

  return (
    <Availability
      targets={targets}
      theme={theme}
      mode={effectiveMode}
      presentation={presentation}
      markStrategy={effectiveMarkStrategy}
      initialPlatform={initialPlatform}
      className={["store-links", className].filter(Boolean).join(" ")}
      onPlatformResolved={onPlatformResolved}
    />
  );
}
