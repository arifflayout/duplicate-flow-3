/**
 * Navigation helper utilities for consistent navigation across the app
 */

export type ViewType = 
  | 'dashboard'
  | 'land-marketplace'
  | 'project-brief'
  | 'projects'
  | 'consultants'
  | 'contractors'
  | 'design-approval'
  | 'cpm'
  | 'financing'
  | 'bids'
  | 'construction'
  | 'compliance'
  | 'notifications'
  | 'messages';

/**
 * Navigate to a specific view using the custom event system
 */
export const navigateToView = (view: ViewType): void => {
  try {
    const event = new CustomEvent('app:navigateView', { 
      detail: view,
      bubbles: true 
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Navigation failed:', error);
    // Fallback to URL navigation
    window.location.href = `/?view=${view}`;
  }
};

/**
 * Navigate to a project detail page
 */
export const navigateToProject = (projectId: string): void => {
  try {
    window.location.href = `/project/${projectId}`;
  } catch (error) {
    console.error('Project navigation failed:', error);
  }
};

/**
 * Navigate to project management page
 */
export const navigateToProjectManagement = (projectId: string): void => {
  try {
    window.location.href = `/project/${projectId}/manage`;
  } catch (error) {
    console.error('Project management navigation failed:', error);
  }
};

/**
 * Safe navigation with error handling
 */
export const safeNavigate = (
  navigationFn: () => void, 
  fallbackView: ViewType = 'dashboard'
): void => {
  try {
    navigationFn();
  } catch (error) {
    console.error('Navigation error, falling back to:', fallbackView);
    navigateToView(fallbackView);
  }
};

/**
 * Check if a view requires authentication
 */
export const requiresAuth = (view: ViewType): boolean => {
  const publicViews: ViewType[] = [];
  return !publicViews.includes(view);
};

/**
 * Check if a view requires an active project
 */
export const requiresProject = (view: ViewType): boolean => {
  const projectRequiredViews: ViewType[] = [
    'consultants',
    'contractors', 
    'design-approval',
    'construction',
    'compliance'
  ];
  return projectRequiredViews.includes(view);
};

/**
 * Get view display name
 */
export const getViewDisplayName = (view: ViewType): string => {
  const displayNames: Record<ViewType, string> = {
    'dashboard': 'Dashboard',
    'land-marketplace': 'Land Marketplace',
    'project-brief': 'Project Brief',
    'projects': 'My Projects',
    'consultants': 'Consultants',
    'contractors': 'Contractors',
    'design-approval': 'Design & Approval',
    'cpm': 'Project Managers',
    'financing': 'Financing',
    'bids': 'My Bids',
    'construction': 'Construction',
    'compliance': 'Compliance',
    'notifications': 'Notifications',
    'messages': 'Messages'
  };
  
  return displayNames[view] || view;
};

/**
 * Validate navigation parameters
 */
export const validateNavigation = (view: ViewType, params?: Record<string, any>): boolean => {
  try {
    // Basic view validation
    if (!view || typeof view !== 'string') {
      return false;
    }

    // Specific validations based on view
    switch (view) {
      case 'project-brief':
        // Could validate if land is selected
        return true;
      case 'consultants':
      case 'contractors':
        // Could validate if project exists
        return true;
      default:
        return true;
    }
  } catch (error) {
    console.error('Navigation validation failed:', error);
    return false;
  }
};