import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project } from '@/types/project';
import { migrateToProjectSchema, mergeProjectData } from '@/utils/projectMigration';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addProject = useCallback((projectData: Partial<Project>): Project => {
    try {
      setIsLoading(true);
      clearError();
      
      const newProject = migrateToProjectSchema({
        ...projectData,
        id: projectData.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

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
  }, [setProjects, toast, clearError]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    try {
      setIsLoading(true);
      clearError();
      
      setProjects(prev => 
        prev.map(project => 
          project.id === id 
            ? mergeProjectData(project, updates)
            : project
        )
      );

      // Update current project if it's the one being updated
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
  }, [setProjects, currentProject, toast, clearError]);

  const deleteProject = useCallback((id: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      const projectToDelete = projects.find(p => p.id === id);
      
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
  }, [setProjects, currentProject, projects, toast, clearError]);

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