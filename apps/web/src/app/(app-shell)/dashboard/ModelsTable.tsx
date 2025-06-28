import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { RowSkeleton } from '@/components/RowSkeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Suspense } from 'react'

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

function getRiskColor(risk: string) {
  switch (risk) {
    case 'High':
      return 'text-red-500 bg-red-50'
    case 'Limited':
      return 'text-amber-500 bg-amber-50'
    case 'Minimal':
      return 'text-emerald-500 bg-emerald-50'
    default:
      return 'text-gray-500 bg-gray-50'
  }
}

async function ModelsTableContent() {
  const models = await getModels()

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          AI Models Registry
        </h3>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Assessment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model: any) => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {model.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      model.risk === 'High' ? 'bg-red-100 text-red-800' :
                      model.risk === 'Limited' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {model.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {model.last_run || 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function ModelsTable() {
  return (
    <Suspense fallback={<div>Loading models...</div>}>
      <ModelsTableContent />
    </Suspense>
  )
}