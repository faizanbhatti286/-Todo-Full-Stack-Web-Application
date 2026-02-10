/**
 * API Client for Backend Integration
 *
 * Provides fetch wrapper with JWT authentication and robust error handling
 */

import {
  APIErrorResponse,
  isAPIErrorResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ListTasksResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskResponse,
  PartialUpdateTaskRequest,
  DeleteTaskResponse,
  GetTaskResponse
} from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromResponse(response: APIErrorResponse, status: number): APIError {
    return new APIError(
      response.error.code,
      response.error.message,
      response.error.details,
      status
    );
  }

  isAuthError(): boolean {
    return this.code === 'UNAUTHORIZED' || this.code === 'INVALID_CREDENTIALS';
  }

  isValidationError(): boolean {
    return this.code === 'VALIDATION_ERROR';
  }
}

/**
 * JWT Session Handling
 */
function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('auth_token');
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('auth_token', token);
}

export function clearSessionToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('auth_token');
}

/**
 * Robust API request wrapper
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<T> {
  const token = getSessionToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle errors
    if (!response.ok) {
      let errorData: any = null;

      try {
        // Try parsing JSON
        errorData = await response.json();
      } catch {
        // Fallback to text
        const text = await response.text();
        errorData = {
          error: {
            code: 'UNKNOWN_ERROR',
            message: text || 'Invalid response from server',
            details: `HTTP ${response.status}: ${response.statusText}`
          }
        };
      }

      console.error('API Error Response:', response.status, response.statusText, errorData);

      if (isAPIErrorResponse(errorData)) {
        throw APIError.fromResponse(errorData, response.status);
      }

      throw new APIError(
        'UNKNOWN_ERROR',
        errorData.error?.message || 'An unexpected error occurred',
        errorData.error?.details || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    // Return JSON response
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;

    if (error instanceof TypeError) {
      throw new APIError(
        'NETWORK_ERROR',
        'Unable to connect. Please check your internet connection.',
        error.message
      );
    }

    throw new APIError(
      'UNKNOWN_ERROR',
      'An unexpected error occurred',
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Authentication API Methods
 */
export const authAPI = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  },

  async signup(credentials: SignupRequest): Promise<SignupResponse> {
    return apiRequest<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  },
};

/**
 * Task API Methods
 */
export const taskAPI = {
  async getTasks(userId: string): Promise<Task[]> {
    return apiRequest<Task[]>(`/api/users/${userId}/tasks`);
  },

  async getTask(userId: string, taskId: string): Promise<Task> {
    return apiRequest<Task>(`/api/users/${userId}/tasks/${taskId}`);
  },

  async createTask(userId: string, task: CreateTaskRequest): Promise<Task> {
    return apiRequest<Task>(`/api/users/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  async updateTask(
    userId: string,
    taskId: string,
    updates: PartialUpdateTaskRequest
  ): Promise<Task> {
    return apiRequest<Task>(`/api/users/${userId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(userId: string, taskId: string): Promise<DeleteTaskResponse> {
    return apiRequest<DeleteTaskResponse>(`/api/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};
