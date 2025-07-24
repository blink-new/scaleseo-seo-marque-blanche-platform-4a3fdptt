import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Globe, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Project } from '@/types';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    website: '',
    keywords: '',
    competitors: '',
    location: '',
    status: 'active' as const
  });

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Fashion',
      website: 'https://boutique-mode.fr',
      agencyId: 'agency1',
      status: 'active',
      healthScore: 85,
      keywords: ['mode femme', 'vêtements tendance', 'boutique en ligne'],
      competitors: ['zalando.fr', 'asos.com'],
      location: 'France',
      createdAt: '2024-01-15',
      lastAudit: '2024-01-20'
    },
    {
      id: '2',
      name: 'Restaurant Gastronomique',
      website: 'https://restaurant-delice.fr',
      agencyId: 'agency1',
      status: 'active',
      healthScore: 92,
      keywords: ['restaurant gastronomique', 'cuisine française', 'réservation restaurant'],
      competitors: ['lafourchette.com', 'opentable.fr'],
      location: 'Paris, France',
      createdAt: '2024-01-10',
      lastAudit: '2024-01-22'
    },
    {
      id: '3',
      name: 'Cabinet Dentaire',
      website: 'https://dentiste-sourire.fr',
      agencyId: 'agency1',
      status: 'paused',
      healthScore: 78,
      keywords: ['dentiste', 'soins dentaires', 'orthodontie'],
      competitors: ['doctolib.fr', 'dentego.fr'],
      location: 'Lyon, France',
      createdAt: '2024-01-05',
      lastAudit: '2024-01-18'
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddProject = () => {
    // Ici on ajouterait la logique pour créer un nouveau projet
    console.log('Nouveau projet:', newProject);
    setIsAddDialogOpen(false);
    setNewProject({
      name: '',
      website: '',
      keywords: '',
      competitors: '',
      location: '',
      status: 'active'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projets Clients</h1>
          <p className="text-gray-600">Gérez vos campagnes SEO et suivez les performances</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Projet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau projet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du projet</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Ex: E-commerce Mode"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={newProject.website}
                    onChange={(e) => setNewProject({...newProject, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="keywords">Mots-clés principaux</Label>
                <Textarea
                  id="keywords"
                  value={newProject.keywords}
                  onChange={(e) => setNewProject({...newProject, keywords: e.target.value})}
                  placeholder="Séparez les mots-clés par des virgules"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="competitors">Concurrents</Label>
                <Textarea
                  id="competitors"
                  value={newProject.competitors}
                  onChange={(e) => setNewProject({...newProject, competitors: e.target.value})}
                  placeholder="Séparez les domaines par des virgules"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Zone géographique</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                    placeholder="Ex: France, Paris"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={newProject.status} onValueChange={(value: any) => setNewProject({...newProject, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="paused">En pause</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddProject} className="bg-blue-600 hover:bg-blue-700">
                  Créer le projet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Globe className="w-4 h-4 mr-1" />
                    {project.website.replace('https://', '')}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir détails</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Générer rapport</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status and Health Score */}
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(project.status)}>
                  {project.status === 'active' ? 'Actif' : 
                   project.status === 'paused' ? 'En pause' : 'Terminé'}
                </Badge>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getHealthScoreColor(project.healthScore)}`}>
                    {project.healthScore}
                  </div>
                  <div className="text-xs text-gray-500">Score santé</div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Mots-clés suivis</div>
                <div className="flex flex-wrap gap-1">
                  {project.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {project.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.keywords.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {project.keywords.length}
                  </div>
                  <div className="text-xs text-gray-500">Mots-clés</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {project.competitors.length}
                  </div>
                  <div className="text-xs text-gray-500">Concurrents</div>
                </div>
              </div>

              {/* Last Audit */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Dernier audit: {new Date(project.lastAudit || project.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Globe className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Commencez par créer votre premier projet.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Créer un projet
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;