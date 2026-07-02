import { cn } from '@/lib/utils/cn'

type Variant = 'default' | 'highlight' | 'success' | 'warning'
type Size = 'primary' | 'secondary'

interface KpiCardProps {
  title: string
  value: string | number
  caption: string
  badge?: string
  variant?: Variant
  icon: React.ReactNode
  size?: Size
}

const variantStyles: Record<Variant, { card: string; iconBg: string; iconColor: string; value: string }> = {
  default:   { card: 'border-gray-200',                iconBg: 'bg-blue-50',   iconColor: 'text-[#004FBA]', value: 'text-gray-900'    },
  highlight: { card: 'border-purple-200 bg-purple-50', iconBg: 'bg-purple-100',iconColor: 'text-purple-700',value: 'text-purple-800'  },
  success:   { card: 'border-emerald-200',             iconBg: 'bg-emerald-50',iconColor: 'text-emerald-600',value: 'text-emerald-700' },
  warning:   { card: 'border-amber-200',               iconBg: 'bg-amber-50',  iconColor: 'text-amber-600', value: 'text-amber-700'   },
}

export function KpiCard({ title, value, caption, badge, variant = 'default', icon, size = 'primary' }: KpiCardProps) {
  const s = variantStyles[variant]
  const isPrimary = size === 'primary'

  return (
    <div className={cn('rounded-xl border bg-white p-3 shadow-sm flex flex-col gap-1', s.card, variant === 'highlight' && 'bg-purple-50')}>
      <div className="flex items-start gap-1.5">
        <div className={cn('flex shrink-0 items-center justify-center rounded-lg', isPrimary ? 'h-8 w-8' : 'h-6 w-6', s.iconBg)}>
          <span className={cn(isPrimary ? 'h-4 w-4' : 'h-3.5 w-3.5', s.iconColor)}>{icon}</span>
        </div>
        <p className="min-w-0 text-xs font-medium leading-tight text-gray-600">{title}</p>
      </div>

      <p className={cn('font-bold tabular-nums leading-none', isPrimary ? 'text-2xl' : 'text-lg', s.value)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {badge && (
        <span className={cn(
          'inline-flex w-fit shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
          variant === 'highlight' ? 'bg-purple-100 text-purple-700' :
          variant === 'success'   ? 'bg-emerald-100 text-emerald-700' :
          'bg-blue-50 text-[#004FBA]',
        )}>
          {badge}
        </span>
      )}

      <p className="text-[10px] leading-snug text-gray-400 line-clamp-2">{caption}</p>
    </div>
  )
}
