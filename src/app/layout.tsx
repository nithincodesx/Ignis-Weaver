import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GUILD — Multi-Agent Management Platform",
  description: "Enterprise-grade multi-agent orchestration and management dashboard for autonomous AI workflows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="dark-ambient" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
