import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  BarChart3,
  Search,
  TrendingUp,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Target,
  Activity,
  Zap
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Projets',
    href: '/projects',
    icon: Target,
    description: 'Gestion des clients'
  },
  {
    name: 'Audit SEO',
    href: '/audit',
    icon: Search,
    description: 'Analyse technique'
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: TrendingUp,
    description: 'Suivi des positions'
  },
  {
    name: 'Concurrence',
    href: '/competitors',
    icon: BarChart3,
    description: 'Analyse concurrentielle'
  },
  {
    name: 'Rapports',
    href: '/reports',
    icon: FileText,
    description: 'Génération de rapports'
  }
]

const secondaryNavigation = [
  {
    name: 'Équipe',
    href: '/team',
    icon: Users,
    description: 'Gestion des utilisateurs'
  },
  {
    name: 'Automatisation',
    href: '/automation',
    icon: Zap,
    description: 'Tâches automatisées'
  },
  {
    name: 'Paramètres',
    href: '/settings',
    icon: Settings,
    description: 'Configuration agence'
  }
]

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={cn(
      'flex flex-col border-r bg-card transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">ScaleSEO</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', collapsed ? '' : 'mr-3')} />
                {!collapsed && (
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4', collapsed ? '' : 'mr-3')} />
                {!collapsed && (
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}