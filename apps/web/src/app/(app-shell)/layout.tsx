
import { AppShell } from '@/components/AppShell'
import { Database } from '@/types/supabase'

type Props = {
  children: React.ReactNode
}

export default function AppShellLayout({ children }: Props) {
  return <AppShell>{children}</AppShell>
}
