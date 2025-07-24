import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { Switch } from '../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Zap, 
  Plus, 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Calendar,
  Mail,
  BarChart3,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { automationService, projectService } from '../services/database'
import type { AutomationTask, Project } from '../types'

const Automation: React.FC = () => {
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTab, setSelectedTab] = useState('tasks')
  
  const [taskForm, setTaskForm] = useState({
    type: 'audit' as 'audit' | 'report' | 'monitoring',
    projectId: '',
    schedule: 'weekly',
    config: {
      time: '09:00',
      dayOfWeek: '1', // Lundi
      dayOfMonth: '1',
      recipients: [] as string[],
      reportTemplate: '',
      auditDepth: 'standard'
    }
  })

  const taskTypes = [
    {
      value: 'audit',
      label: 'Audit SEO Automatique',
      description: 'Lance des audits techniques périodiques',
      icon: Search,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      value: 'report',
      label: 'Envoi de Rapports',
      description: 'Génère et envoie des rapports automatiquement',
      icon: Mail,
      color: 'bg-green-100 text-green-600'
    },
    {
      value: 'monitoring',
      label: 'Surveillance Continue',
      description: 'Surveille les positions et performances',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const scheduleOptions = [
    { value: 'daily', label: 'Quotidien', description: 'Tous les jours' },
    { value: 'weekly', label: 'Hebdomadaire', description: 'Chaque semaine' },
    { value: 'monthly', label: 'Mensuel', description: 'Chaque mois' },
    { value: 'custom', label: 'Personnalisé', description: 'Définir une fréquence spécifique' }
  ]

  const weekDays = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '0', label: 'Dimanche' }
  ]

  const loadData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        automationService.getAutomationTasks(),
        projectService.getProjects()
      ])
      setAutomationTasks(tasksData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    }
  }

  const calculateNextRun = (schedule: string, config: any): Date => {
    const now = new Date()
    const [hours, minutes] = config.time.split(':').map(Number)
    
    switch (schedule) {
      case 'daily': {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(hours, minutes, 0, 0)
        return tomorrow
      }
        
      case 'weekly': {
        const nextWeek = new Date(now)
        const dayOfWeek = parseInt(config.dayOfWeek)
        const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7
        nextWeek.setDate(nextWeek.getDate() + daysUntilNext)
        nextWeek.setHours(hours, minutes, 0, 0)
        return nextWeek
      }
        
      case 'monthly': {
        const nextMonth = new Date(now)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        nextMonth.setDate(parseInt(config.dayOfMonth))
        nextMonth.setHours(hours, minutes, 0, 0)
        return nextMonth
      }
        
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000) // Demain par défaut
    }
  }

  const generateCronExpression = (schedule: string, config: any): string => {
    const [hours, minutes] = config.time.split(':').map(Number)
    
    switch (schedule) {
      case 'daily':
        return `${minutes} ${hours} * * *`
      case 'weekly':
        return `${minutes} ${hours} * * ${config.dayOfWeek}`
      case 'monthly':
        return `${minutes} ${hours} ${config.dayOfMonth} * *`
      default:
        return `${minutes} ${hours} * * *`
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateTask = async () => {
    if (!taskForm.projectId || !taskForm.type) return

    try {
      const nextRun = calculateNextRun(taskForm.schedule, taskForm.config)
      
      await automationService.createAutomationTask({
        type: taskForm.type,
        projectId: taskForm.projectId,
        schedule: generateCronExpression(taskForm.schedule, taskForm.config),
        config: taskForm.config,
        nextRun: nextRun.toISOString(),
        status: 'active'
      })
      
      setTaskForm({
        type: 'audit',
        projectId: '',
        schedule: 'weekly',
        config: {
          time: '09:00',
          dayOfWeek: '1',
          dayOfMonth: '1',
          recipients: [],
          reportTemplate: '',
          auditDepth: 'standard'
        }
      })
      setIsCreating(false)
      loadData()
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error)
    }
  }



  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await automationService.updateAutomationTask(taskId, { status: newStatus })
      loadData()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTaskTypeInfo = (type: string) => {
    return taskTypes.find(t => t.value === type) || taskTypes[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automatisation</h1>
          <p className="text-gray-600 mt-1">Planifiez et automatisez vos tâches SEO</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Automatisation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle automatisation</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Type de tâche */}
              <div>
                <Label>Type d'automatisation</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {taskTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          taskForm.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setTaskForm(prev => ({ ...prev, type: type.value as any }))}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${type.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Projet */}
              <div>
                <Label htmlFor="project-select">Projet</Label>
                <Select value={taskForm.projectId} onValueChange={(value) => setTaskForm(prev => ({ ...prev, projectId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Planification */}
              <div>
                <Label>Fréquence</Label>
                <Select value={taskForm.schedule} onValueChange={(value) => setTaskForm(prev => ({ ...prev, schedule: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Configuration détaillée */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Heure d'exécution</Label>
                  <Input
                    id="time"
                    type="time"
                    value={taskForm.config.time}
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      config: { ...prev.config, time: e.target.value }
                    }))}
                  />
                </div>

                {taskForm.schedule === 'weekly' && (
                  <div>
                    <Label>Jour de la semaine</Label>
                    <Select 
                      value={taskForm.config.dayOfWeek} 
                      onValueChange={(value) => setTaskForm(prev => ({
                        ...prev,
                        config: { ...prev.config, dayOfWeek: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weekDays.map(day => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {taskForm.schedule === 'monthly' && (
                  <div>
                    <Label htmlFor="day-of-month">Jour du mois</Label>
                    <Input
                      id="day-of-month"
                      type="number"
                      min="1"
                      max="31"
                      value={taskForm.config.dayOfMonth}
                      onChange={(e) => setTaskForm(prev => ({
                        ...prev,
                        config: { ...prev.config, dayOfMonth: e.target.value }
                      }))}
                    />
                  </div>
                )}
              </div>

              {/* Configuration spécifique au type */}
              {taskForm.type === 'report' && (
                <div>
                  <Label htmlFor="recipients">Destinataires (emails séparés par des virgules)</Label>
                  <Input
                    id="recipients"
                    placeholder="client@exemple.com, manager@agence.com"
                    onChange={(e) => setTaskForm(prev => ({
                      ...prev,
                      config: { 
                        ...prev.config, 
                        recipients: e.target.value.split(',').map(email => email.trim()) 
                      }
                    }))}
                  />
                </div>
              )}

              {taskForm.type === 'audit' && (
                <div>
                  <Label>Profondeur de l'audit</Label>
                  <Select 
                    value={taskForm.config.auditDepth} 
                    onValueChange={(value) => setTaskForm(prev => ({
                      ...prev,
                      config: { ...prev.config, auditDepth: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Rapide (pages principales)</SelectItem>
                      <SelectItem value="standard">Standard (jusqu'à 100 pages)</SelectItem>
                      <SelectItem value="deep">Approfondi (site complet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTask}>
                  <Zap className="h-4 w-4 mr-2" />
                  Créer l'Automatisation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tâches Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automationTasks.filter(t => t.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Pause</p>
                <p className="text-2xl font-bold text-gray-900">
                  {automationTasks.filter(t => t.status === 'paused').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Pause className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exécutions Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps Économisé</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Tâches d'Automatisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationTasks.map((task) => {
              const typeInfo = getTaskTypeInfo(task.type)
              const Icon = typeInfo.icon
              const project = projects.find(p => p.id === task.projectId)
              
              return (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${typeInfo.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{typeInfo.label}</h3>
                      <p className="text-sm text-gray-600">
                        {project?.name} • {task.schedule}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(task.status)}
                        <span className="text-xs text-gray-500">
                          Prochaine exécution: {task.nextRun ? new Date(task.nextRun).toLocaleString('fr-FR') : 'Non planifiée'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={task.status === 'active'}
                      onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                    />
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
            
            {automationTasks.length === 0 && (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune automatisation configurée</h3>
                <p className="text-gray-600 mb-4">Créez votre première automatisation pour gagner du temps</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une automatisation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Automation