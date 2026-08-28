import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getDeviceLabel,
  getDistributionDefinition,
  getEcosystemLabel,
  getPlatformDefinition,
  type DeviceFamily,
  type DistributionId,
  type EcosystemId,
  type PlatformId,
} from "../lib/availability-registry";
import { detectPlatform, type DetectedPlatform } from "../lib/platform";

export type AvailabilityTheme = "auto" | "light" | "dark";
export type AvailabilityMode = "adaptive" | "all" | "current" | "grouped";
export type AvailabilityPresentation = "platform" | "store";
export type AvailabilityGroupBy = "ecosystem" | "device" | "distribution";

export type AvailabilityTarget = {
  id?: string;
  platform: PlatformId;
  distribution: DistributionId;
  url: string;
  device?: DeviceFamily;
  regions?: readonly string[];
  label?: string;
  ariaLabel?: string;
  platformMark?: ReactNode;
  distributionMark?: ReactNode;
};

export type AvailabilityProps = {
  targets: readonly AvailabilityTarget[];
  theme?: AvailabilityTheme;
  mode?: AvailabilityMode;
  presentation?: AvailabilityPresentation;
  groupBy?: AvailabilityGroupBy;
  region?: string;
  initialPlatform?: DetectedPlatform;
  className?: string;
  openInNewTab?: boolean;
  onPlatformResolved?: (platform: DetectedPlatform) => void;
};

type ResolvedTarget = AvailabilityTarget & {
  key: string;
  device: DeviceFamily;
  platformLabel: string;
  distributionLabel: string;
  ecosystem: EcosystemId;
};

type AvailabilityRow = {
  key: string;
  targets: ResolvedTarget[];
  label: string;
  detail?: string;
  url: string;
  ariaLabel: string;
  mark?: ReactNode;
  device: DeviceFamily;
  ecosystem: EcosystemId;
  distribution: DistributionId;
};

function NeutralMark({ device, store }: { device: DeviceFamily; store?: boolean }) {
  if (store) {
    return (
      <span className="availability-link__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation">
          <path d="M6.5 8.5h11l-.7 10h-9.6l-.7-10Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9.2 8.5V7a2.8 2.8 0 0 1 5.6 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  const shape = (() => {
    switch (device) {
      case "watch":
        return <><rect x="7.7" y="6.6" width="8.6" height="10.8" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M10 3.5h4l.8 3.1H9.2L10 3.5Zm0 17h4l.8-3.1H9.2l.8 3.1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></>;
      case "tv":
        return <><rect x="3.5" y="5.5" width="17" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M9 20h6M12 16.5V20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></>;
      case "desktop":
        return <><rect x="3.5" y="4.5" width="17" height="11.5" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8.5 20h7M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></>;
      case "tablet":
        return <><rect x="5.5" y="2.8" width="13" height="18.4" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="18" r=".8" fill="currentColor" /></>;
      case "spatial":
        return <><path d="M3.5 12c.7-3.2 2.4-5 5.2-5h6.6c2.8 0 4.5 1.8 5.2 5-.5 3.1-2 4.8-4.4 4.8-1.9 0-2.9-.9-4.1-2.2-1.2 1.3-2.2 2.2-4.1 2.2-2.4 0-3.9-1.7-4.4-4.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></>;
      case "car":
        return <><path d="M5 14.5 6.5 9h11l1.5 5.5v3H5v-3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="8" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
      case "web":
        return <><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M3.8 12h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5C9.8 18.1 8.7 15.3 8.7 12S9.8 5.9 12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></>;
      case "phone":
      default:
        return <><rect x="7" y="2.8" width="10" height="18.4" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="18" r=".8" fill="currentColor" /></>;
    }
  })();

  return <span className="availability-link__mark" aria-hidden="true"><svg viewBox="0 0 24 24" role="presentation">{shape}</svg></span>;
}

function availableInRegion(target: AvailabilityTarget, region?: string) {
  if (!target.regions?.length || !region) return true;
  const normalized = region.toUpperCase();
  return target.regions.some((item) => item === "*" || item.toUpperCase() === normalized);
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function buildRows(targets: ResolvedTarget[], presentation: AvailabilityPresentation): AvailabilityRow[] {
  if (presentation === "platform") {
    return targets.map((target) => ({
      key: target.key,
      targets: [target],
      label: target.label ?? target.platformLabel,
      url: target.url,
      ariaLabel: target.ariaLabel ?? `Open ${target.platformLabel} download page`,
      mark: target.platformMark,
      device: target.device,
      ecosystem: target.ecosystem,
      distribution: target.distribution,
    }));
  }

  const groups = new Map<string, ResolvedTarget[]>();
  for (const target of targets) {
    const key = `${target.distribution}::${target.url}`;
    const group = groups.get(key) ?? [];
    group.push(target);
    groups.set(key, group);
  }

  return [...groups.entries()].map(([key, group]) => {
    const first = group[0];
    const platforms = unique(group.map((target) => target.platformLabel));
    return {
      key,
      targets: group,
      label: first.distributionLabel,
      detail: platforms.join(" · "),
      url: first.url,
      ariaLabel: first.ariaLabel ?? `Open ${first.distributionLabel} for ${platforms.join(", ")}`,
      mark: group.find((target) => target.distributionMark)?.distributionMark,
      device: first.device,
      ecosystem: getDistributionDefinition(first.distribution).ecosystem,
      distribution: first.distribution,
    };
  });
}

function groupLabel(row: AvailabilityRow, groupBy: AvailabilityGroupBy) {
  if (groupBy === "device") return getDeviceLabel(row.device);
  if (groupBy === "distribution") return getDistributionDefinition(row.distribution).label;
  return getEcosystemLabel(row.ecosystem);
}

export function Availability({
  targets,
  theme = "auto",
  mode = "adaptive",
  presentation = "platform",
  groupBy = "ecosystem",
  region,
  initialPlatform,
  className,
  openInNewTab = true,
  onPlatformResolved,
}: AvailabilityProps) {
  const [resolvedPlatform, setResolvedPlatform] = useState<DetectedPlatform>(initialPlatform ?? "unknown");
  const [ready, setReady] = useState(initialPlatform !== undefined);

  useEffect(() => {
    if (initialPlatform !== undefined) {
      setResolvedPlatform(initialPlatform);
      setReady(true);
      return;
    }

    const detected = detectPlatform();
    setResolvedPlatform(detected);
    setReady(true);
  }, [initialPlatform]);

  useEffect(() => {
    if (ready) onPlatformResolved?.(resolvedPlatform);
  }, [onPlatformResolved, ready, resolvedPlatform]);

  const resolvedTargets = useMemo<ResolvedTarget[]>(() => {
    return targets
      .filter((target) => Boolean(target.url) && availableInRegion(target, region))
      .map((target, index) => {
        const platform = getPlatformDefinition(target.platform);
        const distribution = getDistributionDefinition(target.distribution);
        return {
          ...target,
          key: target.id ?? `${target.platform}:${target.distribution}:${index}`,
          device: target.device ?? platform.devices[0] ?? "web",
          platformLabel: platform.label,
          distributionLabel: distribution.label,
          ecosystem: platform.ecosystem,
        };
      });
  }, [region, targets]);

  const rows = useMemo(() => buildRows(resolvedTargets, presentation), [presentation, resolvedTargets]);

  function rowMatchesResolved(row: AvailabilityRow) {
    if (resolvedPlatform === "unknown") return false;
    return row.targets.some((target) => target.platform === resolvedPlatform);
  }

  function rowState(row: AvailabilityRow): "primary" | "secondary" | "hidden" {
    if (mode === "all" || mode === "grouped") return "primary";
    if (!ready || resolvedPlatform === "unknown") return "primary";
    const matches = rowMatchesResolved(row);
    if (mode === "current") return matches ? "primary" : "hidden";
    return matches ? "primary" : "secondary";
  }

  const classes = ["availability", className].filter(Boolean).join(" ");

  function renderRow(row: AvailabilityRow) {
    const state = rowState(row);
    return (
      <a
        key={row.key}
        className="availability-link"
        data-priority={state}
        data-platforms={row.targets.map((target) => target.platform).join(" ")}
        data-distribution={row.distribution}
        href={row.url}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noreferrer" : undefined}
        aria-label={row.ariaLabel}
        aria-hidden={state === "hidden" ? true : undefined}
        tabIndex={state === "hidden" ? -1 : undefined}
      >
        {row.mark ?? <NeutralMark device={row.device} store={presentation === "store"} />}
        <span className="availability-link__copy">
          <span>{row.label}</span>
          {row.detail ? <small>{row.detail}</small> : null}
        </span>
      </a>
    );
  }

  if (!rows.length) return null;

  if (mode === "grouped") {
    const grouped = new Map<string, AvailabilityRow[]>();
    for (const row of rows) {
      const label = groupLabel(row, groupBy);
      const group = grouped.get(label) ?? [];
      group.push(row);
      grouped.set(label, group);
    }

    return (
      <div className={classes} data-theme={theme} data-mode={mode} data-presentation={presentation} data-ready={ready ? "true" : "false"} data-resolved-platform={resolvedPlatform}>
        {[...grouped.entries()].map(([label, group]) => (
          <section className="availability-group" key={label}>
            <h3>{label}</h3>
            <div className="availability-list">{group.map(renderRow)}</div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={classes} data-theme={theme} data-mode={mode} data-presentation={presentation} data-ready={ready ? "true" : "false"} data-resolved-platform={resolvedPlatform}>
      <div className="availability-list">{rows.map(renderRow)}</div>
    </div>
  );
}
