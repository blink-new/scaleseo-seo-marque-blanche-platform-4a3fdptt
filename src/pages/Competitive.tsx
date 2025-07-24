import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Progress } from '../components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  BarChart3, 
  Target,
  Globe,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { competitorService, projectService } from '../services/database'
import type { Competitor, Project } from '../types'

const Competitive: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState({
    domain: '',
    name: ''
  })

  const loadData = useCallback(async () => {
    try {
      const [competitorsData, projectsData] = await Promise.all([
        competitorService.getCompetitors(selectedProject || undefined),
        projectService.getProjects()
      ])
      setCompetitors(competitorsData)
      setProjects(projectsData)
      
      if (!selectedProject && projectsData.length > 0) {
        setSelectedProject(projectsData[0].id)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    }
  }, [selectedProject])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddCompetitor = async () => {
    if (!newCompetitor.domain || !selectedProject) return

    try {
      await competitorService.addCompetitor({
        projectId: selectedProject,
        domain: newCompetitor.domain,
        name: newCompetitor.name || newCompetitor.domain,
        visibilityScore: Math.random() * 100,
        avgPosition: Math.random() * 50 + 1,
        keywordsCount: Math.floor(Math.random() * 1000) + 100
      })
      
      setNewCompetitor({ domain: '', name: '' })
      setIsAddingCompetitor(false)
      loadData()
    } catch (error) {
      console.error('Erreur lors de l\'ajout du concurrent:', error)
    }
  }

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competitor.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Données mock pour les graphiques
  const visibilityData = [
    { month: 'Jan', client: 65, competitor1: 78, competitor2: 45 },
    { month: 'Fév', client: 68, competitor1: 75, competitor2: 48 },
    { month: 'Mar', client: 72, competitor1: 73, competitor2: 52 },
    { month: 'Avr', client: 75, competitor1: 70, competitor2: 55 },
    { month: 'Mai', client: 78, competitor1: 68, competitor2: 58 },
    { month: 'Jun', client: 82, competitor1: 65, competitor2: 62 }
  ]

  const keywordGapsData = [
    { keyword: 'marketing digital', client: null, competitor1: 3, competitor2: 7, volume: 8100 },
    { keyword: 'seo audit', client: 15, competitor1: 2, competitor2: null, volume: 2400 },
    { keyword: 'référencement naturel', client: null, competitor1: 5, competitor2: 12, volume: 5900 },
    { keyword: 'agence seo', client: 8, competitor1: 1, competitor2: 4, volume: 3200 },
    { keyword: 'consultant seo', client: null, competitor1: 6, competitor2: 9, volume: 1800 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analyse Concurrentielle</h1>
          <p className="text-gray-600 mt-1">Surveillez vos concurrents et identifiez les opportunités</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64">
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

          <Dialog open={isAddingCompetitor} onOpenChange={setIsAddingCompetitor}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Concurrent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un concurrent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="domain">Domaine *</Label>
                  <Input
                    id="domain"
                    placeholder="exemple.com"
                    value={newCompetitor.domain}
                    onChange={(e) => setNewCompetitor(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nom (optionnel)</Label>
                  <Input
                    id="name"
                    placeholder="Nom du concurrent"
                    value={newCompetitor.name}
                    onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingCompetitor(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCompetitor}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="keywords">Écarts de mots-clés</TabsTrigger>
          <TabsTrigger value="backlinks">Profils de liens</TabsTrigger>
          <TabsTrigger value="content">Analyse de contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métriques de comparaison */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Visibilité Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">78.5%</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5.2% vs concurrents</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Position Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">12.3</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-2.1 positions</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mots-clés Communs</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <Plus className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">+12 ce mois</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Opportunités</p>
                    <p className="text-2xl font-bold text-gray-900">34</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <ArrowUpRight className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">Potentiel élevé</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des concurrents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Concurrents Surveillés</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un concurrent..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCompetitors.map((competitor) => (
                  <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                        <p className="text-sm text-gray-600">{competitor.domain}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Visibilité</p>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.visibilityScore} className="w-16" />
                          <span className="text-sm font-medium">{competitor.visibilityScore.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Position Moy.</p>
                        <p className="text-lg font-semibold">{competitor.avgPosition.toFixed(1)}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Mots-clés</p>
                        <p className="text-lg font-semibold">{competitor.keywordsCount}</p>
                      </div>
                      
                      <Badge variant={competitor.visibilityScore > 70 ? "destructive" : "secondary"}>
                        {competitor.visibilityScore > 70 ? "Forte menace" : "Menace modérée"}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredCompetitors.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun concurrent trouvé</h3>
                    <p className="text-gray-600 mb-4">Ajoutez des concurrents pour commencer l'analyse</p>
                    <Button onClick={() => setIsAddingCompetitor(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un concurrent
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Graphique d'évolution de la visibilité */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la Visibilité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="client" stroke="#2563eb" strokeWidth={2} name="Votre site" />
                    <Line type="monotone" dataKey="competitor1" stroke="#dc2626" strokeWidth={2} name="Concurrent 1" />
                    <Line type="monotone" dataKey="competitor2" stroke="#f59e0b" strokeWidth={2} name="Concurrent 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Écarts de Mots-clés</CardTitle>
              <p className="text-sm text-gray-600">
                Identifiez les mots-clés où vos concurrents sont positionnés mais pas vous
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordGapsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.keyword}</h3>
                      <p className="text-sm text-gray-600">{item.volume.toLocaleString()} recherches/mois</p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Votre site</p>
                        {item.client ? (
                          <Badge variant="secondary">#{item.client}</Badge>
                        ) : (
                          <Badge variant="outline">
                            <Minus className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Concurrent 1</p>
                        {item.competitor1 ? (
                          <Badge variant={item.competitor1 <= 3 ? "destructive" : "secondary"}>
                            #{item.competitor1}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Minus className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Concurrent 2</p>
                        {item.competitor2 ? (
                          <Badge variant={item.competitor2 <= 3 ? "destructive" : "secondary"}>
                            #{item.competitor2}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Minus className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      
                      {!item.client && (item.competitor1 || item.competitor2) && (
                        <Badge variant="default" className="bg-orange-100 text-orange-800">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Opportunité
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks">
          <Card>
            <CardHeader>
              <CardTitle>Profils de Liens</CardTitle>
              <p className="text-sm text-gray-600">
                Analysez les stratégies de netlinking de vos concurrents
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyse des backlinks</h3>
                <p className="text-gray-600">Cette fonctionnalité sera disponible prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de Contenu</CardTitle>
              <p className="text-sm text-gray-600">
                Comparez votre stratégie de contenu avec celle de vos concurrents
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analyse de contenu</h3>
                <p className="text-gray-600">Cette fonctionnalité sera disponible prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Competitive