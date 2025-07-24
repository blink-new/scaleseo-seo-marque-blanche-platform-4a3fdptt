import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { Checkbox } from '../components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserX,
  Settings,
  Eye,
  Edit,
  Trash2,
  Crown,
  User
} from 'lucide-react'
import { teamService } from '../services/database'
import type { TeamMember } from '../types'

const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'consultant' as 'admin' | 'manager' | 'consultant',
    permissions: [] as string[]
  })

  const roles = [
    { 
      value: 'admin', 
      label: 'Administrateur', 
      description: 'Accès complet à toutes les fonctionnalités',
      icon: Crown,
      color: 'text-red-600 bg-red-100'
    },
    { 
      value: 'manager', 
      label: 'Chef de Projet', 
      description: 'Gestion des projets et équipes',
      icon: Shield,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      value: 'consultant', 
      label: 'Consultant SEO', 
      description: 'Accès aux projets assignés',
      icon: User,
      color: 'text-green-600 bg-green-100'
    }
  ]

  const permissions = [
    { id: 'projects_create', label: 'Créer des projets', category: 'Projets' },
    { id: 'projects_edit', label: 'Modifier les projets', category: 'Projets' },
    { id: 'projects_delete', label: 'Supprimer les projets', category: 'Projets' },
    { id: 'audits_run', label: 'Lancer des audits', category: 'Audits' },
    { id: 'audits_view', label: 'Voir les audits', category: 'Audits' },
    { id: 'reports_create', label: 'Créer des rapports', category: 'Rapports' },
    { id: 'reports_send', label: 'Envoyer des rapports', category: 'Rapports' },
    { id: 'team_invite', label: 'Inviter des membres', category: 'Équipe' },
    { id: 'team_manage', label: 'Gérer l\'équipe', category: 'Équipe' },
    { id: 'settings_agency', label: 'Paramètres agence', category: 'Paramètres' },
    { id: 'settings_billing', label: 'Facturation', category: 'Paramètres' }
  ]

  const defaultPermissions = {
    admin: permissions.map(p => p.id),
    manager: ['projects_create', 'projects_edit', 'audits_run', 'audits_view', 'reports_create', 'reports_send', 'team_invite'],
    consultant: ['audits_view', 'reports_create']
  }

  const loadTeamMembers = async () => {
    try {
      const members = await teamService.getTeamMembers()
      setTeamMembers(members)
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error)
    }
  }

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.name) return

    try {
      await teamService.inviteTeamMember({
        ...inviteForm,
        permissions: inviteForm.permissions.length > 0 ? inviteForm.permissions : defaultPermissions[inviteForm.role]
      })
      
      setInviteForm({
        email: '',
        name: '',
        role: 'consultant',
        permissions: []
      })
      setIsInviting(false)
      loadTeamMembers()
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error)
    }
  }

  const handleRoleChange = (role: 'admin' | 'manager' | 'consultant') => {
    setInviteForm(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role]
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    setInviteForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      await teamService.removeTeamMember(memberId)
      loadTeamMembers()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[2]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, typeof permissions>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de l'Équipe</h1>
          <p className="text-gray-600 mt-1">Invitez et gérez les membres de votre agence</p>
        </div>
        
        <Dialog open={isInviting} onOpenChange={setIsInviting}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Inviter un Membre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inviter un nouveau membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invite-email">Email *</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="membre@exemple.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="invite-name">Nom complet *</Label>
                  <Input
                    id="invite-name"
                    placeholder="Jean Dupont"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>

              {/* Sélection du rôle */}
              <div>
                <Label>Rôle</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {roles.map((role) => {
                    const Icon = role.icon
                    return (
                      <div
                        key={role.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          inviteForm.role === role.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRoleChange(role.value as any)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${role.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{role.label}</h3>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                          <div className={`h-4 w-4 rounded-full border-2 ${
                            inviteForm.role === role.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {inviteForm.role === role.value && (
                              <div className="h-full w-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Permissions personnalisées */}
              <div>
                <Label>Permissions Spécifiques</Label>
                <div className="mt-2 space-y-4">
                  {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={inviteForm.permissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <Label htmlFor={permission.id} className="text-sm">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviting(false)}>
                  Annuler
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer l'Invitation
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
                <p className="text-sm font-medium text-gray-600">Total Membres</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.status === 'active').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.filter(m => m.role === 'admin').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des membres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membres de l'Équipe</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les rôles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers
              .filter(member => !selectedRole || member.role === selectedRole)
              .map((member) => {
                const roleInfo = getRoleInfo(member.role)
                const Icon = roleInfo.icon
                
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${roleInfo.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{roleInfo.label}</Badge>
                          {getStatusBadge(member.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        Invité le {new Date(member.invitedAt).toLocaleDateString('fr-FR')}
                      </p>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier les permissions
                          </DropdownMenuItem>
                          {member.status === 'pending' && (
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Renvoyer l'invitation
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
                <p className="text-gray-600 mb-4">Invitez des membres pour commencer à collaborer</p>
                <Button onClick={() => setIsInviting(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Inviter un membre
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeamManagement