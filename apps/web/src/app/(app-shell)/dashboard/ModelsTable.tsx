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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI Models</h2>
            <p className="text-sm text-gray-500">{models.length} models found</p>
          </div>
          <DataTable columns={columns} data={models} />
        </div>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Error loading models:', error)
    return (
      <ErrorBoundary>
        <div className="text-center p-8">
          <p className="text-red-600">Failed to load models. Please try again later.</p>
        </div>
      </ErrorBoundary>
    )
  }
}

interface ModelsTableProps {
  search?: string;
}

export async function ModelsTable({ search }: ModelsTableProps) {
  try {
    const assessments = await getAssessments()
    
    // Filter assessments based on search term
    const filteredAssessments = search 
      ? assessments.filter(assessment => 
          assessment.matched_key?.toLowerCase().includes(search.toLowerCase()) ||
          assessment.tier?.toLowerCase().includes(search.toLowerCase()) ||
          assessment.user_id?.toLowerCase().includes(search.toLowerCase())
        )
      : assessments

    return (
      <ErrorBoundary>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">User ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Matched Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{assessment.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.tier === 'High' ? 'bg-red-100 text-red-800' :
                      assessment.tier === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      assessment.tier === 'Low' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assessment.tier || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assessment.user_id || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assessment.matched_key || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ErrorBoundary>
    )
  } catch (error) {
    return (
      <ErrorBoundary>
        <div className="p-4 text-red-600">
          Error loading assessments: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </ErrorBoundary>
    )
  }
}