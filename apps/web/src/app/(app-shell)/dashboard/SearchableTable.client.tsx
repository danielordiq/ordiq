// apps/web/src/app/(app-shell)/dashboard/SearchableTable.client.tsx
'use client'

import { useState } from 'react'
import { useDebounce } from '@/components/useDebounce'

/* 👇 change this line — curly braces for the **named** export */
import { ErrorBoundary } from '@/components/ErrorBoundary'

import ModelsTable from './ModelsTable'

export default function SearchableTable() {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search model…"
        className="w-64 rounded border px-3 py-2 text-sm"
      />

      <ErrorBoundary>
        <ModelsTable search={debounced} />
      </ErrorBoundary>
    </>
  )
}
