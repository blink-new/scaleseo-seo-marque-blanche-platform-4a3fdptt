import React, { useState } from 'react'
import { Play, Download, Bell, RefreshCw, CheckCircle, AlertTriangle, Database, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { GoogleSearchConsoleService, GoogleAnalyticsService, SEMrushService, TestDataService } from '../services/integrations'
import { PDFGeneratorService } from '../services/pdfGenerator'
import { NotificationService } from '../services/notifications'
import { blink } from '../blink/client'

export default function TestCenter() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
  const [results, setResults] = useState<{ [key: string]: any }>({})
  const [testProject, setTestProject] = useState({
    name: 'Site Test SEO',
    website: 'https://example.com',
    keywords: 'seo, marketing digital, référencement',
    competitors: 'competitor1.com, competitor2.com'
  })

  const setLoadingState = (key: string, state: boolean) => {
    setLoading(prev => ({ ...prev, [key]: state }))
  }

  const setResult = (key: string, result: any) => {
    setResults(prev => ({ ...prev, [key]: result }))
  }

  // Test des intégrations API
  const testGoogleSearchConsole = async () => {
    setLoadingState('gsc', true)
    try {
      const data = await GoogleSearchConsoleService.getSearchAnalytics(
        testProject.website,
        '2024-01-01',
        '2024-01-31'
      )
      setResult('gsc', { success: true, data: data.slice(0, 5), total: data.length })
    } catch (error) {
      setResult('gsc', { success: false, error: error.message })
    }
    setLoadingState('gsc', false)
  }

  const testGoogleAnalytics = async () => {
    setLoadingState('ga', true)
    try {
      const data = await GoogleAnalyticsService.getTrafficData(
        '123456789',
        '2024-01-01',
        '2024-01-31'
      )
      setResult('ga', { success: true, data: data.slice(0, 5), total: data.length })
    } catch (error) {
      setResult('ga', { success: false, error: error.message })
    }
    setLoadingState('ga', false)
  }

  const testSEMrush = async () => {
    setLoadingState('semrush', true)
    try {
      const keywords = await SEMrushService.getDomainKeywords('example.com')
      const backlinks = await SEMrushService.getBacklinks('example.com')
      setResult('semrush', { 
        success: true, 
        keywords: keywords.slice(0, 5), 
        backlinks: backlinks.slice(0, 5),
        totalKeywords: keywords.length,
        totalBacklinks: backlinks.length
      })
    } catch (error) {
      setResult('semrush', { success: false, error: error.message })
    }
    setLoadingState('semrush', false)
  }

  // Test de création de projet avec données réelles
  const testCreateProjectWithRealData = async () => {
    setLoadingState('project', true)
    try {
      // Créer le projet
      const project = await blink.db.projects.create({
        id: `test_${Date.now()}`,
        name: testProject.name,
        website: testProject.website,
        keywords: testProject.keywords.split(',').map(k => k.trim()),
        competitors: testProject.competitors.split(',').map(c => c.trim()),
        status: 'active',
        health_score: 0,
        created_at: new Date().toISOString(),
        user_id: 'current_user'
      })

      // Importer les données réelles
      const importResult = await TestDataService.populateRealData(project.id)
      
      setResult('project', { 
        success: true, 
        project,
        importResult
      })
    } catch (error) {
      setResult('project', { success: false, error: error.message })
    }
    setLoadingState('project', false)
  }

  // Test de génération PDF
  const testPDFGeneration = async () => {
    setLoadingState('pdf', true)
    try {
      // Utiliser le premier projet disponible ou créer un projet de test
      const projects = await blink.db.projects.list({ limit: 1 })
      let projectId = projects[0]?.id

      if (!projectId) {
        const testProject = await blink.db.projects.create({
          id: `pdf_test_${Date.now()}`,
          name: 'Projet Test PDF',
          website: 'https://example.com',
          keywords: ['seo', 'marketing'],
          competitors: ['competitor.com'],
          status: 'active',
          health_score: 85,
          created_at: new Date().toISOString(),
          user_id: 'current_user'
        })
        projectId = testProject.id
      }

      const result = await PDFGeneratorService.generateReport('template_default', projectId)
      setResult('pdf', result)
    } catch (error) {
      setResult('pdf', { success: false, error: error.message })
    }
    setLoadingState('pdf', false)
  }

  // Test des notifications
  const testNotifications = async () => {
    setLoadingState('notifications', true)
    try {
      // Créer différents types de notifications de test
      await NotificationService.notifyAuditComplete('test_project', 'current_user', 85)
      await NotificationService.notifyRankingChange('test_project', 'current_user', 'seo marketing', 15, 8)
      await NotificationService.notifyNewBacklink('test_project', 'current_user', 'https://authority-site.com', 75)
      await NotificationService.notifyCriticalIssue('test_project', 'current_user', 'Pages 404', '25 pages retournent une erreur 404')
      
      // Récupérer les notifications créées
      const notifications = await NotificationService.getNotifications('current_user', 10)
      
      setResult('notifications', { 
        success: true, 
        message: '4 notifications de test créées',
        notifications: notifications.slice(0, 4)
      })
    } catch (error) {
      setResult('notifications', { success: false, error: error.message })
    }
    setLoadingState('notifications', false)
  }

  // Test d'envoi d'email
  const testEmailNotification = async () => {
    setLoadingState('email', true)
    try {
      const result = await blink.notifications.email({
        to: 'test@example.com',
        subject: 'Test ScaleSEO - Rapport SEO',
        html: `
          <h1>Rapport SEO Test</h1>
          <p>Ceci est un email de test depuis ScaleSEO.</p>
          <ul>
            <li>✅ Intégrations API fonctionnelles</li>
            <li>✅ Génération PDF opérationnelle</li>
            <li>✅ Notifications en temps réel actives</li>
            <li>✅ Base de données synchronisée</li>
          </ul>
          <p>Votre plateforme SEO est prête !</p>
        `,
        text: 'Test ScaleSEO - Votre plateforme SEO est prête !'
      })
      
      setResult('email', { success: result.success, messageId: result.messageId })
    } catch (error) {
      setResult('email', { success: false, error: error.message })
    }
    setLoadingState('email', false)
  }

  // Test complet du workflow
  const testCompleteWorkflow = async () => {
    setLoadingState('workflow', true)
    try {
      const results = []
      
      // 1. Créer un projet
      const project = await blink.db.projects.create({
        id: `workflow_${Date.now()}`,
        name: 'Test Workflow Complet',
        website: 'https://example.com',
        keywords: ['seo', 'marketing digital'],
        competitors: ['competitor.com'],
        status: 'active',
        health_score: 0,
        created_at: new Date().toISOString(),
        user_id: 'current_user'
      })
      results.push('✅ Projet créé')

      // 2. Simuler un audit SEO
      const audit = await blink.db.seo_audits.create({
        id: `audit_${Date.now()}`,
        project_id: project.id,
        health_score: 78,
        issues: JSON.stringify([
          { title: 'Titres dupliqués', severity: 'warning', count: 5 },
          { title: 'Images sans alt', severity: 'critical', count: 12 }
        ]),
        recommendations: JSON.stringify([
          'Optimiser les titres de pages',
          'Ajouter des attributs alt aux images'
        ]),
        created_at: new Date().toISOString(),
        user_id: 'current_user'
      })
      results.push('✅ Audit SEO effectué')

      // 3. Ajouter des données de performance
      await blink.db.keyword_rankings.create({
        id: `kw_${Date.now()}`,
        project_id: project.id,
        keyword: 'seo marketing',
        position: 12,
        search_volume: 5400,
        difficulty: 65,
        url: 'https://example.com/seo',
        previous_position: 18,
        created_at: new Date().toISOString(),
        user_id: 'current_user'
      })
      results.push('✅ Données de positionnement ajoutées')

      // 4. Générer un rapport
      const reportResult = await PDFGeneratorService.generateReport('template_default', project.id)
      if (reportResult.success) {
        results.push('✅ Rapport PDF généré')
      }

      // 5. Envoyer des notifications
      await NotificationService.notifyAuditComplete(project.id, 'current_user', audit.health_score)
      results.push('✅ Notifications envoyées')

      setResult('workflow', { 
        success: true, 
        project,
        audit,
        results,
        reportUrl: reportResult.url
      })
    } catch (error) {
      setResult('workflow', { success: false, error: error.message })
    }
    setLoadingState('workflow', false)
  }

  const renderResult = (key: string) => {
    const result = results[key]
    if (!result) return null

    return (
      <div className={`mt-3 p-3 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? 'Succès' : 'Erreur'}
          </span>
        </div>
        
        {result.error && (
          <p className="text-red-700 text-sm mb-2">{result.error}</p>
        )}
        
        {result.message && (
          <p className="text-sm mb-2">{result.message}</p>
        )}
        
        {result.data && (
          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        )}
        
        {result.results && (
          <div className="space-y-1">
            {result.results.map((r: string, i: number) => (
              <p key={i} className="text-sm">{r}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre de Tests ScaleSEO</h1>
        <p className="text-gray-600">
          Testez toutes les fonctionnalités de la plateforme avec des données réelles
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integrations">Intégrations API</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Complet</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Google Search Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Test de récupération des données de performance de recherche
                </p>
                <Button 
                  onClick={testGoogleSearchConsole}
                  disabled={loading.gsc}
                  className="w-full"
                >
                  {loading.gsc ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Tester GSC
                </Button>
                {renderResult('gsc')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Google Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Test de récupération des données de trafic organique
                </p>
                <Button 
                  onClick={testGoogleAnalytics}
                  disabled={loading.ga}
                  className="w-full"
                >
                  {loading.ga ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Tester GA
                </Button>
                {renderResult('ga')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SEMrush API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Test de récupération des mots-clés et backlinks
                </p>
                <Button 
                  onClick={testSEMrush}
                  disabled={loading.semrush}
                  className="w-full"
                >
                  {loading.semrush ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Tester SEMrush
                </Button>
                {renderResult('semrush')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du Projet Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Nom du projet</Label>
                  <Input
                    id="project-name"
                    value={testProject.name}
                    onChange={(e) => setTestProject(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-website">Site web</Label>
                  <Input
                    id="project-website"
                    value={testProject.website}
                    onChange={(e) => setTestProject(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-keywords">Mots-clés (séparés par des virgules)</Label>
                  <Textarea
                    id="project-keywords"
                    value={testProject.keywords}
                    onChange={(e) => setTestProject(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="project-competitors">Concurrents (séparés par des virgules)</Label>
                  <Input
                    id="project-competitors"
                    value={testProject.competitors}
                    onChange={(e) => setTestProject(prev => ({ ...prev, competitors: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Création de Projet avec Données Réelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Créer un projet et l'alimenter avec des données réelles des APIs
                  </p>
                  <Button 
                    onClick={testCreateProjectWithRealData}
                    disabled={loading.project}
                    className="w-full"
                  >
                    {loading.project ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    Créer Projet Test
                  </Button>
                  {renderResult('project')}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Génération PDF
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Générer un rapport PDF complet avec toutes les données
                  </p>
                  <Button 
                    onClick={testPDFGeneration}
                    disabled={loading.pdf}
                    className="w-full"
                  >
                    {loading.pdf ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                    Générer PDF
                  </Button>
                  {renderResult('pdf')}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications en Temps Réel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Créer des notifications de test pour tous les types d'événements
                </p>
                <Button 
                  onClick={testNotifications}
                  disabled={loading.notifications}
                  className="w-full"
                >
                  {loading.notifications ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                  Créer Notifications Test
                </Button>
                {renderResult('notifications')}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Envoi d'Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Tester l'envoi d'emails de notification automatiques
                </p>
                <Button 
                  onClick={testEmailNotification}
                  disabled={loading.email}
                  className="w-full"
                >
                  {loading.email ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  Envoyer Email Test
                </Button>
                {renderResult('email')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Test du Workflow Complet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Ce test exécute un workflow complet de A à Z : création de projet, audit SEO, 
                ajout de données de performance, génération de rapport PDF et envoi de notifications.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Étapes du workflow :</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                  <li>Création d'un nouveau projet</li>
                  <li>Exécution d'un audit SEO automatisé</li>
                  <li>Ajout de données de positionnement</li>
                  <li>Génération d'un rapport PDF personnalisé</li>
                  <li>Envoi de notifications en temps réel</li>
                </ol>
              </div>
              
              <Button 
                onClick={testCompleteWorkflow}
                disabled={loading.workflow}
                size="lg"
                className="w-full"
              >
                {loading.workflow ? (
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                Lancer le Test Complet
              </Button>
              
              {renderResult('workflow')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}