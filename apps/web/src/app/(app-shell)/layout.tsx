import { AppShell } from '@/components/AppShell'
import { Database } from '@/types/supabase'

type Props = {
  children: React.ReactNode
}

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>
      {children}
    </AppShell>
  )
}