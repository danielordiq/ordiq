
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { RowSkeleton } from '@/components/RowSkeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'

type Assessment = {
  id: number
  created_at: string
  request: any
  tier?: string
  user_id?: string
  matched_key?: string
}

export async function ModelsTable() {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return (
      <ErrorBoundary>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Recent Assessments
            </h3>
            {!assessments || assessments.length === 0 ? (
              <p className="text-gray-500">No assessments found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Tier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matched Key
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {assessment.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            assessment.tier === 'High' ? 'bg-red-100 text-red-800' :

type Assessment = {
  id: number
  created_at: string | null
  tier: string | null
  user_id: string | null
  matched_key: string | null
}

async function getAssessments(): Promise<Assessment[]> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('assessments')
    .select('id, created_at, tier, user_id, matched_key')
    .order('created_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return data || []
}

export async function ModelsTable() {
  try {
    const assessments = await getAssessments()

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
              {assessments.map((assessment) => (
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
