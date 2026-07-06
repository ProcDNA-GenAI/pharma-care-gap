import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface GenerateInsightsButtonProps {
  onClick: () => void
  loading?: boolean
}

export function GenerateInsightsButton({ onClick, loading = false }: GenerateInsightsButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      className="h-14 w-full rounded-xl text-base"
      loading={loading}
      onClick={onClick}
      iconLeft={<BarChart3 className="h-5 w-5" />}
      style={{ backgroundColor: '#F97316' }}
    >
      Analyze Care Gaps
    </Button>
  )
}
