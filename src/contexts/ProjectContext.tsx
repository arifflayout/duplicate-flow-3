import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Project } from '@/types/project';
import { migrateToProjectSchema, mergeProjectData } from '@/utils/projectMigration';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      clearError();

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedProjects: Project[] = (data || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        location: p.location || '',
        type: p.type,
        status: p.status,
        startDate: p.start_date || undefined,
        endDate: p.end_date || undefined,
        budget: p.budget || undefined,
        deadline: p.deadline || undefined,
        ltv: p.ltv || undefined,
        participants: [],
        milestones: [],
        financing: undefined,
        monitoring: [],
        compliance: [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      setProjects(mappedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = useCallback(async (projectData: Partial<Project>): Promise<Project> => {
    if (!user) throw new Error('User not authenticated');

    try {
      setIsLoading(true);
      clearError();

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert({
          owner_id: user.id,
          title: projectData.title || 'Untitled Project',
          description: projectData.description,
          location: projectData.location,
          type: projectData.type || 'residential',
          status: projectData.status || 'draft',
          start_date: projectData.startDate,
          end_date: projectData.endDate,
          budget: projectData.budget,
          deadline: projectData.deadline,
          ltv: projectData.ltv,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newProject: Project = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        location: data.location || '',
        type: data.type,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        budget: data.budget,
        deadline: data.deadline,
        ltv: data.ltv,
        participants: [],
        milestones: [],
        financing: undefined,
        monitoring: [],
        compliance: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setProjects(prev => [...prev, newProject]);

      toast({
        title: "Project Created",
        description: `${newProject.title} has been created successfully.`
      });

      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast({
        title: "Error Creating Project",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, clearError]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      setIsLoading(true);
      clearError();

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          location: updates.location,
          type: updates.type,
          status: updates.status,
          start_date: updates.startDate,
          end_date: updates.endDate,
          budget: updates.budget,
          deadline: updates.deadline,
          ltv: updates.ltv,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      setProjects(prev =>
        prev.map(project =>
          project.id === id
            ? mergeProjectData(project, updates)
            : project
        )
      );

      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? mergeProjectData(prev, updates) : null);
      }

      toast({
        title: "Project Updated",
        description: "Project changes have been saved successfully."
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      toast({
        title: "Error Updating Project",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, currentProject, toast, clearError]);

  const deleteProject = useCallback(async (id: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      clearError();

      const projectToDelete = projects.find(p => p.id === id);

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (deleteError) throw deleteError;

      setProjects(prev => prev.filter(project => project.id !== id));

      if (currentProject?.id === id) {
        setCurrentProject(null);
      }

      toast({
        title: "Project Deleted",
        description: `${projectToDelete?.title || 'Project'} has been deleted successfully.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      toast({
        title: "Error Deleting Project",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, currentProject, projects, toast, clearError]);

  const getProjectById = useCallback((id: string): Project | undefined => {
    try {
      clearError();
      return projects.find(project => project.id === id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve project';
      setError(errorMessage);
      return undefined;
    }
  }, [projects]);

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      setCurrentProject,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      isLoading,
      error,
      clearError
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};