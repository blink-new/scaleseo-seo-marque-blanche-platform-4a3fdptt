import { MetricCard } from '@/components/dashboard/MetricCard'
import { ProjectsOverview } from '@/components/dashboard/ProjectsOverview'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react'

export function Dashboard() {
  const recentAudits = [
    {
      id: '1',
      project: 'E-commerce Fashion',
      issues: 12,
      critical: 2,
      date: '2025-01-21',
      status: 'completed'
    },
    {
      id: '2',
      project: 'Restaurant Local',
      issues: 8,
      critical: 1,
      date: '2025-01-20',
      status: 'completed'
    },
    {
      id: '3',
      project: 'Cabinet Avocat',
      issues: 5,
      critical: 0,
      date: '2025-01-19',
      status: 'completed'
    }
  ]

  const upcomingReports = [
    {
      id: '1',
      project: 'E-commerce Fashion',
      type: 'Rapport Mensuel',
      scheduledDate: '2025-02-01',
      recipients: 2
    },
    {
      id: '2',
      project: 'Restaurant Local',
      type: 'Audit Technique',
      scheduledDate: '2025-02-03',
      recipients: 1
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos performances SEO
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Projets Actifs"
          value={12}
          change={{ value: 8.2, type: 'increase' }}
          icon={Target}
          description="3 nouveaux ce mois"
        />
        <MetricCard
          title="Position Moyenne"
          value="15.3"
          change={{ value: 12.5, type: 'increase' }}
          icon={TrendingUp}
          description="Amélioration continue"
        />
        <MetricCard
          title="Problèmes Critiques"
          value={8}
          change={{ value: 25.0, type: 'decrease' }}
          icon={AlertTriangle}
          description="Réduction significative"
        />
        <MetricCard
          title="Clients Actifs"
          value={12}
          change={{ value: 15.4, type: 'increase' }}
          icon={Users}
          description="Croissance stable"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>

        {/* Recent Audits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Audits Récents</CardTitle>
            <Button variant="outline" size="sm">
              Voir tous
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{audit.project}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {audit.issues} problèmes
                      </Badge>
                      {audit.critical > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {audit.critical} critiques
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {audit.date}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects Overview */}
        <ProjectsOverview />

        {/* Upcoming Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rapports Programmés</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{report.project}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.type}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {report.scheduledDate}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {report.recipients} destinataire(s)
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}