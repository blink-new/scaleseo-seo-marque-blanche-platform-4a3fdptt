import { blink } from '../blink/client'
import type { 
  Project, 
  TeamMember, 
  SEOAudit, 
  KeywordPosition, 
  Backlink, 
  Report, 
  Competitor,
  AutomationTask,
  Agency
} from '../types'

// Agency Services
export const agencyService = {
  async getAgency(): Promise<Agency | null> {
    const agencies = await blink.db.agencies.list({
      limit: 1,
      orderBy: { createdAt: 'desc' }
    })
    return agencies[0] || null
  },

  async createAgency(data: Omit<Agency, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Agency> {
    const user = await blink.auth.me()
    return await blink.db.agencies.create({
      id: `agency_${Date.now()}`,
      ...data,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  },

  async updateAgency(id: string, data: Partial<Agency>): Promise<Agency> {
    return await blink.db.agencies.update(id, {
      ...data,
      updatedAt: new Date().toISOString()
    })
  }
}

// Project Services
export const projectService = {
  async getProjects(): Promise<Project[]> {
    return await blink.db.projects.list({
      orderBy: { createdAt: 'desc' }
    })
  },

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<Project> {
    const user = await blink.auth.me()
    const agency = await agencyService.getAgency()
    
    return await blink.db.projects.create({
      id: `project_${Date.now()}`,
      ...data,
      keywords: JSON.stringify(data.keywords || []),
      competitors: JSON.stringify(data.competitors || []),
      userId: user.id,
      agencyId: agency?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const updateData: any = {
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    if (data.keywords) {
      updateData.keywords = JSON.stringify(data.keywords)
    }
    if (data.competitors) {
      updateData.competitors = JSON.stringify(data.competitors)
    }
    
    return await blink.db.projects.update(id, updateData)
  },

  async deleteProject(id: string): Promise<void> {
    await blink.db.projects.delete(id)
  }
}

// Team Services
export const teamService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    return await blink.db.teamMembers.list({
      orderBy: { invitedAt: 'desc' }
    })
  },

  async inviteTeamMember(data: Omit<TeamMember, 'id' | 'invitedAt' | 'userId' | 'agencyId'>): Promise<TeamMember> {
    const user = await blink.auth.me()
    const agency = await agencyService.getAgency()
    
    return await blink.db.teamMembers.create({
      id: `member_${Date.now()}`,
      ...data,
      permissions: JSON.stringify(data.permissions || []),
      userId: user.id,
      agencyId: agency?.id,
      invitedAt: new Date().toISOString()
    })
  },

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const updateData: any = { ...data }
    if (data.permissions) {
      updateData.permissions = JSON.stringify(data.permissions)
    }
    return await blink.db.teamMembers.update(id, updateData)
  },

  async removeTeamMember(id: string): Promise<void> {
    await blink.db.teamMembers.delete(id)
  }
}

// SEO Audit Services
export const auditService = {
  async getAudits(projectId?: string): Promise<SEOAudit[]> {
    const where = projectId ? { projectId } : {}
    return await blink.db.seoAudits.list({
      where,
      orderBy: { createdAt: 'desc' }
    })
  },

  async createAudit(data: Omit<SEOAudit, 'id' | 'createdAt' | 'userId'>): Promise<SEOAudit> {
    const user = await blink.auth.me()
    return await blink.db.seoAudits.create({
      id: `audit_${Date.now()}`,
      ...data,
      auditData: JSON.stringify(data.auditData || {}),
      userId: user.id,
      createdAt: new Date().toISOString()
    })
  }
}

// Keyword Position Services
export const keywordService = {
  async getKeywordPositions(projectId: string): Promise<KeywordPosition[]> {
    return await blink.db.keywordPositions.list({
      where: { projectId },
      orderBy: { date: 'desc' }
    })
  },

  async addKeywordPosition(data: Omit<KeywordPosition, 'id' | 'userId'>): Promise<KeywordPosition> {
    const user = await blink.auth.me()
    return await blink.db.keywordPositions.create({
      id: `kw_${Date.now()}`,
      ...data,
      userId: user.id
    })
  }
}

// Backlink Services
export const backlinkService = {
  async getBacklinks(projectId: string): Promise<Backlink[]> {
    return await blink.db.backlinks.list({
      where: { projectId },
      orderBy: { discoveredAt: 'desc' }
    })
  },

  async addBacklink(data: Omit<Backlink, 'id' | 'userId' | 'discoveredAt'>): Promise<Backlink> {
    const user = await blink.auth.me()
    return await blink.db.backlinks.create({
      id: `bl_${Date.now()}`,
      ...data,
      userId: user.id,
      discoveredAt: new Date().toISOString()
    })
  }
}

// Report Services
export const reportService = {
  async getReports(): Promise<Report[]> {
    return await blink.db.reports.list({
      orderBy: { createdAt: 'desc' }
    })
  },

  async createReport(data: Omit<Report, 'id' | 'createdAt' | 'userId'>): Promise<Report> {
    const user = await blink.auth.me()
    return await blink.db.reports.create({
      id: `report_${Date.now()}`,
      ...data,
      templateData: JSON.stringify(data.templateData || {}),
      scheduleConfig: JSON.stringify(data.scheduleConfig || {}),
      userId: user.id,
      createdAt: new Date().toISOString()
    })
  },

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const updateData: any = { ...data }
    if (data.templateData) {
      updateData.templateData = JSON.stringify(data.templateData)
    }
    if (data.scheduleConfig) {
      updateData.scheduleConfig = JSON.stringify(data.scheduleConfig)
    }
    return await blink.db.reports.update(id, updateData)
  }
}

// Competitor Services
export const competitorService = {
  async getCompetitors(projectId?: string): Promise<Competitor[]> {
    const where = projectId ? { projectId } : {}
    return await blink.db.competitors.list({
      where,
      orderBy: { visibilityScore: 'desc' }
    })
  },

  async addCompetitor(data: Omit<Competitor, 'id' | 'createdAt' | 'userId'>): Promise<Competitor> {
    const user = await blink.auth.me()
    return await blink.db.competitors.create({
      id: `comp_${Date.now()}`,
      ...data,
      userId: user.id,
      createdAt: new Date().toISOString()
    })
  }
}

// Automation Services
export const automationService = {
  async getAutomationTasks(): Promise<AutomationTask[]> {
    return await blink.db.automationTasks.list({
      orderBy: { createdAt: 'desc' }
    })
  },

  async createAutomationTask(data: Omit<AutomationTask, 'id' | 'createdAt' | 'userId'>): Promise<AutomationTask> {
    const user = await blink.auth.me()
    return await blink.db.automationTasks.create({
      id: `auto_${Date.now()}`,
      ...data,
      config: JSON.stringify(data.config || {}),
      userId: user.id,
      createdAt: new Date().toISOString()
    })
  },

  async updateAutomationTask(id: string, data: Partial<AutomationTask>): Promise<AutomationTask> {
    const updateData: any = { ...data }
    if (data.config) {
      updateData.config = JSON.stringify(data.config)
    }
    return await blink.db.automationTasks.update(id, updateData)
  }
}