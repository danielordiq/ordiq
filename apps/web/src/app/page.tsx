/* apps/web/src/app/page.tsx
   – public landing page – */

'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Landing() {
  const supabase = createClientComponentClient()
  const signIn   = () => supabase.auth.signInWithOAuth({ provider: 'github' })

  return (
    <div className="grid h-screen place-items-center">
      <button
        onClick={signIn}
        className="rounded bg-black px-6 py-3 text-white hover:bg-slate-800"
      >
        Sign in with GitHub
      </button>
    </div>
  )
}
