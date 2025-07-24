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
  logo?: string
  primaryColor: string
  secondaryColor: string
  domain?: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  website: string
  agencyId: string
  status: 'active' | 'paused' | 'completed'
  healthScore: number
  keywords: string[]
  competitors: string[]
  location: string
  createdAt: string
  lastAudit?: string
}

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

export interface Backlink {
  id: string
  projectId: string
  sourceUrl: string
  targetUrl: string
  anchorText: string
  domainAuthority: number
  status: 'active' | 'lost' | 'new'
  firstSeen: string
  lastSeen: string
}

export interface Report {
  id: string
  projectId: string
  name: string
  template: string
  scheduledSend?: {
    frequency: 'weekly' | 'monthly'
    dayOfWeek?: number
    dayOfMonth?: number
    time: string
    recipients: string[]
  }
  createdAt: string
  lastSent?: string
}