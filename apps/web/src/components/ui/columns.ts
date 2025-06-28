
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

type Model = {
  id: string;
  name: string;
  version: string;
  risk: "High" | "Limited" | "Minimal";
  last_run: string;
};

function getRiskBadgeVariant(risk: string) {
  switch (risk) {
    case "High":
      return "destructive";
    case "Limited": 
      return "secondary";
    case "Minimal":
      return "default";
    default:
      return "outline";
  }
}

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "version", 
    header: "Version",
  },
  {
    accessorKey: "risk",
    header: "Risk Level",
    cell: ({ row }) => {
      const risk = row.getValue("risk") as string;
      return (
        <Badge 
          variant={getRiskBadgeVariant(risk)} 
          className={
            risk === "High" ? "bg-red-500 hover:bg-red-600" :
            risk === "Limited" ? "bg-yellow-500 hover:bg-yellow-600" :
            "bg-green-500 hover:bg-green-600"
          }
        >
          {risk}
        </Badge>
      );
    },
  },
  {
    accessorKey: "last_run",
    header: "Last Run", 
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_run"));
      return date.toLocaleDateString();
    },
  },
];
