
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  return (
    <div className="grid h-screen place-items-center">
      <button
        onClick={signIn}
        className="rounded bg-black px-6 py-3 text-white hover:bg-slate-800"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
