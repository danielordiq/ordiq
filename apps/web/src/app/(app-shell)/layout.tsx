/* apps/web/src/app/(app-shell)/layout.tsx */
import "../../globals.css"; // ⬅️ change “./” → “../../”
import AppShell from "@/components/AppShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
