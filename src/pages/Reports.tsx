import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Send, Copy, Trash2, Edit, BarChart3, FileText, Image, Table, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ReportTemplate, ReportWidget } from '@/types';

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Mock data
  const [templates] = useState<ReportTemplate[]>([
    {
      id: '1',
      name: 'Rapport Mensuel Standard',
      description: 'Rapport complet avec métriques de performance, audit et recommandations',
      widgets: [
        { id: '1', type: 'metrics', title: 'Métriques Clés', config: {}, position: { x: 0, y: 0 }, size: { width: 12, height: 4 } },
        { id: '2', type: 'chart', title: 'Évolution des Positions', config: {}, position: { x: 0, y: 4 }, size: { width: 8, height: 6 } },
        { id: '3', type: 'table', title: 'Top Mots-clés', config: {}, position: { x: 8, y: 4 }, size: { width: 4, height: 6 } }
      ],
      isDefault: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Audit Technique',
      description: 'Focus sur les problèmes techniques et recommandations de correction',
      widgets: [
        { id: '4', type: 'metrics', title: 'Score de Santé', config: {}, position: { x: 0, y: 0 }, size: { width: 6, height: 4 } },
        { id: '5', type: 'table', title: 'Problèmes Critiques', config: {}, position: { x: 6, y: 0 }, size: { width: 6, height: 8 } }
      ],
      isDefault: false,
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Performance Backlinks',
      description: 'Analyse détaillée des backlinks et autorité de domaine',
      widgets: [
        { id: '6', type: 'chart', title: 'Évolution Backlinks', config: {}, position: { x: 0, y: 0 }, size: { width: 8, height: 6 } },
        { id: '7', type: 'table', title: 'Nouveaux Backlinks', config: {}, position: { x: 8, y: 0 }, size: { width: 4, height: 6 } }
      ],
      isDefault: false,
      createdAt: '2024-01-20'
    }
  ]);

  const availableWidgets = [
    { type: 'metrics', title: 'Métriques', icon: BarChart3, description: 'Affichage des KPIs principaux' },
    { type: 'chart', title: 'Graphique', icon: BarChart3, description: 'Graphiques de tendances et évolutions' },
    { type: 'table', title: 'Tableau', icon: Table, description: 'Données tabulaires détaillées' },
    { type: 'text', title: 'Texte', icon: FileText, description: 'Sections de texte et commentaires' },
    { type: 'image', title: 'Image', icon: Image, description: 'Images et captures d\'écran' }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    isDefault: false
  });

  const handleCreateTemplate = () => {
    console.log('Nouveau template:', newTemplate);
    setIsCreateDialogOpen(false);
    setNewTemplate({ name: '', description: '', isDefault: false });
  };

  const openBuilder = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsBuilderOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Constructeur de Rapports</h1>
          <p className="text-gray-600">Créez et personnalisez vos templates de rapports</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du template</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  placeholder="Ex: Rapport Mensuel Custom"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  placeholder="Décrivez le contenu et l'usage de ce template"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="default"
                  checked={newTemplate.isDefault}
                  onCheckedChange={(checked) => setNewTemplate({...newTemplate, isDefault: checked})}
                />
                <Label htmlFor="default">Template par défaut</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateTemplate} className="bg-blue-600 hover:bg-blue-700">
                  Créer et Éditer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un template..."
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">{template.name}</CardTitle>
                    {template.isDefault && (
                      <Badge className="bg-blue-100 text-blue-800">Défaut</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Widgets Preview */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Composants ({template.widgets.length})</div>
                <div className="flex flex-wrap gap-1">
                  {template.widgets.slice(0, 4).map((widget) => {
                    const widgetType = availableWidgets.find(w => w.type === widget.type);
                    const Icon = widgetType?.icon || FileText;
                    return (
                      <div key={widget.id} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                        <Icon className="w-3 h-3" />
                        <span>{widgetType?.title}</span>
                      </div>
                    );
                  })}
                  {template.widgets.length > 4 && (
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                      +{template.widgets.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => openBuilder(template)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Éditer
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-1" />
                  Dupliquer
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Exporter
                </Button>
              </div>

              {/* Meta */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Créé le {new Date(template.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Builder Modal */}
      <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Constructeur de Rapport - {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex h-[70vh]">
            {/* Widget Library */}
            <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-4">Composants Disponibles</h3>
              <div className="space-y-2">
                {availableWidgets.map((widget) => {
                  const Icon = widget.icon;
                  return (
                    <div
                      key={widget.type}
                      className="p-3 bg-white border rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                      draggable
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-sm">{widget.title}</span>
                      </div>
                      <p className="text-xs text-gray-500">{widget.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg min-h-full p-4">
                <div className="text-center text-gray-500 py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Zone de Construction</h3>
                  <p className="text-sm">
                    Glissez-déposez les composants depuis la bibliothèque pour construire votre rapport
                  </p>
                </div>

                {/* Existing Widgets Preview */}
                {selectedTemplate?.widgets.map((widget) => {
                  const widgetType = availableWidgets.find(w => w.type === widget.type);
                  const Icon = widgetType?.icon || FileText;
                  return (
                    <div
                      key={widget.id}
                      className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-sm">{widget.title}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Type: {widgetType?.title} • Taille: {widget.size.width}x{widget.size.height}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="w-64 border-l bg-gray-50 p-4 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-4">Propriétés</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Titre du rapport</Label>
                  <Input className="mt-1" defaultValue={selectedTemplate?.name} />
                </div>
                
                <div>
                  <Label className="text-sm">Format de sortie</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Orientation</Label>
                  <Select defaultValue="portrait">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Paysage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Planification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-send" />
                      <Label htmlFor="auto-send" className="text-sm">Envoi automatique</Label>
                    </div>
                    
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="quarterly">Trimestriel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Builder Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Aperçu PDF
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Test d'envoi
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Aucun template ne correspond à votre recherche.' : 'Commencez par créer votre premier template.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Créer un template
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;