import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ComponentType } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: ComponentType<{ className?: string }>
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className
}: MetricCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {change && (
            <Badge
              variant={change.type === 'increase' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {change.type === 'increase' ? '+' : ''}
              {change.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}