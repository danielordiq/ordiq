
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/columns";

type Model = {
  id: string;
  name: string;
  version: string;
  risk: "High" | "Limited" | "Minimal";
  last_run: string;
};

async function getModels(): Promise<Model[]> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return [];
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("models")
    .select("id, name, version, risk, last_run")
    .order("last_run", { ascending: false });

  if (error) {
    console.error("Supabase error in apps/web/src/app/(dash)/page.tsx:25", error);
    throw error;
  }

  return data || [];
}

export default async function DashboardPage() {
  const models = await getModels();

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Models Dashboard</h1>
        </div>
        <DataTable columns={columns} data={models} />
      </Card>
    </div>
  );
}
