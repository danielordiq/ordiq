import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supa = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
)

export async function GET(req: Request) {
  const url = new URL(req.url)
  const afterId = url.searchParams.get('before')
  if (!afterId) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  const session = cookies().get('sb-access-token')?.value ?? null
  if (!session) return NextResponse.json({ data: null })

  const { data } = await supa
    .from('assessments')
    .select('*')
    .eq('user_id', session)
    .lt('id', afterId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ data })
}
