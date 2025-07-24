import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, Search, Filter, Download, RefreshCw, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuditIssue } from '@/types';

const AuditSEO: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isScanning, setIsScanning] = useState(false);

  // Mock data
  const projects = [
    { id: '1', name: 'E-commerce Fashion', healthScore: 85 },
    { id: '2', name: 'Restaurant Gastronomique', healthScore: 92 },
    { id: '3', name: 'Cabinet Dentaire', healthScore: 78 }
  ];

  const auditIssues: AuditIssue[] = [
    {
      id: '1',
      projectId: '1',
      type: 'critical',
      category: 'technical',
      title: 'Pages avec erreurs 404',
      description: '12 pages retournent une erreur 404 et sont toujours référencées dans le sitemap',
      url: '/sitemap.xml',
      priority: 1,
      status: 'open',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      projectId: '1',
      type: 'warning',
      category: 'content',
      title: 'Titres dupliqués',
      description: '8 pages ont des titres identiques, ce qui peut nuire au référencement',
      url: '/products/',
      priority: 2,
      status: 'open',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      projectId: '1',
      type: 'critical',
      category: 'performance',
      title: 'Vitesse de chargement lente',
      description: 'Le temps de chargement moyen est de 4.2s, bien au-dessus des recommandations',
      url: '/',
      priority: 1,
      status: 'open',
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      projectId: '1',
      type: 'info',
      category: 'content',
      title: 'Images sans attribut alt',
      description: '23 images n\'ont pas d\'attribut alt défini',
      url: '/gallery/',
      priority: 3,
      status: 'open',
      createdAt: '2024-01-20'
    },
    {
      id: '5',
      projectId: '1',
      type: 'warning',
      category: 'links',
      title: 'Liens internes cassés',
      description: '5 liens internes pointent vers des pages inexistantes',
      url: '/blog/',
      priority: 2,
      status: 'fixed',
      createdAt: '2024-01-18'
    }
  ];

  const currentProject = projects.find(p => p.id === selectedProject);
  const filteredIssues = auditIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || issue.type === filterType;
    const matchesProject = issue.projectId === selectedProject;
    return matchesSearch && matchesFilter && matchesProject;
  });

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'content': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'links': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const issueStats = {
    total: filteredIssues.length,
    critical: filteredIssues.filter(i => i.type === 'critical').length,
    warning: filteredIssues.filter(i => i.type === 'warning').length,
    info: filteredIssues.filter(i => i.type === 'info').length,
    fixed: filteredIssues.filter(i => i.status === 'fixed').length
  };

  const handleStartScan = () => {
    setIsScanning(true);
    // Simuler un scan
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit SEO Technique</h1>
          <p className="text-gray-600">Analysez et corrigez les problèmes techniques de vos sites</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button 
            onClick={handleStartScan}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scan en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Nouveau Scan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Project Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Projet:</span>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64">
            <SelectValue />
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

      {/* Health Score Overview */}
      {currentProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Score de Santé Global
              <div className="text-3xl font-bold text-blue-600">
                {currentProject.healthScore}/100
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={currentProject.healthScore} className="mb-4" />
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{issueStats.critical}</div>
                <div className="text-sm text-gray-500">Critiques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{issueStats.warning}</div>
                <div className="text-sm text-gray-500">Avertissements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{issueStats.info}</div>
                <div className="text-sm text-gray-500">Informations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{issueStats.fixed}</div>
                <div className="text-sm text-gray-500">Corrigés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un problème..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="critical">Critiques</SelectItem>
            <SelectItem value="warning">Avertissements</SelectItem>
            <SelectItem value="info">Informations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Issues List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous ({issueStats.total})</TabsTrigger>
          <TabsTrigger value="open">Ouverts ({issueStats.total - issueStats.fixed})</TabsTrigger>
          <TabsTrigger value="fixed">Corrigés ({issueStats.fixed})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className={`border-l-4 ${getIssueColor(issue.type)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium">{issue.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(issue.category)}>
                      {issue.category === 'technical' ? 'Technique' :
                       issue.category === 'content' ? 'Contenu' :
                       issue.category === 'performance' ? 'Performance' : 'Liens'}
                    </Badge>
                    {issue.status === 'fixed' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Corrigé
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>URL: {issue.url}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(issue.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                    {issue.status === 'open' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Marquer comme corrigé
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          {filteredIssues.filter(i => i.status === 'open').map((issue) => (
            <Card key={issue.id} className={`border-l-4 ${getIssueColor(issue.type)}`}>
              {/* Same card content as above */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium">{issue.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(issue.category)}>
                    {issue.category === 'technical' ? 'Technique' :
                     issue.category === 'content' ? 'Contenu' :
                     issue.category === 'performance' ? 'Performance' : 'Liens'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>URL: {issue.url}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(issue.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Marquer comme corrigé
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fixed" className="space-y-4">
          {filteredIssues.filter(i => i.status === 'fixed').map((issue) => (
            <Card key={issue.id} className="border-l-4 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium text-green-800">{issue.title}</CardTitle>
                      <p className="text-green-600 mt-1">{issue.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Corrigé
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun problème trouvé</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Aucun problème ne correspond à votre recherche.' : 'Votre site semble en parfaite santé !'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditSEO;