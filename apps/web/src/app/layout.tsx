// apps/web/src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "ORDIQ AI",
  description: "Ship models, not worries.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-50 text-gray-900">
        {/* ─ Header ─────────────────────────────── */}
        <header className="h-14 flex items-center justify-between border-b bg-white px-4 shadow-sm">
          <span className="font-semibold tracking-tight">ORDIQ&nbsp;AI</span>
          <nav className="text-sm space-x-6">
            {/* filler nav – add links later */}
            <a className="opacity-70 hover:opacity-100" href="/app/wizard">
              Wizard
            </a>
          </nav>
        </header>

        {/* ─ Page content ───────────────────────── */}
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
