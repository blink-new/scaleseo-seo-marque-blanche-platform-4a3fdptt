import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ProjectOverviewProps {
  className?: string
}

const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Fashion',
    website: 'fashion-store.com',
    healthScore: 85,
    status: 'active' as const,
    keywords: 45,
    avgPosition: 12.3,
    trend: 'up' as const,
    lastAudit: '2025-01-20'
  },
  {
    id: '2',
    name: 'Restaurant Local',
    website: 'restaurant-local.fr',
    healthScore: 72,
    status: 'active' as const,
    keywords: 28,
    avgPosition: 18.7,
    trend: 'down' as const,
    lastAudit: '2025-01-19'
  },
  {
    id: '3',
    name: 'Cabinet Avocat',
    website: 'avocat-paris.com',
    healthScore: 91,
    status: 'active' as const,
    keywords: 32,
    avgPosition: 8.2,
    trend: 'stable' as const,
    lastAudit: '2025-01-21'
  }
]

export function ProjectsOverview({ className }: ProjectOverviewProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projets Récents</CardTitle>
        <Button variant="outline" size="sm">
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium">{project.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {project.website}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Score santé:</span>
                    <span className={`font-medium ${getHealthScoreColor(project.healthScore)}`}>
                      {project.healthScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Mots-clés:</span>
                    <span className="font-medium">{project.keywords}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Position moy:</span>
                    <span className="font-medium">{project.avgPosition}</span>
                    {getTrendIcon(project.trend)}
                  </div>
                </div>
              </div>
              <div className="w-24">
                <Progress 
                  value={project.healthScore} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}