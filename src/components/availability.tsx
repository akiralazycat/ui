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
import { NeutralDeviceMark, NeutralStoreMark } from "./availability-marks";

export type AvailabilityTheme = "auto" | "light" | "dark";
export type AvailabilityMode = "adaptive" | "all" | "current" | "grouped";
export type AvailabilityPresentation = "platform" | "store";
export type AvailabilityGroupBy = "ecosystem" | "device" | "distribution";
export type AvailabilityMarkStrategy = "neutral" | "custom" | "none";

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

export type AvailabilityMarkContext = {
  presentation: AvailabilityPresentation;
  device: DeviceFamily;
  ecosystem: EcosystemId;
  distribution: DistributionId;
  platforms: readonly PlatformId[];
  targets: readonly AvailabilityTarget[];
};

export type AvailabilityProps = {
  targets: readonly AvailabilityTarget[];
  theme?: AvailabilityTheme;
  mode?: AvailabilityMode;
  presentation?: AvailabilityPresentation;
  groupBy?: AvailabilityGroupBy;
  markStrategy?: AvailabilityMarkStrategy;
  renderMark?: (context: AvailabilityMarkContext) => ReactNode;
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
  customMark?: ReactNode;
  device: DeviceFamily;
  ecosystem: EcosystemId;
  distribution: DistributionId;
};

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
      customMark: target.platformMark,
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
      customMark: group.find((target) => target.distributionMark)?.distributionMark,
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

function fallbackMark(row: AvailabilityRow, presentation: AvailabilityPresentation) {
  return presentation === "store" ? <NeutralStoreMark /> : <NeutralDeviceMark device={row.device} />;
}

export function Availability({
  targets,
  theme = "auto",
  mode = "adaptive",
  presentation = "platform",
  groupBy = "ecosystem",
  markStrategy = "neutral",
  renderMark,
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

  function rowMark(row: AvailabilityRow) {
    if (markStrategy === "none") return null;
    if (markStrategy === "neutral") return fallbackMark(row, presentation);

    const rendered = row.customMark ?? renderMark?.({
      presentation,
      device: row.device,
      ecosystem: row.ecosystem,
      distribution: row.distribution,
      platforms: row.targets.map((target) => target.platform),
      targets: row.targets,
    });

    return rendered ?? fallbackMark(row, presentation);
  }

  const classes = ["availability", className].filter(Boolean).join(" ");

  function renderRow(row: AvailabilityRow) {
    const state = rowState(row);
    const mark = rowMark(row);
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
        {mark ? <span className="availability-link__mark" aria-hidden="true">{mark}</span> : null}
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
      <div className={classes} data-theme={theme} data-mode={mode} data-presentation={presentation} data-mark-strategy={markStrategy} data-ready={ready ? "true" : "false"} data-resolved-platform={resolvedPlatform}>
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
    <div className={classes} data-theme={theme} data-mode={mode} data-presentation={presentation} data-mark-strategy={markStrategy} data-ready={ready ? "true" : "false"} data-resolved-platform={resolvedPlatform}>
      <div className="availability-list">{rows.map(renderRow)}</div>
    </div>
  );
}
