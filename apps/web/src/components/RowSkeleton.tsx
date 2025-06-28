// apps/web/src/components/RowSkeleton.tsx
export const RowSkeleton = () => (
  <tr className="animate-pulse">
    <td>
      <div className="h-4 w-36 bg-slate-200 rounded" />
    </td>
    <td>
      <div className="h-4 w-20 bg-slate-200 rounded" />
    </td>
    <td>
      <div className="h-4 w-16 bg-slate-200 rounded" />
    </td>
    <td>
      <div className="h-4 w-24 bg-slate-200 rounded" />
    </td>
  </tr>
);
