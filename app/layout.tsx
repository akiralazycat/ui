import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI — Small interface primitives for the web",
  description: "Open-source web interface primitives that adapt to theme, device, and context.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
