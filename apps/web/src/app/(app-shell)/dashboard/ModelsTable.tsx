import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/ui/columns'

type Model = {
  id: string
  name: string
  version: string
  risk: "High" | "Limited" | "Minimal"
  last_run: string
}

async function getModels(): Promise<Model[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return [];
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('assessments')
    .select('id, created_at, tier, user_id, matched_key')
    .order('created_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Transform assessment data to model format
  return (data || []).map((assessment, index) => ({
    id: assessment.id.toString(),
    name: `Model ${index + 1}`,
    version: '1.0.0',
    risk: (assessment.tier === 'High' ? 'High' : 
           assessment.tier === 'Limited' ? 'Limited' : 'Minimal') as "High" | "Limited" | "Minimal",
    last_run: assessment.created_at || new Date().toISOString()
  }))
}

export async function ModelsTable() {
  try {
    const models = await getModels()

    return (
      <ErrorBoundary>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Models</h2>
          <DataTable columns={columns} data={models} />
        </div>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error in ModelsTable:', error)
    return (
      <div className="text-red-500">
        Error loading models: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    )
  }
}