import { Sparkles } from 'lucide-react'
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
      className="w-full"
      loading={loading}
      onClick={onClick}
      iconLeft={<Sparkles className="h-4 w-4" />}
      style={{ backgroundColor: '#F97316' }}
    >
      Generate Care Gap Insights
    </Button>
  )
}
