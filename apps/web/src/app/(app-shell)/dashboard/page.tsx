// apps/web/src/app/(app-shell)/dashboard/page.tsx
import SearchableTable from "./SearchableTable.client";

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <SearchableTable />
    </section>
  );
}
