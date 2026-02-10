/**
 * API Type Definitions
 *
 * TypeScript interfaces for API requests and responses.
 * These types should be kept in sync with the backend API.
 *
 * @see contracts/api-endpoints.md for full API documentation
 */

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Task entity representing a todo item
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  user_id: string;
  created_at: string;  // ISO 8601 timestamp
  updated_at: string;  // ISO 8601 timestamp
}

/**
 * User entity
 */
export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

/**
 * User session with authentication token
 */
export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;  // ISO 8601 timestamp
}

// ============================================================================
// Authentication API
// ============================================================================

/**
 * Login request payload
 */
export interface LoginRequest {
  username_or_email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  email: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Signup response
 */
export interface SignupResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
  email: string;
}

// ============================================================================
// Task API
// ============================================================================

/**
 * Create task request payload
 */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
}

/**
 * Create task response
 */
export interface CreateTaskResponse {
  task: Task;
}

/**
 * Update task request payload (full update - PUT)
 */
export interface UpdateTaskRequest {
  title: string;
  description: string;
  is_completed: boolean;
}

/**
 * Partial update task request payload (PATCH)
 */
export interface PartialUpdateTaskRequest {
  title?: string;
  description?: string;
  is_completed?: boolean;
  status?: 'pending' | 'in_progress' | 'completed';
  category?: string;
}

/**
 * Update task response (both PUT and PATCH)
 */
export interface UpdateTaskResponse {
  task: Task;
}

/**
 * Get single task response
 */
export interface GetTaskResponse {
  task: Task;
}

/**
 * List tasks query parameters
 */
export interface ListTasksParams {
  is_completed?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * List tasks response
 */
export interface ListTasksResponse {
  tasks: Task[];
  total: number;
}

/**
 * Delete task response
 */
export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Standard API error response
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

/**
 * Error codes returned by the API
 */
export enum APIErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

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

  /**
   * Create APIError from error response
   */
  static fromResponse(response: APIErrorResponse, status: number): APIError {
    return new APIError(
      response.error.code,
      response.error.message,
      response.error.details,
      status
    );
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.code === APIErrorCode.UNAUTHORIZED ||
           this.code === APIErrorCode.INVALID_CREDENTIALS;
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.code === APIErrorCode.VALIDATION_ERROR;
  }
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * Task list component state
 */
export interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

/**
 * Task form component state
 */
export interface TaskFormState {
  title: string;
  description: string;
  errors: {
    title?: string;
    description?: string;
  };
  submitting: boolean;
  mode: 'create' | 'edit';
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Toast notification
 */
export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

// ============================================================================
// Form Validation
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Task form validation rules
 */
export const TASK_VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

/**
 * Auth form validation rules
 */
export const AUTH_VALIDATION = {
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
} as const;

// ============================================================================
// API Client Configuration
// ============================================================================

/**
 * API client configuration
 */
export interface APIConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Request options for API calls
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  requiresAuth?: boolean;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if response is an error
 */
export function isAPIErrorResponse(response: unknown): response is APIErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as APIErrorResponse).error === 'object' &&
    'code' in (response as APIErrorResponse).error &&
    'message' in (response as APIErrorResponse).error
  );
}

/**
 * Type guard to check if value is a Task
 */
export function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'is_completed' in value &&
    'user_id' in value
  );
}

/**
 * Type guard to check if value is a User
 */
export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}
