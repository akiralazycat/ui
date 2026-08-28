export type DeviceFamily = "phone" | "tablet" | "desktop" | "watch" | "tv" | "spatial" | "car" | "web";
export type EcosystemId = "apple" | "android" | "microsoft" | "linux" | "amazon" | "huawei" | "web" | "other";

export type KnownPlatformId =
  | "ios"
  | "ipados"
  | "macos"
  | "watchos"
  | "tvos"
  | "visionos"
  | "android"
  | "wearos"
  | "androidtv"
  | "chromeos"
  | "windows"
  | "linux"
  | "fireos"
  | "firetv"
  | "vegaos"
  | "harmonyos"
  | "web"
  | "pwa";

export type KnownDistributionId =
  | "app-store"
  | "google-play"
  | "microsoft-store"
  | "galaxy-store"
  | "appgallery"
  | "getapps"
  | "oppo-app-market"
  | "vivo-app-store"
  | "tencent-myapp"
  | "amazon-appstore"
  | "flathub"
  | "snap-store"
  | "f-droid"
  | "direct"
  | "web";

export type PlatformId = KnownPlatformId | (string & {});
export type DistributionId = KnownDistributionId | (string & {});

export type PlatformDefinition = {
  id: PlatformId;
  label: string;
  ecosystem: EcosystemId;
  devices: readonly DeviceFamily[];
  defaultDistribution?: DistributionId;
};

export type DistributionDefinition = {
  id: DistributionId;
  label: string;
  ecosystem: EcosystemId;
};

export const platformRegistry: Record<KnownPlatformId, PlatformDefinition> = {
  ios: { id: "ios", label: "iOS", ecosystem: "apple", devices: ["phone"], defaultDistribution: "app-store" },
  ipados: { id: "ipados", label: "iPadOS", ecosystem: "apple", devices: ["tablet"], defaultDistribution: "app-store" },
  macos: { id: "macos", label: "macOS", ecosystem: "apple", devices: ["desktop"], defaultDistribution: "app-store" },
  watchos: { id: "watchos", label: "watchOS", ecosystem: "apple", devices: ["watch"], defaultDistribution: "app-store" },
  tvos: { id: "tvos", label: "tvOS", ecosystem: "apple", devices: ["tv"], defaultDistribution: "app-store" },
  visionos: { id: "visionos", label: "visionOS", ecosystem: "apple", devices: ["spatial"], defaultDistribution: "app-store" },
  android: { id: "android", label: "Android", ecosystem: "android", devices: ["phone", "tablet"], defaultDistribution: "google-play" },
  wearos: { id: "wearos", label: "Wear OS", ecosystem: "android", devices: ["watch"], defaultDistribution: "google-play" },
  androidtv: { id: "androidtv", label: "Android TV", ecosystem: "android", devices: ["tv"], defaultDistribution: "google-play" },
  chromeos: { id: "chromeos", label: "ChromeOS", ecosystem: "android", devices: ["desktop"], defaultDistribution: "google-play" },
  windows: { id: "windows", label: "Windows", ecosystem: "microsoft", devices: ["desktop"], defaultDistribution: "microsoft-store" },
  linux: { id: "linux", label: "Linux", ecosystem: "linux", devices: ["desktop"], defaultDistribution: "flathub" },
  fireos: { id: "fireos", label: "Fire OS", ecosystem: "amazon", devices: ["tablet"], defaultDistribution: "amazon-appstore" },
  firetv: { id: "firetv", label: "Fire TV", ecosystem: "amazon", devices: ["tv"], defaultDistribution: "amazon-appstore" },
  vegaos: { id: "vegaos", label: "Vega OS", ecosystem: "amazon", devices: ["tv"], defaultDistribution: "amazon-appstore" },
  harmonyos: { id: "harmonyos", label: "HarmonyOS", ecosystem: "huawei", devices: ["phone", "tablet", "watch", "tv"], defaultDistribution: "appgallery" },
  web: { id: "web", label: "Web", ecosystem: "web", devices: ["web"], defaultDistribution: "web" },
  pwa: { id: "pwa", label: "PWA", ecosystem: "web", devices: ["web"], defaultDistribution: "web" },
};

export const distributionRegistry: Record<KnownDistributionId, DistributionDefinition> = {
  "app-store": { id: "app-store", label: "App Store", ecosystem: "apple" },
  "google-play": { id: "google-play", label: "Google Play", ecosystem: "android" },
  "microsoft-store": { id: "microsoft-store", label: "Microsoft Store", ecosystem: "microsoft" },
  "galaxy-store": { id: "galaxy-store", label: "Galaxy Store", ecosystem: "android" },
  appgallery: { id: "appgallery", label: "AppGallery", ecosystem: "huawei" },
  getapps: { id: "getapps", label: "GetApps", ecosystem: "android" },
  "oppo-app-market": { id: "oppo-app-market", label: "OPPO App Market", ecosystem: "android" },
  "vivo-app-store": { id: "vivo-app-store", label: "vivo App Store", ecosystem: "android" },
  "tencent-myapp": { id: "tencent-myapp", label: "Tencent MyApp", ecosystem: "android" },
  "amazon-appstore": { id: "amazon-appstore", label: "Amazon Appstore", ecosystem: "amazon" },
  flathub: { id: "flathub", label: "Flathub", ecosystem: "linux" },
  "snap-store": { id: "snap-store", label: "Snap Store", ecosystem: "linux" },
  "f-droid": { id: "f-droid", label: "F-Droid", ecosystem: "android" },
  direct: { id: "direct", label: "Direct download", ecosystem: "other" },
  web: { id: "web", label: "Web", ecosystem: "web" },
};

const ecosystemLabels: Record<EcosystemId, string> = {
  apple: "Apple",
  android: "Android",
  microsoft: "Microsoft",
  linux: "Linux",
  amazon: "Amazon",
  huawei: "Huawei",
  web: "Web",
  other: "Other",
};

const deviceLabels: Record<DeviceFamily, string> = {
  phone: "Phone",
  tablet: "Tablet",
  desktop: "Desktop",
  watch: "Watch",
  tv: "TV",
  spatial: "Spatial",
  car: "Car",
  web: "Web",
};

function titleFromId(id: string) {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPlatformDefinition(id: PlatformId): PlatformDefinition {
  const known = platformRegistry[id as KnownPlatformId];
  if (known) return known;
  return { id, label: titleFromId(id), ecosystem: "other", devices: ["web"] };
}

export function getDistributionDefinition(id: DistributionId): DistributionDefinition {
  const known = distributionRegistry[id as KnownDistributionId];
  if (known) return known;
  return { id, label: titleFromId(id), ecosystem: "other" };
}

export function getEcosystemLabel(id: EcosystemId) {
  return ecosystemLabels[id];
}

export function getDeviceLabel(id: DeviceFamily) {
  return deviceLabels[id];
}
