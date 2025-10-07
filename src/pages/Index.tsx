
import React, { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import NavigationGuard from '@/components/common/NavigationGuard';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import DashboardOverview from '@/components/Dashboard/DashboardOverview';
import LandMarketplace from '@/components/LandMarketplace/LandMarketplace';
import ProjectList from '@/components/Projects/ProjectList';
import ProjectBriefForm from '@/components/ProjectBrief/ProjectBriefForm';
import MultiDisciplinaryMarketplace from '@/components/Consultants/MultiDisciplinaryMarketplace';
import BidReviewPanel from '@/components/Consultants/BidReviewPanel';
import DesignApprovalWorkflow from '@/components/DesignApproval/DesignApprovalWorkflow';
import ContractorMarketplace from '@/components/Contractors/ContractorMarketplace';
import ProjectManagerMarketplace from '@/components/ProjectManagers/ProjectManagerMarketplace';
import FinancingWorkflow from '@/components/Financing/FinancingWorkflow';
import MyBidsOverview from '@/components/Bids/MyBidsOverview';
import ConstructionMonitoring from '@/components/Construction/ConstructionMonitoring';
import ComplianceHandover from '@/components/Compliance/ComplianceHandover';
import NotificationCenter from '@/components/Notifications/NotificationCenter';
import MessagingCenter from '@/components/Messaging/MessagingCenter';
import type { ProjectBrief } from '@/types';
import type { ConsultantDiscipline } from '@/types/consultant';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const { withErrorHandling } = useErrorHandler();
  const { setCurrentProject } = useProject();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const [userRole, setUserRole] = useState<'developer' | 'consultant' | 'contractor' | 'cpm'>('developer');
  React.useEffect(() => {
    const handler = withErrorHandling((e: CustomEvent) => {
      if (e.detail && typeof e.detail === 'string') {
        setCurrentView(e.detail);
      }
    }, 'navigation event handler');
    
    const listener = (e: Event) => handler(e as unknown as CustomEvent);
    
    try {
      window.addEventListener('app:navigateView', listener);
    } catch (error) {
      console.error('Failed to add navigation event listener:', error);
    }
    
    return () => {
      try {
        window.removeEventListener('app:navigateView', listener);
      } catch (error) {
        console.error('Failed to remove navigation event listener:', error);
      }
    };
  }, [withErrorHandling]);

  const handleLandSelection = withErrorHandling((land: any) => {
    try {
      setSelectedLand(land);
      setCurrentView('project-brief');
      
      toast({
        title: "Land Selected",
        description: `${land.title} has been selected for your project.`
      });
    } catch (error) {
      throw new Error('Failed to select land for project');
    }
  }, 'land selection');

  const handleProjectBriefComplete = withErrorHandling((projectBrief: ProjectBrief) => {
    try {
      console.log('Project Brief Created:', projectBrief);
      setCurrentView('consultants');
      
      toast({
        title: "Project Brief Complete",
        description: "Your project brief has been created. Now find consultants for your project."
      });
    } catch (error) {
      throw new Error('Failed to complete project brief');
    }
  }, 'project brief completion');

  const handleConsultantAppointed = withErrorHandling((discipline: ConsultantDiscipline, consultantId: string) => {
    try {
      console.log('Consultant appointed:', discipline, consultantId);
      
      toast({
        title: "Consultant Appointed",
        description: `${discipline} consultant has been successfully appointed to your project.`,
      });
      
      setCurrentView('design-approval');
    } catch (error) {
      throw new Error('Failed to appoint consultant');
    }
  }, 'consultant appointment');

  const handleBackToLandSelection = withErrorHandling(() => {
    try {
      setSelectedLand(null);
      setCurrentView('land-marketplace');
    } catch (error) {
      throw new Error('Failed to navigate back to land selection');
    }
  }, 'back navigation');

  const renderContent = () => {
    try {
      switch (currentView) {
        case 'dashboard':
          return (
            <NavigationGuard requiresAuth={true}>
              <DashboardOverview />
            </NavigationGuard>
          );
        case 'land-marketplace':
          return (
            <NavigationGuard requiresAuth={true}>
              <LandMarketplace onLandSelect={handleLandSelection} />
            </NavigationGuard>
          );
        case 'project-brief':
          return (
            <NavigationGuard requiresAuth={true}>
              <ProjectBriefForm
                selectedLand={selectedLand}
                onComplete={handleProjectBriefComplete}
                onBack={handleBackToLandSelection}
              />
            </NavigationGuard>
          );
        case 'projects':
          return (
            <NavigationGuard requiresAuth={true}>
              <ProjectList />
            </NavigationGuard>
          );
        case 'consultants':
          return (
            <NavigationGuard requiresAuth={true}>
              <MultiDisciplinaryMarketplace
                projectId="current-project"
                projectType="residential"
                projectLocation="Kuala Lumpur"
                projectBudget={2500000}
                onConsultantAppointed={handleConsultantAppointed}
              />
            </NavigationGuard>
          );
        case 'contractors':
          return (
            <NavigationGuard requiresAuth={true}>
              <ContractorMarketplace 
                userRole={userRole}
                onBidSubmitted={() => {
                  console.log('Contractor bid submitted successfully');
                }}
              />
            </NavigationGuard>
          );
        case 'design-approval':
          return (
            <NavigationGuard requiresAuth={true}>
              <DesignApprovalWorkflow />
            </NavigationGuard>
          );
        case 'cpm':
          return (
            <NavigationGuard requiresAuth={true}>
              <ProjectManagerMarketplace 
                userRole={userRole}
                onEngagementSubmitted={() => {
                  console.log('Project management engagement submitted successfully');
                }}
              />
            </NavigationGuard>
          );
        case 'financing':
          return (
            <NavigationGuard requiresAuth={true}>
              <FinancingWorkflow userRole={userRole === 'developer' ? 'developer' : 'lender'} />
            </NavigationGuard>
          );
        case 'bids':
          return (
            <NavigationGuard requiresAuth={true}>
              <MyBidsOverview userRole={userRole} />
            </NavigationGuard>
          );
        case 'construction':
          return (
            <NavigationGuard requiresAuth={true}>
              <ConstructionMonitoring />
            </NavigationGuard>
          );
        case 'compliance':
          return (
            <NavigationGuard requiresAuth={true}>
              <ComplianceHandover />
            </NavigationGuard>
          );
        case 'notifications':
          return (
            <NavigationGuard requiresAuth={true}>
              <NotificationCenter />
            </NavigationGuard>
          );
        case 'messages':
          return (
            <NavigationGuard requiresAuth={true}>
              <MessagingCenter />
            </NavigationGuard>
          );
        default:
          return (
            <NavigationGuard requiresAuth={true}>
              <DashboardOverview />
            </NavigationGuard>
          );
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
          <EnhancedCard variant="elevated" className="max-w-md">
            <EnhancedCardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2">Content Error</h3>
              <p className="text-muted-foreground mb-4">
                Failed to load the requested content. Please try again.
              </p>
              <EnhancedButton onClick={() => setCurrentView('dashboard')}>
                Return to Dashboard
              </EnhancedButton>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      );
    }
  };


  return (
    <AppLayout currentView={currentView} onViewChange={setCurrentView}>
      {/* Role toggle for demo purposes */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <span className="text-xs text-muted-foreground">Demo Role:</span>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'developer' | 'consultant' | 'contractor' | 'cpm')}
            className="ml-2 text-xs bg-transparent border-0 outline-0"
          >
            <option value="developer">Developer</option>
            <option value="consultant">Consultant</option>
            <option value="contractor">Contractor</option>
            <option value="cpm">Project Manager</option>
          </select>
        </div>
      </div>
      {renderContent()}
    </AppLayout>
  );
};

export default Index;
