import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Filter, ExternalLink, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KeywordRanking, Backlink } from '@/types';

const Performance: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('keywords');

  // Mock data
  const projects = [
    { id: '1', name: 'E-commerce Fashion' },
    { id: '2', name: 'Restaurant Gastronomique' },
    { id: '3', name: 'Cabinet Dentaire' }
  ];

  const keywordRankings: KeywordRanking[] = [
    {
      id: '1',
      projectId: '1',
      keyword: 'mode femme',
      position: 3,
      previousPosition: 5,
      searchVolume: 12000,
      difficulty: 65,
      url: '/collections/femme',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      projectId: '1',
      keyword: 'vêtements tendance',
      position: 8,
      previousPosition: 12,
      searchVolume: 8500,
      difficulty: 72,
      url: '/collections/tendance',
      updatedAt: '2024-01-22'
    },
    {
      id: '3',
      projectId: '1',
      keyword: 'boutique en ligne',
      position: 15,
      previousPosition: 14,
      searchVolume: 15000,
      difficulty: 58,
      url: '/',
      updatedAt: '2024-01-22'
    },
    {
      id: '4',
      projectId: '1',
      keyword: 'robe soirée',
      position: 6,
      previousPosition: 6,
      searchVolume: 5200,
      difficulty: 45,
      url: '/collections/robes',
      updatedAt: '2024-01-22'
    }
  ];

  const backlinks: Backlink[] = [
    {
      id: '1',
      projectId: '1',
      sourceUrl: 'https://blog-mode.fr/tendances-2024',
      targetUrl: 'https://boutique-mode.fr/collections/femme',
      anchorText: 'boutique mode femme',
      domainAuthority: 45,
      status: 'active',
      firstSeen: '2024-01-15',
      lastSeen: '2024-01-22'
    },
    {
      id: '2',
      projectId: '1',
      sourceUrl: 'https://magazine-style.com/shopping-guide',
      targetUrl: 'https://boutique-mode.fr/',
      anchorText: 'boutique-mode.fr',
      domainAuthority: 62,
      status: 'new',
      firstSeen: '2024-01-20',
      lastSeen: '2024-01-22'
    },
    {
      id: '3',
      projectId: '1',
      sourceUrl: 'https://forum-fashion.net/discussion',
      targetUrl: 'https://boutique-mode.fr/collections/tendance',
      anchorText: 'vêtements tendance',
      domainAuthority: 38,
      status: 'lost',
      firstSeen: '2024-01-10',
      lastSeen: '2024-01-18'
    }
  ];

  const positionHistory = [
    { date: '15 Jan', avgPosition: 12.5 },
    { date: '16 Jan', avgPosition: 11.8 },
    { date: '17 Jan', avgPosition: 10.2 },
    { date: '18 Jan', avgPosition: 9.8 },
    { date: '19 Jan', avgPosition: 8.5 },
    { date: '20 Jan', avgPosition: 8.1 },
    { date: '21 Jan', avgPosition: 7.9 },
    { date: '22 Jan', avgPosition: 8.0 }
  ];

  const filteredKeywords = keywordRankings.filter(keyword =>
    keyword.projectId === selectedProject &&
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBacklinks = backlinks.filter(backlink =>
    backlink.projectId === selectedProject &&
    (backlink.sourceUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
     backlink.anchorText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    if (current < previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (current: number, previous?: number) => {
    if (!previous) return 'text-gray-500';
    if (current < previous) return 'text-green-600';
    if (current > previous) return 'text-red-600';
    return 'text-gray-500';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'bg-red-100 text-red-800';
    if (difficulty >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getBacklinkStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDAColor = (da: number) => {
    if (da >= 60) return 'text-green-600 font-semibold';
    if (da >= 40) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suivi de Performance</h1>
          <p className="text-gray-600">Analysez les positions et backlinks de vos projets</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Période
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
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

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Position Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8.0</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +4.5 vs hier
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mots-clés Top 10</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +1 cette semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Backlinks Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">127</div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3 nouveaux
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">DA Moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">42</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2 ce mois
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={positionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis reversed domain={[1, 20]} />
              <Tooltip 
                formatter={(value) => [`Position ${value}`, 'Position Moyenne']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="avgPosition" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs for Keywords and Backlinks */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="keywords">Mots-clés ({filteredKeywords.length})</TabsTrigger>
          <TabsTrigger value="backlinks">Backlinks ({filteredBacklinks.length})</TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="flex space-x-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={activeTab === 'keywords' ? "Rechercher un mot-clé..." : "Rechercher un backlink..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mot-clé</TableHead>
                    <TableHead className="text-center">Position</TableHead>
                    <TableHead className="text-center">Évolution</TableHead>
                    <TableHead className="text-center">Volume</TableHead>
                    <TableHead className="text-center">Difficulté</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-center">Mise à jour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeywords.map((keyword) => (
                    <TableRow key={keyword.id}>
                      <TableCell className="font-medium">{keyword.keyword}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          #{keyword.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {getTrendIcon(keyword.position, keyword.previousPosition)}
                          <span className={`text-sm ${getTrendColor(keyword.position, keyword.previousPosition)}`}>
                            {keyword.previousPosition ? 
                              Math.abs(keyword.position - keyword.previousPosition) : 
                              '-'
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {keyword.searchVolume.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getDifficultyColor(keyword.difficulty)}>
                          {keyword.difficulty}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 truncate max-w-48">
                            {keyword.url}
                          </span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-500">
                        {new Date(keyword.updatedAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlinks" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Texte d'ancrage</TableHead>
                    <TableHead className="text-center">DA</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Première vue</TableHead>
                    <TableHead className="text-center">Dernière vue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBacklinks.map((backlink) => (
                    <TableRow key={backlink.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate max-w-64">
                            {backlink.sourceUrl.replace('https://', '')}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-64">
                            → {backlink.targetUrl.replace('https://', '')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {backlink.anchorText}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={getDAColor(backlink.domainAuthority)}>
                          {backlink.domainAuthority}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getBacklinkStatusColor(backlink.status)}>
                          {backlink.status === 'active' ? 'Actif' :
                           backlink.status === 'new' ? 'Nouveau' : 'Perdu'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-500">
                        {new Date(backlink.firstSeen).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-500">
                        {new Date(backlink.lastSeen).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {((activeTab === 'keywords' && filteredKeywords.length === 0) ||
        (activeTab === 'backlinks' && filteredBacklinks.length === 0)) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {activeTab === 'keywords' ? 
              <TrendingUp className="w-12 h-12 mx-auto" /> :
              <ExternalLink className="w-12 h-12 mx-auto" />
            }
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'keywords' ? 'Aucun mot-clé trouvé' : 'Aucun backlink trouvé'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 
              `Aucun résultat ne correspond à votre recherche "${searchTerm}".` :
              `Aucune donnée disponible pour ce projet.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Performance;