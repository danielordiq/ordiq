
"use client"

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

interface Model {
  id: string
  name: string
  version: string
  risk: string
  created_at: string
}

export const columns: ColumnDef<Model>[] = [
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
