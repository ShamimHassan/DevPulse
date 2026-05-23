import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, errors?: any) {
    super(StatusCodes.BAD_REQUEST, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', errors?: any) {
    super(StatusCodes.UNAUTHORIZED, message, errors);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden', errors?: any) {
    super(StatusCodes.FORBIDDEN, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Not Found', errors?: any) {
    super(StatusCodes.NOT_FOUND, message, errors);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflict', errors?: any) {
    super(StatusCodes.CONFLICT, message, errors);
  }
}
