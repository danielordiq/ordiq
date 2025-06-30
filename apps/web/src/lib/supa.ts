
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/** Shared browser-side Supabase client */
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/** Helper so callers can do `const db = createClient()` */
export const createClientBrowser = () => supabase
