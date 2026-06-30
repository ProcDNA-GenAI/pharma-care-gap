'use client'

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
  render: (row: T, index: number) => React.ReactNode
}

interface InsightsTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  sortKey: string
  sortDir: 'asc' | 'desc'
  onSort: (key: string) => void
  page: number
  pageSize: number
  totalRows: number
  onPage: (p: number) => void
}

function RiskBadge({ rate }: { rate: number }) {
  if (rate >= 30) return <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">High</span>
  if (rate >= 20) return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Medium</span>
  return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Low</span>
}

export { RiskBadge }

export function InsightsTable<T>({
  columns, rows, rowKey, sortKey, sortDir, onSort, page, pageSize, totalRows, onPage,
}: InsightsTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  function SortIcon({ col }: { col: Column<T> }) {
    if (!col.sortable) return null
    if (sortKey !== col.key) return <ChevronsUpDown className="h-3 w-3 text-gray-300" />
    return sortDir === 'asc'
      ? <ChevronUp className="h-3 w-3 text-[#004FBA]" />
      : <ChevronDown className="h-3 w-3 text-[#004FBA]" />
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                  className={cn(
                    'px-4 py-2.5 font-semibold text-gray-600 whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer select-none hover:text-gray-900',
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-gray-400">
                  No results match your filters.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={rowKey(row)} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-2.5 text-gray-700',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                      )}
                    >
                      {col.render(row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
        <span className="text-[10px] text-gray-400">
          Showing {rows.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalRows)} of {totalRows}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            className="h-7 rounded-md border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <span className="px-2 text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => onPage(page + 1)}
            disabled={page >= totalPages}
            className="h-7 rounded-md border border-gray-200 px-2.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
