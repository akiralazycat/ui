import type { DeviceFamily } from "../lib/availability-registry";

export type NeutralDeviceMarkProps = {
  device: DeviceFamily;
};

export function NeutralDistributionMark() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M6.5 8.5h11l-.7 10h-9.6l-.7-10Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.2 8.5V7a2.8 2.8 0 0 1 5.6 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function NeutralDeviceMark({ device }: NeutralDeviceMarkProps) {
  const shape = (() => {
    switch (device) {
      case "watch":
        return (
          <>
            <rect x="7.7" y="6.6" width="8.6" height="10.8" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M10 3.5h4l.8 3.1H9.2L10 3.5Zm0 17h4l.8-3.1H9.2l.8 3.1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          </>
        );
      case "tv":
        return (
          <>
            <rect x="3.5" y="5.5" width="17" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M9 20h6M12 16.5V20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        );
      case "desktop":
        return (
          <>
            <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8.5 20h7M12 16v4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </>
        );
      case "tablet":
        return (
          <>
            <rect x="5.5" y="2.8" width="13" height="18.4" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="18" r=".8" fill="currentColor" />
          </>
        );
      case "spatial":
        return <path d="M3.5 12c.7-3.2 2.4-5 5.2-5h6.6c2.8 0 4.5 1.8 5.2 5-.5 3.1-2 4.8-4.4 4.8-1.9 0-2.9-.9-4.1-2.2-1.2 1.3-2.2 2.2-4.1 2.2-2.4 0-3.9-1.7-4.4-4.8Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />;
      case "car":
        return (
          <>
            <path d="M5 14.5 6.5 9h11l1.5 5.5v3H5v-3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <circle cx="8" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="18" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        );
      case "web":
        return (
          <>
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M3.8 12h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5C9.8 18.1 8.7 15.3 8.7 12S9.8 5.9 12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </>
        );
      case "phone":
      default:
        return (
          <>
            <rect x="7" y="2.8" width="10" height="18.4" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="18" r=".8" fill="currentColor" />
          </>
        );
    }
  })();

  return <svg viewBox="0 0 24 24" role="presentation">{shape}</svg>;
}
