import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { RowSkeleton } from '@/components/RowSkeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getRiskColorClass } from '@/lib/risk-color'

type Model = {
  id: string
  name: string
  version: string
  risk: 'High' | 'Limited' | 'Minimal'
  last_run: string | null
}

async function getModels(): Promise<Model[]> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('models')
    .select('id, name, version, risk, last_run')
    .order('last_run', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return data || []
}

export async function ModelsTable() {
  try {
    const models = await getModels()

    return (
      <ErrorBoundary>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Model</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Version</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Risk Level</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Last Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{model.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{model.version}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColorClass(model.risk)}`}>
                      {model.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {model.last_run ? new Date(model.last_run).toLocaleDateString() : 'Never'}
                  </td>
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
        <RowSkeleton />
      </ErrorBoundary>
    )
  }
}