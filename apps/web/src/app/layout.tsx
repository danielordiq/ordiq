// apps/web/src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "ORDIQ AI",
  description: "Ship models, not worries.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col bg-gray-50 text-gray-900">
        {/* ─ Header ─────────────────────────────── */}
        <header className="h-14 flex items-center justify-between border-b bg-white px-4 shadow-sm">
          <span className="font-semibold tracking-tight">ORDIQ&nbsp;AI</span>

          {/* -- primary navigation -- */}
          <nav className="space-x-6 text-sm">
            <Link className="opacity-70 hover:opacity-100" href="/wizard">
              Run
            </Link>
            <Link className="opacity-70 hover:opacity-100" href="/registry">
              Registry
            </Link>
          </nav>
        </header>

        {/* ─ Page content ───────────────────────── */}
        <main className="container mx-auto flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
