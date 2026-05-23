import { SuccessResponse, ErrorResponse } from '../types';

export function successResponse<T = any>(data?: T, message?: string): SuccessResponse<T> {
  const response: SuccessResponse<T> = { success: true };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  return response;
}

export function errorResponse(message: string, errors?: any): ErrorResponse {
  const response: ErrorResponse = { success: false, message };
  if (errors) response.errors = errors;
  return response;
}
