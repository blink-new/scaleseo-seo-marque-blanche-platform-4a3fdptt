export interface User {
  id: string
  email: string
  displayName?: string
  role: 'admin' | 'manager' | 'consultant'
  agencyId: string
  createdAt: string
}

export interface Agency {
  id: string
  name: string
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  domain?: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Project {
  id: string
  name: string
  websiteUrl: string
  keywords: string[]
  competitors: string[]
  location: string
  status: 'active' | 'paused' | 'completed'
  healthScore: number
  createdAt: string
  updatedAt: string
  userId: string
  agencyId?: string
}

export interface TeamMember {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'consultant'
  permissions: string[]
  status: 'active' | 'pending' | 'inactive'
  invitedAt: string
  userId: string
  agencyId?: string
}

export interface SEOAudit {
  id: string
  projectId: string
  healthScore: number
  issuesFound: number
  criticalIssues: number
  warnings: number
  auditData: any
  createdAt: string
  userId: string
}

export interface KeywordPosition {
  id: string
  projectId: string
  keyword: string
  position: number
  searchVolume: number
  difficulty: number
  url: string
  date: string
  userId: string
}

export interface Backlink {
  id: string
  projectId: string
  sourceDomain: string
  targetUrl: string
  anchorText: string
  domainAuthority: number
  status: 'active' | 'lost' | 'new'
  discoveredAt: string
  userId: string
}

export interface Report {
  id: string
  name: string
  templateData: any
  projectId?: string
  scheduleType: 'manual' | 'weekly' | 'monthly'
  scheduleConfig: any
  lastSent?: string
  createdAt: string
  userId: string
}

export interface Competitor {
  id: string
  projectId: string
  domain: string
  name?: string
  visibilityScore: number
  avgPosition: number
  keywordsCount: number
  createdAt: string
  userId: string
}

export interface AutomationTask {
  id: string
  type: 'audit' | 'report' | 'monitoring'
  projectId?: string
  schedule: string
  config: any
  lastRun?: string
  nextRun?: string
  status: 'active' | 'paused' | 'error'
  createdAt: string
  userId: string
}

// Legacy interfaces for compatibility
export interface KeywordRanking {
  id: string
  projectId: string
  keyword: string
  position: number
  previousPosition?: number
  searchVolume: number
  difficulty: number
  url: string
  updatedAt: string
}

export interface AuditIssue {
  id: string
  projectId: string
  type: 'critical' | 'warning' | 'info'
  category: 'technical' | 'content' | 'performance' | 'links'
  title: string
  description: string
  url: string
  priority: number
  status: 'open' | 'fixed' | 'ignored'
  createdAt: string
}

export interface ReportWidget {
  id: string
  type: 'metrics' | 'chart' | 'table' | 'text' | 'image'
  title: string
  config: Record<string, any>
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  widgets: ReportWidget[]
  isDefault: boolean
  createdAt: string
}

export interface MetricData {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
}

export interface ChartData {
  date: string
  positions: number
  visibility: number
}