import React, { useState } from 'react';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader } from '@/components/ui/enhanced-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedBadge } from '@/components/ui/enhanced-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Users, 
  Mail, 
  Phone, 
  Building,
  Edit,
  Trash2,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { Project, Participant } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectTeamProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const ProjectTeam: React.FC<ProjectTeamProps> = ({ project, onUpdate }) => {
  const { toast } = useToast();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Participant | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'consultant' as Participant['role'],
    company: ''
  });

  const resetMemberForm = () => {
    setMemberForm({
      name: '',
      email: '',
      role: 'consultant',
      company: ''
    });
    setEditingMember(null);
  };

  const handleMemberSubmit = () => {
    if (!memberForm.name.trim() || !memberForm.email.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter name and email.",
        variant: "destructive"
      });
      return;
    }

    const memberData: Participant = {
      id: editingMember?.id || crypto.randomUUID(),
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role,
      company: memberForm.company
    };

    const updatedParticipants = editingMember
      ? project.participants.map(p => p.id === editingMember.id ? memberData : p)
      : [...project.participants, memberData];

    onUpdate({ participants: updatedParticipants });

    toast({
      title: editingMember ? "Team Member Updated" : "Team Member Added",
      description: `${memberData.name} has been ${editingMember ? 'updated' : 'added to'} the project team.`
    });

    setShowMemberModal(false);
    resetMemberForm();
  };

  const handleEditMember = (member: Participant) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      email: member.email || '',
      role: member.role,
      company: member.company || ''
    });
    setShowMemberModal(true);
  };

  const handleDeleteMember = (memberId: string) => {
    const updatedParticipants = project.participants.filter(p => p.id !== memberId);
    onUpdate({ participants: updatedParticipants });
    
    toast({
      title: "Team Member Removed",
      description: "Team member has been removed from the project."
    });
  };

  const getRoleColor = (role: Participant['role']) => {
    switch (role) {
      case 'developer': return 'primary';
      case 'consultant': return 'info';
      case 'contractor': return 'warning';
      case 'cpm': return 'success';
      case 'lender': return 'neutral';
      default: return 'neutral';
    }
  };

  const getRoleIcon = (role: Participant['role']) => {
    switch (role) {
      case 'developer': return '🏗️';
      case 'consultant': return '👨‍💼';
      case 'contractor': return '🔨';
      case 'cpm': return '📋';
      case 'lender': return '💰';
      default: return '👤';
    }
  };

  const groupedParticipants = project.participants.reduce((acc, participant) => {
    if (!acc[participant.role]) acc[participant.role] = [];
    acc[participant.role].push(participant);
    return acc;
  }, {} as Record<string, Participant[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Project Team</h2>
        <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
          <DialogTrigger asChild>
            <EnhancedButton className="gap-2" onClick={resetMemberForm}>
              <UserPlus className="h-4 w-4" />
              Add Team Member
            </EnhancedButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={memberForm.role} onValueChange={(value: Participant['role']) => 
                    setMemberForm(prev => ({ ...prev, role: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="cpm">Project Manager</SelectItem>
                      <SelectItem value="lender">Lender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={memberForm.company}
                    onChange={(e) => setMemberForm(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <EnhancedButton variant="outline" onClick={() => setShowMemberModal(false)}>
                  Cancel
                </EnhancedButton>
                <EnhancedButton onClick={handleMemberSubmit}>
                  {editingMember ? 'Update Member' : 'Add Member'}
                </EnhancedButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{project.participants.length}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-3xl font-bold text-info">{Object.keys(groupedParticipants).length}</div>
            <div className="text-sm text-muted-foreground">Different Roles</div>
          </div>
        </EnhancedCard>
        <EnhancedCard variant="metric">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">
              {project.participants.filter(p => p.company).length}
            </div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
        </EnhancedCard>
      </div>

      {/* Team Members by Role */}
      {Object.keys(groupedParticipants).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedParticipants).map(([role, members]) => (
            <EnhancedCard key={role} variant="elevated">
              <EnhancedCardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getRoleIcon(role as Participant['role'])}</div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground capitalize">
                      {role.replace('-', ' ')}s
                    </h3>
                    <p className="text-sm text-muted-foreground">{members.length} member(s)</p>
                  </div>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow group">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{member.name}</h4>
                        {member.company && (
                          <p className="text-sm text-muted-foreground">{member.company}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <EnhancedBadge variant={getRoleColor(member.role)} size="sm">
                            {member.role}
                          </EnhancedBadge>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {member.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="h-3 w-3" />
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon-sm"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </EnhancedButton>
                        <EnhancedButton 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </EnhancedButton>
                      </div>
                    </div>
                  ))}
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          ))}
        </div>
      ) : (
        <EnhancedCard variant="elevated">
          <EnhancedCardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Team Members</h3>
            <p className="text-muted-foreground mb-4">
              Add team members to collaborate on this project.
            </p>
            <EnhancedButton onClick={() => setShowMemberModal(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add First Team Member
            </EnhancedButton>
          </EnhancedCardContent>
        </EnhancedCard>
      )}
    </div>
  );
};

export default ProjectTeam;