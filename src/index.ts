export { Availability } from "./components/availability";
export type {
  AvailabilityGroupBy,
  AvailabilityMarkContext,
  AvailabilityMarkStrategy,
  AvailabilityMode,
  AvailabilityPresentation,
  AvailabilityProps,
  AvailabilityTarget,
  AvailabilityTheme,
} from "./components/availability";

export { NeutralDeviceMark, NeutralStoreMark } from "./components/availability-marks";
export type { NeutralDeviceMarkProps } from "./components/availability-marks";

export { StoreLinks } from "./components/store-links";
export type { StoreLinksPlatform, StoreLinksProps, StoreLinksTheme } from "./components/store-links";

export {
  distributionRegistry,
  getDeviceLabel,
  getDistributionDefinition,
  getEcosystemLabel,
  getPlatformDefinition,
  platformRegistry,
} from "./lib/availability-registry";
export type {
  DeviceFamily,
  DistributionDefinition,
  DistributionId,
  EcosystemId,
  KnownDistributionId,
  KnownPlatformId,
  PlatformDefinition,
  PlatformId,
} from "./lib/availability-registry";

export { detectPlatform, detectStorePlatform } from "./lib/platform";
export type { DetectedPlatform, StorePlatform } from "./lib/platform";
