import React, { useState, useEffect } from 'react'
import { Bell, X, Check, Settings, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { NotificationService, Notification, NotificationSettings } from '../../services/notifications'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Initialiser le service de notifications
    const initNotifications = async () => {
      await NotificationService.initialize('current_user')
      
      // Charger les notifications existantes
      const existingNotifications = await NotificationService.getNotifications('current_user')
      setNotifications(existingNotifications)
      setUnreadCount(existingNotifications.filter(n => !n.read).length)

      // Charger les paramètres
      const userSettings = await NotificationService.getSettings('current_user')
      setSettings(userSettings)
    }

    initNotifications()

    // Écouter les nouvelles notifications
    const unsubscribe = NotificationService.addListener((notification) => {
      setNotifications(prev => [notification, ...prev])
      if (!notification.read) {
        setUnreadCount(prev => prev + 1)
      }
    })

    // Demander la permission pour les notifications browser
    NotificationService.requestNotificationPermission()

    return unsubscribe
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead('current_user')
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleDelete = async (notificationId: string) => {
    await NotificationService.delete(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId)
      return notification && !notification.read ? prev - 1 : prev
    })
  }

  const handleUpdateSettings = async (newSettings: NotificationSettings) => {
    await NotificationService.updateSettings('current_user', newSettings)
    setSettings(newSettings)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'success': return 'text-green-600 bg-green-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🚨'
      case 'warning': return '⚠️'
      case 'success': return '✅'
      default: return 'ℹ️'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {showSettings && settings ? (
            <div className="flex-1 overflow-y-auto space-y-4">
              <h3 className="font-medium">Paramètres de notification</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Notifications par email</Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, email_notifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Notifications push</Label>
                  <Switch
                    id="push-notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, push_notifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="audit-complete">Audits terminés</Label>
                  <Switch
                    id="audit-complete"
                    checked={settings.audit_complete}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, audit_complete: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ranking-changes">Changements de position</Label>
                  <Switch
                    id="ranking-changes"
                    checked={settings.ranking_changes}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, ranking_changes: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-backlinks">Nouveaux backlinks</Label>
                  <Switch
                    id="new-backlinks"
                    checked={settings.new_backlinks}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, new_backlinks: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="critical-issues">Problèmes critiques</Label>
                  <Switch
                    id="critical-issues"
                    checked={settings.critical_issues}
                    onCheckedChange={(checked) => 
                      handleUpdateSettings({ ...settings, critical_issues: checked })
                    }
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="w-full"
              >
                Retour aux notifications
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">
                                {getSeverityIcon(notification.severity)}
                              </span>
                              <h4 className="font-medium text-sm truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(notification.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}