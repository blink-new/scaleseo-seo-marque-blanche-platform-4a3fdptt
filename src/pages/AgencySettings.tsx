import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Switch } from '../components/ui/switch'
import { Badge } from '../components/ui/badge'
import { 
  Upload, 
  Palette, 
  Globe, 
  Settings, 
  Eye, 
  Save,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import { agencyService } from '../services/database'
import { blink } from '../blink/client'
import type { Agency } from '../types'

const AgencySettings: React.FC = () => {
  const [agency, setAgency] = useState<Agency | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    domain: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  })

  const loadAgencyData = async () => {
    try {
      setIsLoading(true)
      const agencyData = await agencyService.getAgency()
      
      if (agencyData) {
        setAgency(agencyData)
        setFormData({
          name: agencyData.name || '',
          logoUrl: agencyData.logoUrl || '',
          primaryColor: agencyData.primaryColor || '#2563eb',
          secondaryColor: agencyData.secondaryColor || '#10b981',
          domain: agencyData.domain || '',
          description: agencyData.description || '',
          address: agencyData.address || '',
          phone: agencyData.phone || '',
          email: agencyData.email || '',
          website: agencyData.website || ''
        })
        setLogoPreview(agencyData.logoUrl || '')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de l\'agence:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyCustomColors = (primary: string, secondary: string) => {
    const root = document.documentElement
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--secondary', secondary)
  }

  useEffect(() => {
    loadAgencyData()
  }, [])

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLogoFile(file)
    
    // Créer un aperçu local
    const reader = new FileReader()
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadLogo = async (): Promise<string> => {
    if (!logoFile) return formData.logoUrl

    try {
      const { publicUrl } = await blink.storage.upload(
        logoFile,
        `agency-logos/${Date.now()}-${logoFile.name}`,
        { upsert: true }
      )
      return publicUrl
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error)
      return formData.logoUrl
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Upload du logo si nécessaire
      const logoUrl = await uploadLogo()
      
      const dataToSave = {
        ...formData,
        logoUrl
      }

      if (agency) {
        await agencyService.updateAgency(agency.id, dataToSave)
      } else {
        await agencyService.createAgency(dataToSave)
      }
      
      await loadAgencyData()
      
      // Appliquer les couleurs personnalisées
      applyCustomColors(dataToSave.primaryColor, dataToSave.secondaryColor)
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const previewColors = [
    { name: 'Bleu Professionnel', primary: '#2563eb', secondary: '#10b981' },
    { name: 'Violet Moderne', primary: '#7c3aed', secondary: '#06b6d4' },
    { name: 'Rouge Dynamique', primary: '#dc2626', secondary: '#f59e0b' },
    { name: 'Vert Nature', primary: '#059669', secondary: '#8b5cf6' },
    { name: 'Orange Créatif', primary: '#ea580c', secondary: '#06b6d4' },
    { name: 'Rose Élégant', primary: '#e11d48', secondary: '#10b981' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres de l'Agence</h1>
          <p className="text-gray-600 mt-1">Personnalisez votre plateforme en marque blanche</p>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="branding">Marque & Design</TabsTrigger>
          <TabsTrigger value="company">Informations</TabsTrigger>
          <TabsTrigger value="domain">Domaine</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Logo de l'Agence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-16 w-16 object-contain" />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour télécharger votre logo
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG jusqu'à 2MB
                        </p>
                      </div>
                    </Label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Couleurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Palette de Couleurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Couleur Primaire</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="primary-color"
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="h-10 w-16 rounded border border-gray-300"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary-color">Couleur Secondaire</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        id="secondary-color"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="h-10 w-16 rounded border border-gray-300"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Palettes Prédéfinies</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {previewColors.map((palette, index) => (
                      <button
                        key={index}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          primaryColor: palette.primary,
                          secondaryColor: palette.secondary
                        }))}
                        className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-1">
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div 
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: palette.secondary }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'Agence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agency-name">Nom de l'Agence *</Label>
                  <Input
                    id="agency-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Mon Agence SEO"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Site Web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://monagence.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@monagence.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre agence et vos services..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domaine Personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-domain">Domaine Personnalisé</Label>
                <Input
                  id="custom-domain"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="portail.monagence.com"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Configurez un sous-domaine pour accéder à votre plateforme
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Configuration DNS</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Pour configurer votre domaine personnalisé, ajoutez cet enregistrement CNAME :
                </p>
                <div className="bg-white border rounded p-3 font-mono text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="font-semibold">CNAME</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Nom:</span>
                      <div className="font-semibold">portail</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Valeur:</span>
                      <div className="font-semibold">scaleseo.blink.new</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">SSL/TLS Automatique</h4>
                  <p className="text-sm text-gray-600">Certificat SSL automatique pour votre domaine</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Activé
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aperçu de la Marque Blanche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Header Preview */}
                <div 
                  className="p-4 text-white"
                  style={{ backgroundColor: formData.primaryColor }}
                >
                  <div className="flex items-center gap-3">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-8 w-8 object-contain bg-white rounded p-1" />
                    ) : (
                      <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <h2 className="text-lg font-semibold">{formData.name || 'Nom de l\'Agence'}</h2>
                  </div>
                </div>
                
                {/* Content Preview */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Projets Actifs</span>
                        <div 
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${formData.secondaryColor}20` }}
                        >
                          <Settings 
                            className="h-4 w-4"
                            style={{ color: formData.secondaryColor }}
                          />
                        </div>
                      </div>
                      <div className="text-2xl font-bold">12</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Position Moyenne</span>
                        <div 
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${formData.primaryColor}20` }}
                        >
                          <Settings 
                            className="h-4 w-4"
                            style={{ color: formData.primaryColor }}
                          />
                        </div>
                      </div>
                      <div className="text-2xl font-bold">8.5</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Rapports Envoyés</span>
                        <div 
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${formData.secondaryColor}20` }}
                        >
                          <Mail 
                            className="h-4 w-4"
                            style={{ color: formData.secondaryColor }}
                          />
                        </div>
                      </div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold mb-3">Projets Récents</h3>
                    <div className="space-y-2">
                      {['Site E-commerce', 'Blog Corporate', 'Plateforme SaaS'].map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">{project}</span>
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: formData.primaryColor }}
                            className="text-white"
                          >
                            Voir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AgencySettings