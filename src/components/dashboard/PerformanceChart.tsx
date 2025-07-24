import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  className?: string
}

const mockData = [
  { date: '01/01', avgPosition: 25.2, visibility: 12.5 },
  { date: '08/01', avgPosition: 23.8, visibility: 14.2 },
  { date: '15/01', avgPosition: 21.5, visibility: 16.8 },
  { date: '22/01', avgPosition: 19.3, visibility: 19.5 },
  { date: '29/01', avgPosition: 17.8, visibility: 22.1 },
  { date: '05/02', avgPosition: 16.2, visibility: 24.8 },
  { date: '12/02', avgPosition: 15.1, visibility: 26.3 }
]

export function PerformanceChart({ className }: PerformanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Évolution des Performances</CardTitle>
        <p className="text-sm text-muted-foreground">
          Position moyenne et visibilité sur les 30 derniers jours
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line
                type="monotone"
                dataKey="avgPosition"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                name="Position Moyenne"
              />
              <Line
                type="monotone"
                dataKey="visibility"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                name="Visibilité (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Position Moyenne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">Visibilité (%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}