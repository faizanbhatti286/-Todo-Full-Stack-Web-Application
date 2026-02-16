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
  CreateTaskRequest,
  PartialUpdateTaskRequest,
  Task
} from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

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
      credentials: 'include', // Required for CORS with allow_credentials=True
    });

    // Handle errors
    if (!response.ok) {
      let errorData: unknown = null;

      try {
        // Try parsing JSON
        errorData = await response.json();
      } catch {
        // Fallback to text
        const text = await response.text();
        throw new APIError(
          'UNKNOWN_ERROR',
          text || `HTTP ${response.status}: ${response.statusText}`,
          undefined,
          response.status
        );
      }

      // Log only unexpected errors (not validation/auth errors)
      if (response.status >= 500 || response.status === 0) {
        console.error('API Error Response:', response.status, response.statusText, errorData);
      }

      // Check if it's a standard API error response
      if (isAPIErrorResponse(errorData)) {
        throw APIError.fromResponse(errorData, response.status);
      }

      // Handle FastAPI's detail field (most common format)
      if (errorData && typeof errorData === 'object' && 'detail' in errorData) {
        const detail = (errorData as { detail: unknown }).detail;
        const detailMessage = typeof detail === 'string'
          ? detail
          : JSON.stringify(detail);

        // Map specific error messages to error codes
        let errorCode = 'UNKNOWN_ERROR';
        if (response.status === 409) {
          errorCode = 'CONFLICT';
        } else if (response.status === 400) {
          errorCode = 'VALIDATION_ERROR';
        } else if (response.status === 401) {
          errorCode = 'UNAUTHORIZED';
        } else if (response.status === 404) {
          errorCode = 'NOT_FOUND';
        }

        throw new APIError(
          errorCode,
          detailMessage,
          `HTTP ${response.status}`,
          response.status
        );
      }

      // Handle other error formats
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        const message = (errorData as { message: unknown }).message;
        throw new APIError(
          'UNKNOWN_ERROR',
          typeof message === 'string' ? message : 'An unexpected error occurred',
          `HTTP ${response.status}`,
          response.status
        );
      }

      // Fallback error
      throw new APIError(
        'UNKNOWN_ERROR',
        'An unexpected error occurred',
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    // Return JSON response
    // Handle 204 No Content (no response body)
    if (response.status === 204) {
      return null as T;
    }

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
  async getTasks(userId: string, status?: string, category?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);

    const queryString = params.toString();
    const endpoint = `/api/users/${userId}/tasks${queryString ? `?${queryString}` : ''}`;

    return apiRequest<Task[]>(endpoint);
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

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await apiRequest<void>(`/api/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};
