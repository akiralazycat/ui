import type { DeviceFamily, DistributionId } from "../lib/availability-registry";

export type NeutralDeviceMarkProps = {
  device: DeviceFamily;
};

export type NeutralDistributionMarkProps = {
  distribution?: DistributionId;
};

function BrowserWindowMark() {
  return (
    <>
      <rect x="3.4" y="4.3" width="17.2" height="15.4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.4 8.2h17.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="6.2" cy="6.25" r=".65" fill="currentColor" />
      <circle cx="8.6" cy="6.25" r=".65" fill="currentColor" />
    </>
  );
}

export function NeutralDistributionMark({ distribution }: NeutralDistributionMarkProps) {
  const shape = (() => {
    if (distribution === "direct") {
      return (
        <path
          d="M12 4.2v10M8.5 11.2 12 14.7l3.5-3.5M5 18.5h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }

    if (distribution === "web") return <BrowserWindowMark />;

    return (
      <>
        <path d="M6.4 8.6h11.2l-.8 10H7.2l-.8-10Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9.2 8.6V7a2.8 2.8 0 0 1 5.6 0v1.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    );
  })();

  return <svg viewBox="0 0 24 24" role="presentation">{shape}</svg>;
}

export function NeutralDeviceMark({ device }: NeutralDeviceMarkProps) {
  const shape = (() => {
    switch (device) {
      case "watch":
        return (
          <>
            <rect x="7.2" y="6.1" width="9.6" height="11.8" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9.8 3.3h4.4l.7 2.8H9.1l.7-2.8Zm0 17.4h4.4l.7-2.8H9.1l.7 2.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </>
        );
      case "tv":
        return (
          <>
            <rect x="2.8" y="5.7" width="18.4" height="11.2" rx="1.9" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M7 20 8.3 16.9M17 20l-1.3-3.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        );
      case "desktop":
        return (
          <>
            <rect x="3.3" y="4.4" width="17.4" height="11.6" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8.4 20h7.2M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        );
      case "tablet":
        return <rect x="5.25" y="3.1" width="13.5" height="17.8" rx="2.1" fill="none" stroke="currentColor" strokeWidth="1.7" />;
      case "spatial":
        return <path d="M3.4 11.5c.6-2.9 2.3-4.5 5-4.5h7.2c2.7 0 4.4 1.6 5 4.5l-.5 2.4c-.4 1.9-1.7 3-3.7 3-1.8 0-2.8-.8-4.4-2.5-1.6 1.7-2.6 2.5-4.4 2.5-2 0-3.3-1.1-3.7-3l-.5-2.4Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />;
      case "car":
        return (
          <>
            <path d="M4.2 14.2 6.2 8h11.6l2 6.2v3.2H4.2v-3.2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M7 8l1.2-2h7.6L17 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="7.7" cy="18" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16.3" cy="18" r="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        );
      case "web":
        return <BrowserWindowMark />;
      case "phone":
      default:
        return <rect x="7" y="2.8" width="10" height="18.4" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />;
    }
  })();

  return <svg viewBox="0 0 24 24" role="presentation">{shape}</svg>;
}
