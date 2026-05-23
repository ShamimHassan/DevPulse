export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'contributor' | 'maintainer';
  created_at: Date;
  updated_at: Date;
}

export interface UserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'contributor' | 'maintainer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: 'bug' | 'feature_request';
  status: 'open' | 'in_progress' | 'resolved';
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IssueWithReporter extends Omit<Issue, 'reporter_id'> {
  reporter: Pick<User, 'id' | 'name' | 'role'>;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  type: 'bug' | 'feature_request';
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  type?: 'bug' | 'feature_request';
}

export interface JwtPayload {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
