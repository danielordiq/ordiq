// apps/web/src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');        // 👈 choose whichever in-shell route you prefer
}
