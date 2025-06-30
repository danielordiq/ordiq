
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { supabase } from '@/lib/supa'

interface Model {
  id: string
  name: string
  version: string
  risk: string
  created_at: string
}

const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "name",
    header: "Model Name",
  },
  {
    accessorKey: "version", 
    header: "Version",
  },
  {
    accessorKey: "risk",
    header: "Risk Level",
    cell: ({ row }) => {
      const risk = row.getValue("risk") as string
      return (
        <Badge 
          className={
            risk === "High" ? "bg-red-500 hover:bg-red-600" :
            risk === "Limited" ? "bg-yellow-500 hover:bg-yellow-600" :
            "bg-green-500 hover:bg-green-600"
          }
        >
          {risk}
        </Badge>
      )
    }
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return date.toLocaleDateString()
    }
  }
]

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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AI Models</h2>
        <DataTable columns={columns} data={models} />
      </div>
    </ErrorBoundary>
  )
}
