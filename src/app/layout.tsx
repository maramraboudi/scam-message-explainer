import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalProof",
  description: "Triage suspicious messages, preserve evidence, and verify sender claims safely.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
