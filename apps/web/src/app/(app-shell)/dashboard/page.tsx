// apps/web/src/app/(app-shell)/dashboard/page.tsx
import dynamic from "next/dynamic";

/* 👉  Import the client component lazily so it bundles separately */
const SearchableTable = dynamic(() => import("./SearchableTable.client"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <SearchableTable />
    </section>
  );
}
