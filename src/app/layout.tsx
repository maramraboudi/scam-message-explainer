import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scam Message Explainer",
  description: "Understand suspicious messages, investigate risk, and respond safely.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
