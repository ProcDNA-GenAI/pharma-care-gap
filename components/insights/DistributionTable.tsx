import { cn } from '@/lib/utils/cn'

export interface DistributionColumn {
  label: string
  align?: 'left' | 'right' | 'center'
}

interface DistributionTableProps {
  title: string
  columns: DistributionColumn[]
  rows: (string | number)[][]
  totalRow: (string | number)[]
}

function alignClass(align?: 'left' | 'right' | 'center') {
  return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
}

export function DistributionTable({ title, columns, rows, totalRow }: DistributionTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3">
        <span className="text-xs font-semibold text-gray-900">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={cn('px-4 py-2.5 font-semibold text-gray-600 whitespace-nowrap', alignClass(col.align))}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className={cn('px-4 py-2.5 text-gray-700', alignClass(columns[j]?.align))}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50">
              {totalRow.map((cell, j) => (
                <td key={j} className={cn('px-4 py-2.5 font-semibold text-gray-900', alignClass(columns[j]?.align))}>
                  {cell}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
