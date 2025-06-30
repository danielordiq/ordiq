
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { supabase } from '@/lib/supa'
import { ModelsTableClient } from './ModelsTableClient'

interface Model {
  id: string
  name: string
  version: string
  risk: string
  created_at: string
}

async function getModels(): Promise<Model[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching models:', error)
      return []
    }

    return (data || []).map(assessment => ({
      id: assessment.id,
      name: assessment.matched_key || 'Unknown',
      version: '1.0',
      risk: assessment.tier || 'Unknown',
      created_at: assessment.created_at
    }))
  } catch (error) {
    console.error('Error in getModels:', error)
    return []
  }
}

export async function ModelsTable() {
  const models = await getModels()

  return (
    <ErrorBoundary>
      <ModelsTableClient models={models} />
    </ErrorBoundary>
  )
}
