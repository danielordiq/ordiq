
"use client"

import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

interface Model {
  id: string
  name: string
  version: string
  risk: string
  created_at: string
}

interface ModelsTableClientProps {
  models: Model[]
}

export function ModelsTableClient({ models }: ModelsTableClientProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">AI Models</h2>
      <DataTable columns={columns} data={models} />
    </div>
  )
}
