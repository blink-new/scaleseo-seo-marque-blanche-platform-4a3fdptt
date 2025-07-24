import { blink } from '../blink/client'

export interface Notification {
  id: string
  type: 'audit_complete' | 'ranking_change' | 'new_backlink' | 'critical_issue' | 'report_generated' | 'system'
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'success'
  project_id?: string
  data?: any
  read: boolean
  created_at: string
  user_id: string
}

export interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  audit_complete: boolean
  ranking_changes: boolean
  new_backlinks: boolean
  critical_issues: boolean
  report_generated: boolean
  weekly_summary: boolean
}

export class NotificationService {
  private static channel = blink.realtime.channel('notifications')
  private static listeners: ((notification: Notification) => void)[] = []

  // Initialiser le service de notifications
  static async initialize(userId: string) {
    try {
      await this.channel.subscribe({
        userId,
        metadata: { type: 'notification_listener' }
      })

      // Écouter les nouvelles notifications
      this.channel.onMessage((message) => {
        if (message.type === 'notification' && message.userId === userId) {
          const notification = message.data as Notification
          this.listeners.forEach(listener => listener(notification))
          
          // Afficher une notification browser si supporté
          this.showBrowserNotification(notification)
        }
      })

      console.log('Notification service initialized')
    } catch (error) {
      console.error('Failed to initialize notification service:', error)
    }
  }

  // Ajouter un listener pour les nouvelles notifications
  static addListener(callback: (notification: Notification) => void) {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Créer une nouvelle notification
  static async create(notification: Omit<Notification, 'id' | 'created_at' | 'read'>): Promise<Notification> {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        read: false
      }

      // Sauvegarder en base de données
      await blink.db.notifications.create(newNotification)

      // Envoyer via realtime
      await this.channel.publish('notification', newNotification, {
        userId: notification.user_id
      })

      // Envoyer par email si configuré
      await this.sendEmailNotification(newNotification)

      return newNotification
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  // Récupérer les notifications d'un utilisateur
  static async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const notifications = await blink.db.notifications.list({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        limit
      })
      return notifications
    } catch (error) {
      console.error('Failed to get notifications:', error)
      return []
    }
  }

  // Marquer une notification comme lue
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await blink.db.notifications.update(notificationId, { read: true })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Marquer toutes les notifications comme lues
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await blink.db.notifications.list({
        where: { user_id: userId, read: false }
      })

      for (const notification of notifications) {
        await blink.db.notifications.update(notification.id, { read: true })
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Supprimer une notification
  static async delete(notificationId: string): Promise<void> {
    try {
      await blink.db.notifications.delete(notificationId)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Obtenir les paramètres de notification
  static async getSettings(userId: string): Promise<NotificationSettings> {
    try {
      const settings = await blink.db.notification_settings.list({
        where: { user_id: userId }
      })

      if (settings.length > 0) {
        return JSON.parse(settings[0].settings)
      }

      // Paramètres par défaut
      const defaultSettings: NotificationSettings = {
        email_notifications: true,
        push_notifications: true,
        audit_complete: true,
        ranking_changes: true,
        new_backlinks: true,
        critical_issues: true,
        report_generated: true,
        weekly_summary: true
      }

      await blink.db.notification_settings.create({
        id: `settings_${userId}`,
        user_id: userId,
        settings: JSON.stringify(defaultSettings),
        created_at: new Date().toISOString()
      })

      return defaultSettings
    } catch (error) {
      console.error('Failed to get notification settings:', error)
      return {
        email_notifications: true,
        push_notifications: true,
        audit_complete: true,
        ranking_changes: true,
        new_backlinks: true,
        critical_issues: true,
        report_generated: true,
        weekly_summary: true
      }
    }
  }

  // Mettre à jour les paramètres de notification
  static async updateSettings(userId: string, settings: NotificationSettings): Promise<void> {
    try {
      const existingSettings = await blink.db.notification_settings.list({
        where: { user_id: userId }
      })

      if (existingSettings.length > 0) {
        await blink.db.notification_settings.update(existingSettings[0].id, {
          settings: JSON.stringify(settings)
        })
      } else {
        await blink.db.notification_settings.create({
          id: `settings_${userId}`,
          user_id: userId,
          settings: JSON.stringify(settings),
          created_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error)
    }
  }

  // Envoyer une notification par email
  private static async sendEmailNotification(notification: Notification): Promise<void> {
    try {
      const settings = await this.getSettings(notification.user_id)
      
      if (!settings.email_notifications) {
        return
      }

      // Vérifier si ce type de notification est activé
      const typeEnabled = this.isNotificationTypeEnabled(notification.type, settings)
      if (!typeEnabled) {
        return
      }

      // Récupérer l'email de l'utilisateur
      const user = await blink.auth.me() // Ou récupérer depuis la base
      if (!user?.email) {
        return
      }

      const emailContent = this.generateEmailContent(notification)

      await blink.notifications.email({
        to: user.email,
        subject: `ScaleSEO - ${notification.title}`,
        html: emailContent,
        text: notification.message
      })
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  // Vérifier si un type de notification est activé
  private static isNotificationTypeEnabled(type: string, settings: NotificationSettings): boolean {
    switch (type) {
      case 'audit_complete':
        return settings.audit_complete
      case 'ranking_change':
        return settings.ranking_changes
      case 'new_backlink':
        return settings.new_backlinks
      case 'critical_issue':
        return settings.critical_issues
      case 'report_generated':
        return settings.report_generated
      default:
        return true
    }
  }

  // Générer le contenu HTML de l'email
  private static generateEmailContent(notification: Notification): string {
    const severityColors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }

    const severityIcons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '🚨'
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 20px; }
        .notification { 
          background: white; 
          border-left: 4px solid ${severityColors[notification.severity]}; 
          padding: 15px; 
          margin: 15px 0; 
          border-radius: 4px;
        }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .button { 
          display: inline-block; 
          background: #2563eb; 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 0; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ScaleSEO</h1>
          <p>Notification de votre plateforme SEO</p>
        </div>
        
        <div class="content">
          <div class="notification">
            <h2>${severityIcons[notification.severity]} ${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.project_id ? `<p><strong>Projet:</strong> ${notification.project_id}</p>` : ''}
            <p><strong>Date:</strong> ${new Date(notification.created_at).toLocaleString('fr-FR')}</p>
          </div>
          
          <a href="https://scaleseo-seo-marque-blanche-platform-4a3fdptt.sites.blink.new" class="button">
            Voir dans ScaleSEO
          </a>
        </div>
        
        <div class="footer">
          <p>Vous recevez cet email car vous êtes abonné aux notifications ScaleSEO.</p>
          <p>Pour modifier vos préférences, connectez-vous à votre compte.</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  // Afficher une notification browser
  private static showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg',
        tag: notification.id
      })
    }
  }

  // Demander la permission pour les notifications browser
  static async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Notifications prédéfinies pour différents événements
  static async notifyAuditComplete(projectId: string, userId: string, healthScore: number): Promise<void> {
    await this.create({
      type: 'audit_complete',
      title: 'Audit SEO terminé',
      message: `L'audit SEO a été complété avec un score de santé de ${healthScore}%`,
      severity: healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'error',
      project_id: projectId,
      user_id: userId,
      data: { healthScore }
    })
  }

  static async notifyRankingChange(projectId: string, userId: string, keyword: string, oldPosition: number, newPosition: number): Promise<void> {
    const isImprovement = newPosition < oldPosition
    await this.create({
      type: 'ranking_change',
      title: `Position ${isImprovement ? 'améliorée' : 'dégradée'}`,
      message: `"${keyword}" est passé de la position ${oldPosition} à ${newPosition}`,
      severity: isImprovement ? 'success' : 'warning',
      project_id: projectId,
      user_id: userId,
      data: { keyword, oldPosition, newPosition }
    })
  }

  static async notifyNewBacklink(projectId: string, userId: string, sourceUrl: string, domainAuthority: number): Promise<void> {
    await this.create({
      type: 'new_backlink',
      title: 'Nouveau backlink détecté',
      message: `Nouveau lien depuis ${sourceUrl} (DA: ${domainAuthority})`,
      severity: 'success',
      project_id: projectId,
      user_id: userId,
      data: { sourceUrl, domainAuthority }
    })
  }

  static async notifyCriticalIssue(projectId: string, userId: string, issueTitle: string, issueDescription: string): Promise<void> {
    await this.create({
      type: 'critical_issue',
      title: 'Problème critique détecté',
      message: `${issueTitle}: ${issueDescription}`,
      severity: 'error',
      project_id: projectId,
      user_id: userId,
      data: { issueTitle, issueDescription }
    })
  }

  static async notifyReportGenerated(projectId: string, userId: string, reportUrl: string): Promise<void> {
    await this.create({
      type: 'report_generated',
      title: 'Rapport généré',
      message: 'Votre rapport SEO mensuel est prêt à être téléchargé',
      severity: 'success',
      project_id: projectId,
      user_id: userId,
      data: { reportUrl }
    })
  }
}