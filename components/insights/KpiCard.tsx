import { cn } from '@/lib/utils/cn'

type Variant = 'default' | 'purple' | 'green' | 'orange' | 'blue'
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

const variantStyles: Record<Variant, { card: string; iconBg: string; iconColor: string; title: string; value: string; badge: string }> = {
  default: { card: 'border-gray-200 bg-white',     iconBg: 'bg-blue-50',   iconColor: 'text-[#004FBA]', title: 'text-gray-600',   value: 'text-gray-900',   badge: 'bg-blue-50 text-[#004FBA]' },
  purple:  { card: 'border-purple-200 bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-700', title: 'text-purple-700', value: 'text-purple-900', badge: 'bg-purple-100 text-purple-700' },
  green:   { card: 'border-green-200 bg-green-50',   iconBg: 'bg-green-100',  iconColor: 'text-green-700',  title: 'text-green-700',  value: 'text-green-900',  badge: 'bg-green-100 text-green-700' },
  orange:  { card: 'border-orange-200 bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-700', title: 'text-orange-700', value: 'text-orange-900', badge: 'bg-orange-100 text-orange-700' },
  blue:    { card: 'border-blue-200 bg-blue-50',     iconBg: 'bg-blue-100',   iconColor: 'text-blue-700',   title: 'text-blue-700',   value: 'text-blue-900',   badge: 'bg-blue-100 text-blue-700' },
}

export function KpiCard({ title, value, caption, badge, variant = 'default', icon, size = 'primary' }: KpiCardProps) {
  const s = variantStyles[variant]
  const isPrimary = size === 'primary'

  return (
    <div className={cn('rounded-xl border p-3 shadow-sm flex flex-col gap-1.5 min-w-0', s.card)}>
      <div className="flex items-start gap-1.5">
        <div className={cn('flex shrink-0 items-center justify-center rounded-lg', isPrimary ? 'h-7 w-7' : 'h-6 w-6', s.iconBg)}>
          <span className={cn(isPrimary ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5', s.iconColor)}>{icon}</span>
        </div>
        <p className={cn('min-w-0 text-[11px] font-semibold leading-tight', s.title)}>{title}</p>
      </div>

      <p className={cn('font-bold tabular-nums leading-none', isPrimary ? 'text-2xl' : 'text-lg', s.value)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {badge && (
        <span className={cn(
          'inline-flex w-fit shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
          s.badge,
        )}>
          {badge}
        </span>
      )}

      <p className="text-[11px] leading-snug text-[#6B7280] line-clamp-2">{caption}</p>
    </div>
  )
}
