import type { ReactNode } from "react";
import {
  Availability,
  type AvailabilityMode,
  type AvailabilityPresentation,
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
  const targets = [
    iosUrl && platform !== "android"
      ? {
          platform: "ios" as const,
          distribution: "app-store" as const,
          url: iosUrl,
          label: iosLabel,
          ariaLabel: iosAriaLabel,
          platformMark: iosMark,
          distributionMark: iosMark,
        }
      : null,
    androidUrl && platform !== "ios"
      ? {
          platform: "android" as const,
          distribution: "google-play" as const,
          url: androidUrl,
          label: androidLabel,
          ariaLabel: androidAriaLabel,
          platformMark: androidMark,
          distributionMark: androidMark,
        }
      : null,
  ].filter(Boolean) as NonNullable<Parameters<typeof Availability>[0]["targets"]>[number][];

  const effectiveMode = platform === "all" ? "all" : platform === "auto" ? mode : "all";

  return (
    <Availability
      targets={targets}
      theme={theme}
      mode={effectiveMode}
      presentation={presentation}
      initialPlatform={initialPlatform}
      className={["store-links", className].filter(Boolean).join(" ")}
      onPlatformResolved={onPlatformResolved}
    />
  );
}
