import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Left rail */}
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
        <div className="p-4 font-bold">Guardrail AI</div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-slate-100">Dashboard</Link>
          <Link href="/registry"   className="block px-4 py-2 hover:bg-slate-100">Registry</Link>
          <Link href="/settings/billing" className="block px-4 py-2 hover:bg-slate-100">Billing</Link>
        </nav>
      </aside>

      {/* Main column */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <Bars3Icon className="h-6 w-6 text-slate-400" />
            <span className="text-sm font-medium text-slate-500">ACME Inc.</span>
          </div>
          {/* Placeholder user menu */}
          <div className="h-8 w-8 rounded-full bg-slate-300" />
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
