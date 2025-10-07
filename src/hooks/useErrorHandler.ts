import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorState {
  error: Error | null;
  isError: boolean;
  errorMessage: string | null;
}

export const useErrorHandler = () => {
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorMessage: null
  });

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const message = errorObj.message || 'An unexpected error occurred';
    
    setErrorState({
      error: errorObj,
      isError: true,
      errorMessage: message
    });

    // Log error for debugging
    console.error(`Error${context ? ` in ${context}` : ''}:`, errorObj);

    // Show toast notification
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
      console.error('Production error:', { error: errorObj, context });
    }
  }, [toast]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorMessage: null
    });
  }, []);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => R | Promise<R>,
    context?: string
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        clearError();
        const result = await fn(...args);
        return result;
      } catch (error) {
        handleError(error as Error, context);
        return undefined;
      }
    };
  }, [handleError, clearError]);

  return {
    ...errorState,
    handleError,
    clearError,
    withErrorHandling
  };
};

export default useErrorHandler;