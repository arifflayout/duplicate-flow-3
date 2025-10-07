// Mock API utilities - replace with actual API calls in production

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const mockApiCall = async <T>(
  data: T,
  delay: number = 1000,
  shouldFail: boolean = false
): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  if (shouldFail) {
    throw new ApiError('Mock API error', 500, 'MOCK_ERROR');
  }
  
  return data;
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Mock API endpoints
export const api = {
  auth: {
    login: async (email: string, password: string, role: string) => {
      return mockApiCall({
        user: {
          id: Math.random().toString(),
          name: email.split('@')[0],
          email,
          role,
          company: `Demo ${role}`
        },
        token: 'mock-jwt-token'
      });
    },
    
    logout: async () => {
      return mockApiCall({ success: true });
    }
  },
  
  projects: {
    list: async () => {
      return mockApiCall([]);
    },
    
    get: async (id: string) => {
      return mockApiCall({ id, name: 'Mock Project' });
    }
  },
  
  bids: {
    list: async (filters?: any) => {
      return mockApiCall([]);
    },
    
    submit: async (bidData: any) => {
      return mockApiCall({ id: Math.random().toString(), ...bidData });
    }
  }
};