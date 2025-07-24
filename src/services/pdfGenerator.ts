import { blink } from '../blink/client'
import { Project, SEOAudit, KeywordRanking, Backlink } from '../types'

export interface ReportTemplate {
  id: string
  name: string
  sections: ReportSection[]
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    companyName: string
  }
  format: 'A4' | 'Letter'
  orientation: 'portrait' | 'landscape'
}

export interface ReportSection {
  id: string
  type: 'cover' | 'summary' | 'keywords' | 'backlinks' | 'audit' | 'recommendations' | 'charts'
  title: string
  content: any
  order: number
}

export class PDFGeneratorService {
  private static async generateHTML(template: ReportTemplate, data: any): Promise<string> {
    const { branding } = template
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Rapport SEO - ${data.project.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Inter', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333;
          background: white;
        }
        .page { 
          width: 210mm; 
          min-height: 297mm; 
          padding: 20mm; 
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          page-break-after: always;
        }
        .page:last-child { page-break-after: avoid; }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          border-bottom: 3px solid ${branding.primaryColor}; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .logo { max-height: 60px; }
        .company-name { 
          font-size: 24px; 
          font-weight: bold; 
          color: ${branding.primaryColor}; 
        }
        .cover-title { 
          font-size: 36px; 
          font-weight: bold; 
          color: ${branding.primaryColor}; 
          text-align: center; 
          margin: 60px 0; 
        }
        .cover-subtitle { 
          font-size: 18px; 
          text-align: center; 
          color: #666; 
          margin-bottom: 40px; 
        }
        .section-title { 
          font-size: 24px; 
          font-weight: bold; 
          color: ${branding.primaryColor}; 
          margin: 30px 0 20px 0; 
          border-left: 4px solid ${branding.primaryColor}; 
          padding-left: 15px; 
        }
        .metric-card { 
          background: #f8f9fa; 
          border: 1px solid #e9ecef; 
          border-radius: 8px; 
          padding: 20px; 
          margin: 15px 0; 
          display: inline-block; 
          width: 48%; 
          margin-right: 2%; 
        }
        .metric-value { 
          font-size: 32px; 
          font-weight: bold; 
          color: ${branding.primaryColor}; 
        }
        .metric-label { 
          font-size: 14px; 
          color: #666; 
          margin-top: 5px; 
        }
        .table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
        }
        .table th, .table td { 
          border: 1px solid #ddd; 
          padding: 12px; 
          text-align: left; 
        }
        .table th { 
          background: ${branding.primaryColor}; 
          color: white; 
          font-weight: bold; 
        }
        .table tr:nth-child(even) { 
          background: #f8f9fa; 
        }
        .chart-placeholder { 
          width: 100%; 
          height: 300px; 
          background: #f8f9fa; 
          border: 2px dashed #ddd; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #666; 
          font-size: 16px; 
          margin: 20px 0; 
        }
        .recommendation { 
          background: #fff3cd; 
          border: 1px solid #ffeaa7; 
          border-radius: 8px; 
          padding: 15px; 
          margin: 15px 0; 
        }
        .recommendation-title { 
          font-weight: bold; 
          color: #856404; 
          margin-bottom: 10px; 
        }
        .footer { 
          position: fixed; 
          bottom: 20mm; 
          left: 20mm; 
          right: 20mm; 
          text-align: center; 
          font-size: 12px; 
          color: #666; 
          border-top: 1px solid #ddd; 
          padding-top: 10px; 
        }
        @media print {
          .page { box-shadow: none; margin: 0; }
          .footer { position: fixed; }
        }
      </style>
    </head>
    <body>
      ${this.generateCoverPage(template, data)}
      ${this.generateSummaryPage(template, data)}
      ${this.generateKeywordsPage(template, data)}
      ${this.generateBacklinksPage(template, data)}
      ${this.generateAuditPage(template, data)}
      ${this.generateRecommendationsPage(template, data)}
      
      <div class="footer">
        Rapport généré par ${branding.companyName} - ${new Date().toLocaleDateString('fr-FR')}
      </div>
    </body>
    </html>
    `
    
    return html
  }

  private static generateCoverPage(template: ReportTemplate, data: any): string {
    const { branding } = template
    return `
    <div class="page">
      <div class="header">
        ${branding.logo ? `<img src="${branding.logo}" alt="Logo" class="logo">` : ''}
        <div class="company-name">${branding.companyName}</div>
      </div>
      
      <div class="cover-title">Rapport SEO</div>
      <div class="cover-subtitle">
        Analyse complète pour ${data.project.name}<br>
        Période: ${data.period.start} - ${data.period.end}
      </div>
      
      <div style="margin-top: 60px;">
        <div class="metric-card">
          <div class="metric-value">${data.summary.totalKeywords}</div>
          <div class="metric-label">Mots-clés suivis</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.summary.averagePosition.toFixed(1)}</div>
          <div class="metric-label">Position moyenne</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.summary.totalBacklinks}</div>
          <div class="metric-label">Backlinks actifs</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.summary.healthScore}%</div>
          <div class="metric-label">Score de santé</div>
        </div>
      </div>
    </div>
    `
  }

  private static generateSummaryPage(template: ReportTemplate, data: any): string {
    return `
    <div class="page">
      <h2 class="section-title">Résumé Exécutif</h2>
      
      <p>Ce rapport présente l'analyse SEO complète de <strong>${data.project.name}</strong> pour la période du ${data.period.start} au ${data.period.end}.</p>
      
      <h3 class="section-title" style="font-size: 18px;">Points Clés</h3>
      <ul style="margin-left: 20px; line-height: 2;">
        <li>Suivi de ${data.summary.totalKeywords} mots-clés stratégiques</li>
        <li>Position moyenne de ${data.summary.averagePosition.toFixed(1)} sur Google</li>
        <li>${data.summary.totalBacklinks} backlinks actifs détectés</li>
        <li>Score de santé technique de ${data.summary.healthScore}%</li>
        <li>${data.summary.criticalIssues} problèmes critiques identifiés</li>
      </ul>
      
      <h3 class="section-title" style="font-size: 18px;">Évolution des Performances</h3>
      <div class="chart-placeholder">
        Graphique d'évolution des positions (à intégrer)
      </div>
      
      <h3 class="section-title" style="font-size: 18px;">Recommandations Prioritaires</h3>
      <div class="recommendation">
        <div class="recommendation-title">🎯 Optimisation Technique</div>
        Corriger les ${data.summary.criticalIssues} problèmes critiques identifiés lors de l'audit.
      </div>
      <div class="recommendation">
        <div class="recommendation-title">📈 Amélioration du Contenu</div>
        Optimiser les pages pour les mots-clés en position 4-10 pour gagner en visibilité.
      </div>
    </div>
    `
  }

  private static generateKeywordsPage(template: ReportTemplate, data: any): string {
    const keywordsTable = data.keywords.slice(0, 20).map((kw: any) => `
      <tr>
        <td>${kw.keyword}</td>
        <td>${kw.position}</td>
        <td>${kw.previous_position || '-'}</td>
        <td>${kw.search_volume?.toLocaleString() || '-'}</td>
        <td>${kw.difficulty || '-'}%</td>
        <td style="color: ${kw.position < (kw.previous_position || 100) ? '#10b981' : '#ef4444'}">
          ${kw.position < (kw.previous_position || 100) ? '↗️' : '↘️'}
        </td>
      </tr>
    `).join('')

    return `
    <div class="page">
      <h2 class="section-title">Analyse des Mots-Clés</h2>
      
      <p>Suivi détaillé des positions pour les ${data.keywords.length} mots-clés stratégiques.</p>
      
      <table class="table">
        <thead>
          <tr>
            <th>Mot-clé</th>
            <th>Position</th>
            <th>Position Précédente</th>
            <th>Volume</th>
            <th>Difficulté</th>
            <th>Tendance</th>
          </tr>
        </thead>
        <tbody>
          ${keywordsTable}
        </tbody>
      </table>
      
      <h3 class="section-title" style="font-size: 18px;">Top Opportunités</h3>
      <p>Mots-clés en position 4-10 avec fort potentiel d'amélioration :</p>
      <ul style="margin-left: 20px;">
        ${data.keywords.filter((kw: any) => kw.position >= 4 && kw.position <= 10).slice(0, 5).map((kw: any) => 
          `<li><strong>${kw.keyword}</strong> - Position ${kw.position} (Volume: ${kw.search_volume?.toLocaleString() || 'N/A'})</li>`
        ).join('')}
      </ul>
    </div>
    `
  }

  private static generateBacklinksPage(template: ReportTemplate, data: any): string {
    const backlinksTable = data.backlinks.slice(0, 15).map((bl: any) => `
      <tr>
        <td style="max-width: 200px; word-break: break-all;">${bl.source_url}</td>
        <td>${bl.anchor_text}</td>
        <td>${bl.domain_authority}</td>
        <td>${bl.follow_type}</td>
        <td>
          <span style="color: ${bl.status === 'active' ? '#10b981' : bl.status === 'new' ? '#3b82f6' : '#ef4444'}">
            ${bl.status === 'active' ? '✅' : bl.status === 'new' ? '🆕' : '❌'} ${bl.status}
          </span>
        </td>
      </tr>
    `).join('')

    return `
    <div class="page">
      <h2 class="section-title">Analyse des Backlinks</h2>
      
      <div class="metric-card">
        <div class="metric-value">${data.backlinks.length}</div>
        <div class="metric-label">Total Backlinks</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${data.backlinks.filter((bl: any) => bl.status === 'new').length}</div>
        <div class="metric-label">Nouveaux ce mois</div>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Domaine Source</th>
            <th>Texte d'Ancrage</th>
            <th>DA</th>
            <th>Type</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${backlinksTable}
        </tbody>
      </table>
      
      <h3 class="section-title" style="font-size: 18px;">Qualité du Profil de Liens</h3>
      <div class="chart-placeholder">
        Répartition par Domain Authority (à intégrer)
      </div>
    </div>
    `
  }

  private static generateAuditPage(template: ReportTemplate, data: any): string {
    const auditIssues = data.audit?.issues || []
    const criticalIssues = auditIssues.filter((issue: any) => issue.severity === 'critical')
    const warningIssues = auditIssues.filter((issue: any) => issue.severity === 'warning')

    return `
    <div class="page">
      <h2 class="section-title">Audit Technique</h2>
      
      <div class="metric-card">
        <div class="metric-value">${data.summary.healthScore}%</div>
        <div class="metric-label">Score de Santé</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${criticalIssues.length}</div>
        <div class="metric-label">Problèmes Critiques</div>
      </div>
      
      <h3 class="section-title" style="font-size: 18px;">Problèmes Critiques</h3>
      ${criticalIssues.slice(0, 10).map((issue: any) => `
        <div class="recommendation" style="background: #fee2e2; border-color: #fecaca;">
          <div class="recommendation-title" style="color: #dc2626;">🚨 ${issue.title}</div>
          <p>${issue.description}</p>
          <p><strong>Impact:</strong> ${issue.impact}</p>
        </div>
      `).join('')}
      
      <h3 class="section-title" style="font-size: 18px;">Avertissements</h3>
      ${warningIssues.slice(0, 5).map((issue: any) => `
        <div class="recommendation">
          <div class="recommendation-title">⚠️ ${issue.title}</div>
          <p>${issue.description}</p>
        </div>
      `).join('')}
    </div>
    `
  }

  private static generateRecommendationsPage(template: ReportTemplate, data: any): string {
    return `
    <div class="page">
      <h2 class="section-title">Recommandations Stratégiques</h2>
      
      <h3 class="section-title" style="font-size: 18px;">Actions Prioritaires</h3>
      
      <div class="recommendation" style="background: #dcfce7; border-color: #bbf7d0;">
        <div class="recommendation-title" style="color: #166534;">🎯 Optimisation Technique (Priorité Haute)</div>
        <ul style="margin-left: 20px;">
          <li>Corriger les ${data.summary.criticalIssues} erreurs critiques identifiées</li>
          <li>Optimiser la vitesse de chargement des pages lentes</li>
          <li>Améliorer le maillage interne</li>
        </ul>
      </div>
      
      <div class="recommendation" style="background: #dbeafe; border-color: #bfdbfe;">
        <div class="recommendation-title" style="color: #1d4ed8;">📈 Amélioration du Contenu (Priorité Moyenne)</div>
        <ul style="margin-left: 20px;">
          <li>Optimiser les pages en position 4-10 pour gagner en visibilité</li>
          <li>Créer du contenu pour les mots-clés manqués par rapport à la concurrence</li>
          <li>Améliorer les méta-descriptions pour augmenter le CTR</li>
        </ul>
      </div>
      
      <div class="recommendation" style="background: #fef3c7; border-color: #fde68a;">
        <div class="recommendation-title" style="color: #92400e;">🔗 Stratégie de Liens (Priorité Faible)</div>
        <ul style="margin-left: 20px;">
          <li>Développer une stratégie d'acquisition de backlinks de qualité</li>
          <li>Surveiller et désavouer les liens toxiques si nécessaire</li>
          <li>Optimiser les textes d'ancrage pour plus de diversité</li>
        </ul>
      </div>
      
      <h3 class="section-title" style="font-size: 18px;">Prochaines Étapes</h3>
      <ol style="margin-left: 20px; line-height: 2;">
        <li>Implémenter les corrections techniques critiques (Semaine 1-2)</li>
        <li>Optimiser le contenu des pages prioritaires (Semaine 3-4)</li>
        <li>Lancer la campagne d'acquisition de liens (Mois 2)</li>
        <li>Surveiller les performances et ajuster la stratégie (Continu)</li>
      </ol>
    </div>
    `
  }

  static async generateReport(templateId: string, projectId: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Récupérer les données du projet
      const project = await blink.db.projects.list({ where: { id: projectId } })
      const keywords = await blink.db.keyword_rankings.list({ where: { project_id: projectId } })
      const backlinks = await blink.db.backlinks.list({ where: { project_id: projectId } })
      const audits = await blink.db.seo_audits.list({ where: { project_id: projectId } })

      if (!project.length) {
        throw new Error('Projet non trouvé')
      }

      // Préparer les données pour le rapport
      const reportData = {
        project: project[0],
        keywords,
        backlinks,
        audit: audits[0],
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
          end: new Date().toLocaleDateString('fr-FR')
        },
        summary: {
          totalKeywords: keywords.length,
          averagePosition: keywords.reduce((acc, kw) => acc + (kw.position || 0), 0) / keywords.length || 0,
          totalBacklinks: backlinks.length,
          healthScore: audits[0]?.health_score || 85,
          criticalIssues: audits[0]?.issues ? JSON.parse(audits[0].issues).filter((i: any) => i.severity === 'critical').length : 0
        }
      }

      // Template par défaut
      const template: ReportTemplate = {
        id: templateId,
        name: 'Rapport Mensuel',
        sections: [],
        branding: {
          primaryColor: '#2563eb',
          secondaryColor: '#10b981',
          companyName: 'Votre Agence SEO'
        },
        format: 'A4',
        orientation: 'portrait'
      }

      // Générer le HTML
      const html = await this.generateHTML(template, reportData)

      // Convertir en PDF via une API externe ou service
      const pdfResponse = await blink.data.fetch({
        url: 'https://api.html-pdf-api.com/v1/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {{html_pdf_api_key}}'
        },
        body: {
          html,
          options: {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            }
          }
        }
      })

      if (pdfResponse.status === 200) {
        // Sauvegarder le PDF dans le stockage
        const pdfBlob = new Blob([pdfResponse.body], { type: 'application/pdf' })
        const { publicUrl } = await blink.storage.upload(
          pdfBlob as File,
          `reports/rapport-seo-${projectId}-${Date.now()}.pdf`,
          { upsert: true }
        )

        return { success: true, url: publicUrl }
      } else {
        throw new Error('Erreur lors de la génération du PDF')
      }
    } catch (error) {
      console.error('PDF Generation Error:', error)
      return { success: false, error: error.message }
    }
  }

  static async scheduleReport(projectId: string, templateId: string, recipients: string[], schedule: string) {
    try {
      // Créer une tâche d'automatisation pour l'envoi de rapport
      await blink.db.automations.create({
        id: `auto_${Date.now()}`,
        project_id: projectId,
        type: 'report_sending',
        name: `Envoi automatique de rapport - ${projectId}`,
        schedule,
        config: JSON.stringify({
          templateId,
          recipients,
          format: 'pdf'
        }),
        is_active: true,
        created_at: new Date().toISOString(),
        user_id: 'current_user'
      })

      return { success: true, message: 'Rapport programmé avec succès' }
    } catch (error) {
      console.error('Schedule Report Error:', error)
      return { success: false, error: error.message }
    }
  }
}