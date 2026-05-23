import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { errorResponse } from '../utils/response';
import { ApiError } from '../utils/errors';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json(errorResponse(error.message, error.errors));
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    errorResponse('Internal server error')
  );
};
